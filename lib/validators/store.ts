import { z } from "zod";

export const StoreSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  phoneNumber: z
    .string()
    .min(12, { message: "Phone number is required." })
    .max(14, { message: "Invalid phone number format." }),
  country: z.string().min(1, { message: "Country is required." }),
  postcode: z.string().min(1, { message: "Postcode is required." }),
});

export type StoreValidator = z.infer<typeof StoreSchema>;
