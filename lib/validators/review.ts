import { z } from "zod";

export const ReviewSchema = z.object({
  value: z.coerce.number().min(1).max(5),
  comment: z.string().min(1, { message: "Comment is required." }),
});

export type ReviewValidator = z.infer<typeof ReviewSchema>;
