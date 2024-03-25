import prismadb from "@/lib/prisma";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";

export const getProductBySearchQuery = async (query: string) => {
  if (query === "") {
    return [];
  }

  try {
    const products = await prismadb.product.findMany({
      where: {
        status: "APPROVED",
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: query,
                mode: "insensitive",
              },
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

    return products;
  } catch (err) {
    return [];
  }
};
