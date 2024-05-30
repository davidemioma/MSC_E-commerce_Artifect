"use server";

import prismadb from "@/lib/prisma";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation =
      await prismadb.twoFactorConfirmation.findUnique({
        where: {
          userId,
        },
      });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
