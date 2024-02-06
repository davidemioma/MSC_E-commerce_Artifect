import { z } from "zod";

const ProductItemSchema = z.object({
  sizeId: z.string().min(1, { message: "Size is required." }),
  colorId: z.string().min(1, { message: "Color is required." }),
  price: z.coerce.number().min(1, { message: "Price is required." }),
  discount: z.optional(z.coerce.number()),
  numInStocks: z.coerce.number().min(1),
});

export const ProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  categoryId: z.string().min(1, { message: "Category is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  ProductItem: z
    .array(ProductItemSchema)
    .min(1, { message: "At least one product item is required." }),
});

export type ProductValidator = z.infer<typeof ProductSchema>;
