import prismadb from "@/lib/prisma";

export const getFirstStoreByUserId = async (userId: string) => {
  try {
    const store = await prismadb.store.findFirst({
      where: {
        userId,
        emailVerified: {
          not: null,
        },
      },
    });

    return store;
  } catch (err) {
    return null;
  }
};

export const getStoresByUserId = async ({ userId }: { userId: string }) => {
  try {
    const stores = await prismadb.store.findMany({
      where: {
        userId,
        emailVerified: {
          not: null,
        },
      },
    });

    return stores;
  } catch (err) {
    return [];
  }
};

export const getStoreById = async ({
  userId,
  storeId,
}: {
  userId: string;
  storeId: string;
}) => {
  try {
    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId,
        emailVerified: {
          not: null,
        },
      },
    });

    return store;
  } catch (err) {
    return null;
  }
};
