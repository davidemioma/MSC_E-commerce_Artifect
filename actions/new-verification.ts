"use server";

import prismadb from "@/lib/prisma";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  //Check if token exists
  const tokenExists = await getVerificationTokenByToken(token);

  if (!tokenExists) {
    return { error: "Token does not exist!" };
  }

  //Check if token has expired
  const hasExpired = new Date(tokenExists.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  //Check if user exists
  const userExists = await getUserByEmail(tokenExists.email);

  if (!userExists) {
    return { error: "Email does not exist!" };
  }

  //Verify email.
  await prismadb.user.update({
    where: { id: userExists.id },
    data: {
      emailVerified: new Date(),
      email: tokenExists.email, //We just use this for when users want to change their mail.
    },
  });

  //Delete token
  await prismadb.verificationToken.delete({
    where: {
      id: tokenExists.id,
    },
  });

  return { success: "Email verified!" };
};
