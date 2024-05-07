"use server";

import { containBadWords } from "@/lib/utils";
import { comprehendClient } from "@/lib/aws-client-comprehend";
import { DetectSentimentCommand } from "@aws-sdk/client-comprehend";

type Props = {
  text: string;
};

export const checkText = async ({ text }: Props) => {
  try {
    if (!text.trim()) {
      return { error: "Text shound not be empty!" };
    }

    const hasBadWords = containBadWords(text);

    if (hasBadWords) {
      return { error: "Text is inappropiate!" };
    }

    const languageCode =
      "en" ||
      "es" ||
      "fr" ||
      "de" ||
      "it" ||
      "pt" ||
      "ar" ||
      "hi" ||
      "ja" ||
      "ko" ||
      "zh" ||
      "zh-TW";

    const command = new DetectSentimentCommand({
      Text: text,
      LanguageCode: languageCode,
    });

    const response = await comprehendClient.send(command);

    return { success: response.Sentiment };
  } catch (err) {
    return { error: "Something went wrong!" };
  }
};
