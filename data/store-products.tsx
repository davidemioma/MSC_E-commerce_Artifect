"use server";

import prismadb from "@/lib/prisma";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";

export const getProductStore = async (storeId: string) => {
  try {
    if (!storeId) return null;

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
      },
      include: {
        Banners: {
          where: {
            active: true,
          },
        },
      },
    });

    return store;
  } catch (err) {
    return null;
  }
};

export const getStoreProducts = async ({
  storeId,
  search,
}: {
  storeId: string;
  search: string;
}) => {
  try {
    if (!storeId) return [];

    let products = [];

    if (search && search.trim() !== "") {
      products = await prismadb.product.findMany({
        where: {
          storeId,
          status: "APPROVED",
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { name: { equals: search, mode: "insensitive" } },
            {
              category: {
                name: { contains: search, mode: "insensitive" },
              },
            },
            {
              category: {
                name: { equals: search, mode: "insensitive" },
              },
            },
          ],
          productItems: {
            some: {
              availableItems: {
                some: {
                  numInStocks: {
                    gt: 0,
                  },
                },
              },
            },
          },
        },
        include: {
          category: true,
          productItems: {
            where: {
              availableItems: {
                some: {
                  numInStocks: {
                    gt: 0,
                  },
                },
              },
            },
            include: {
              availableItems: {
                include: {
                  size: true,
                },
              },
            },
          },
          reviews: {
            select: {
              value: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      });
    } else {
      products = await prismadb.product.findMany({
        where: {
          storeId,
          status: "APPROVED",
          productItems: {
            some: {
              availableItems: {
                some: {
                  numInStocks: {
                    gt: 0,
                  },
                },
              },
            },
          },
        },
        include: {
          category: true,
          productItems: {
            where: {
              availableItems: {
                some: {
                  numInStocks: {
                    gt: 0,
                  },
                },
              },
            },
            include: {
              availableItems: {
                include: {
                  size: true,
                },
              },
            },
          },
          reviews: {
            select: {
              value: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      });
    }

    return products;
  } catch (err) {
    return [];
  }
};
