import { RekognitionClient } from "@aws-sdk/client-rekognition";

export const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});
