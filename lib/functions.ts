import { v4 as uuidv4 } from "uuid";
import { storage } from "./firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export const uploadToStorage = async ({
  file,
  userId,
  forProduct,
  productItemId,
}: {
  file: string;
  userId: string | undefined;
  forProduct?: boolean;
  productItemId?: string;
}) => {
  if (!userId) return;

  const storagePath = forProduct
    ? `sellers/${userId}/productItem/${
        productItemId ? productItemId : uuidv4()
      }`
    : `profile/${userId}`;

  const imageRef = ref(storage, storagePath);

  await uploadString(imageRef, file, "data_url");

  const downloadUrl = await getDownloadURL(imageRef);

  return downloadUrl;
};
