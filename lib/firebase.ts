import { getStorage } from "firebase/storage";
import { initializeApp, getApps, getApp } from "firebase/app";

const app = !getApps().length
  ? initializeApp({
      apiKey: process.env.NEXT_PUBLIC_APP_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_APP_AUTHDOMAIN,
      projectId: process.env.NEXT_PUBLIC_APP_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_APP_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_APP_APP_ID,
    })
  : getApp();

export const storage = getStorage();

export default app;
