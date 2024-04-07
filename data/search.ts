import prismadb from "@/lib/prisma";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";

type SearchFiltersProps = {
  query: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minDiscount?: string;
  maxDiscount?: string;
};

export const getProductBySearchQuery = async ({
  query,
  category,
  minPrice,
  maxPrice,
  minDiscount,
  maxDiscount,
}: SearchFiltersProps) => {
  if (query === "") {
    return [];
  }

  try {
    let whereQuery: any = {
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
    };

    if (category !== "") {
      whereQuery.category = {
        name: {
          equals: category,
          mode: "insensitive",
        },
      };
    }

    //  if (minPrice !== undefined && maxPrice !== undefined) {
    //    whereQuery.productItems.some.availableItems.some.currentPrice = {
    //      gte: +minPrice,
    //      lte: +maxPrice,
    //    };
    //  }

    //  if (minDiscount !== undefined && maxDiscount !== undefined) {
    //    whereQuery.productItems.some.discount = {
    //      gte: +minDiscount,
    //      lte: +maxDiscount,
    //    };
    //  }

    const products = await prismadb.product.findMany({
      where: whereQuery,
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
