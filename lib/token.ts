import prismadb from "./prisma";
import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "@/data/verification-token";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();

  //This is expiring in 10 mins.
  const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

  //Check if there is an existing verification token for this email.
  const existingToken = await getVerificationTokenByEmail(email);

  //Delete existing token
  if (existingToken) {
    await prismadb.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  //Create a new token.
  const verficationToken = await prismadb.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verficationToken;
};
