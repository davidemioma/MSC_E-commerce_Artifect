import { storage } from "./firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export const uploadToStorage = async ({
  file,
  userId,
}: {
  file: string;
  userId: string | undefined;
}) => {
  if (!userId) return;

  const imageRef = ref(storage, `profile/${userId}`);

  await uploadString(imageRef, file, "data_url");

  const downloadUrl = await getDownloadURL(imageRef);

  return downloadUrl;
};
