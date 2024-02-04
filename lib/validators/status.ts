import { z } from "zod";
import { storeStatus } from "@prisma/client";

export const StatusSchema = z.object({
  status: z.enum([
    storeStatus.APPROVED,
    storeStatus.PENDING,
    storeStatus.DECLINED,
    storeStatus.REVIEWING,
    storeStatus.CLOSED,
  ]),
});

export type StatusValidator = z.infer<typeof StatusSchema>;
