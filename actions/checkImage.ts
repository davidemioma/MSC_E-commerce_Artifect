"use server";

import axios from "axios";
import { rekognitionClient } from "@/lib/aws-client-rekognition";
import { DetectModerationLabelsCommand } from "@aws-sdk/client-rekognition";

type Props = {
  imageUrl: string;
};

export const checkImage = async ({ imageUrl }: Props) => {
  try {
    let url = imageUrl;

    if (!url.trim()) {
      return { error: "Image shound not be empty!" };
    }

    if (url.startsWith("https://firebasestorage.googleapis.com")) {
      url = `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/_next/image?url=${encodeURIComponent(url)}&w=2048&q=75`;
    }

    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const imageBuffer = Buffer.from(response.data);

    const command = new DetectModerationLabelsCommand({
      Image: { Bytes: imageBuffer },
    });

    const result = await rekognitionClient.send(command);

    if (!result.ModerationLabels) {
      return {
        error:
          "Something went wrong! Could not recogonise image. try uploading another image.",
      };
    }

    // Check if any inappropriate content was detected
    const inappropriateLabels = result.ModerationLabels.filter(
      (label) =>
        label.ParentName === "Explicit Nudity" ||
        label.ParentName === "Violence" ||
        label.ParentName === "Offensive Content" ||
        label.ParentName === "Adult Content" ||
        label.ParentName === "Visually Disturbing Content" ||
        label.ParentName === "Prohibited Symbols" ||
        label.ParentName === "Drugs" ||
        label.ParentName === "Weapons" ||
        label.ParentName === "Explicit Text" ||
        label.ParentName === "Profane Text" ||
        label.ParentName === "Tobacco" ||
        label.ParentName === "Graphic Content" ||
        label.ParentName === "Unsafe Activities" ||
        label.ParentName === "Illegal Activities" ||
        label.ParentName === "Sensitive Subjects" ||
        label.ParentName === "Hate Speech"
    );

    return { isAppropiate: inappropriateLabels.length === 0 };
  } catch (err) {
    console.log("CHECK_IMAGE", err);

    return { error: "Something went wrong!" };
  }
};
