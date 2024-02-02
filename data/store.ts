import prismadb from "@/lib/prisma";

export const getFirstStoreByUserId = async (userId: string) => {
  try {
    const store = await prismadb.account.findFirst({
      where: {
        userId,
      },
    });

    return store;
  } catch (err) {
    return null;
  }
};
