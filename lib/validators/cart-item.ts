import { z } from "zod";

export const CartItemSchema = z.object({
  productId: z.string().min(1),
  productItemId: z.string().min(1),
  availableItemId: z.string().min(1),
});

export const CartItemsSchema = z.object({
  cartItems: z
    .array(
      z.object({
        productId: z.string().min(1),
        productItemId: z.string().min(1),
        availableItemId: z.string().min(1),
        quantity: z.coerce.number().min(1),
      })
    )
    .min(1),
});

export type CartItemValidator = z.infer<typeof CartItemSchema>;

export type CartItemsValidator = z.infer<typeof CartItemsSchema>;
