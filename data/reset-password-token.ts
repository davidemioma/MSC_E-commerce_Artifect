"use server";

import prismadb from "@/lib/prisma";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prismadb.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await prismadb.passwordResetToken.findFirst({
      where: {
        email,
      },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};
