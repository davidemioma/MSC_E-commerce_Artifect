import prismadb from "@/lib/prisma";

export const getStoreIds = async () => {
  try {
    const storeIds = await prismadb.store.findMany({
      where: {
        status: "APPROVED",
      },
      select: {
        id: true,
      },
    });

    return storeIds;
  } catch (err) {
    return [];
  }
};

export const getProductIds = async () => {
  try {
    const productIds = await prismadb.product.findMany({
      where: {
        status: "APPROVED",
      },
      select: {
        id: true,
      },
    });

    return productIds;
  } catch (err) {
    return [];
  }
};
