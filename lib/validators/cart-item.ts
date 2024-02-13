import { z } from "zod";

export const CartItemSchema = z.object({
  productId: z.string().min(1),
  productItemId: z.string().min(1),
  availableItemId: z.string().min(1),
});

export type CartItemValidator = z.infer<typeof CartItemSchema>;
