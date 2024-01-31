"use server";

import bcrypt from "bcryptjs";
import prismadb from "@/lib/prisma";
import { getUserByEmail } from "@/data/user";
import { getPasswordResetTokenByToken } from "@/data/reset-password-token";
import {
  NewPasswordValidator,
  NewPasswordSchema,
} from "@/lib/validators/new-password";

export const newPassword = async (
  values: NewPasswordValidator,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  //Check if token exists
  const tokenExists = await getPasswordResetTokenByToken(token);

  if (!tokenExists) {
    return { error: "Invalid token!" };
  }

  //Check if token has expired
  const hasExpired = new Date(tokenExists.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  //Check if the user of the token exists.
  const userExists = await getUserByEmail(tokenExists.email);

  if (!userExists) {
    return { error: "Email does not exist!" };
  }

  //Encrypt new password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Update password
  await prismadb.user.update({
    where: {
      id: userExists.id,
    },
    data: {
      hashedPassword,
    },
  });

  //Delete token
  await prismadb.passwordResetToken.delete({
    where: {
      id: tokenExists.id,
    },
  });

  return { success: "Password updated!" };
};
