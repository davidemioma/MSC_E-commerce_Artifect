import prismadb from "@/lib/prisma";

export const getStoreVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prismadb.storeVerificationToken.findUnique({
      where: { token },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getStoreVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prismadb.storeVerificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch {
    return null;
  }
};
