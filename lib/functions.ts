import { storage } from "./firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const readFileContents = async (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (e: any) => {
      resolve(e.target.result);
    };

    reader.onerror = reject;
  });
};

export const readAllFiles = async (files: any) => {
  const results = await Promise.all(
    files.map(async (file: any) => {
      const fileContents = await readFileContents(file);

      return {
        name: file.name,
        base64: fileContents,
      };
    })
  );

  return results;
};

export const uploadProductImages = async ({
  selectedFiles,
  userId,
  storeId,
}: {
  selectedFiles: any[];
  userId: string | undefined;
  storeId: string | undefined;
}) => {
  if (selectedFiles.length < 1 || !userId) return;

  const uploadPromises = selectedFiles.map(async (file) => {
    const storagePath = `products/${userId}/${storeId}/${file.name}`;

    const imageRef = ref(storage, storagePath);

    await uploadString(imageRef, file.base64, "data_url");

    return getDownloadURL(imageRef);
  });

  const imageUrls = await Promise.all(uploadPromises);

  return imageUrls;
};

export const uploadToStorage = async ({
  file,
  userId,
}: {
  file: string;
  userId: string | undefined;
}) => {
  if (!userId) return;

  const storagePath = `profile/${userId}`;

  const imageRef = ref(storage, storagePath);

  await uploadString(imageRef, file, "data_url");

  const downloadUrl = await getDownloadURL(imageRef);

  return downloadUrl;
};
