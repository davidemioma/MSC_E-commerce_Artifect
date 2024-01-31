import prismadb from "@/lib/prisma";

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await prismadb.account.findFirst({
      where: {
        userId,
      },
    });

    return account;
  } catch (err) {
    return null;
  }
};
