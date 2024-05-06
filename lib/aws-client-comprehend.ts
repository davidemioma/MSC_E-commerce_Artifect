import { ComprehendClient } from "@aws-sdk/client-comprehend";

export const comprehendClient = new ComprehendClient({
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});
