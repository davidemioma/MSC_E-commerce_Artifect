"use server";

import prismadb from "@/lib/prisma";
import { RecommendedType } from "@/types";
import { getProductStatusValue } from "@/lib/utils";
import { ProductStatus, UserRole } from "@prisma/client";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";

export const getProductsByAdmin = async ({
  status,
  userRole,
}: {
  status?: string;
  userRole?: UserRole;
}) => {
  try {
    if (!userRole || userRole !== "ADMIN") {
      return [];
    }

    let products = [];

    if (status && status !== "all") {
      products = await prismadb.product.findMany({
        where: {
          status: getProductStatusValue(status),
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              productItems: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      products = await prismadb.product.findMany({
        include: {
          category: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              productItems: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return products;
  } catch (err) {
    return [];
  }
};

export const getHomePageProducts = async () => {
  try {
    const products = await prismadb.product.findMany({
      where: {
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

    return products;
  } catch (err) {
    return [];
  }
};

export const getProductById = async (productId: string) => {
  try {
    if (!productId) {
      return null;
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
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
        store: {
          select: {
            name: true,
            logo: true,
          },
        },
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
              orderBy: {
                createdAt: "desc",
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
    });

    return product;
  } catch (err) {
    return null;
  }
};

export const getRecommendedProducts = async (product: RecommendedType) => {
  try {
    if (!product) return [];

    const recommendedProducts = await prismadb.product.findMany({
      where: {
        id: {
          not: product.id,
        },
        status: ProductStatus.APPROVED,
        OR: [
          {
            category: {
              OR: [
                {
                  name: {
                    contains: product.category?.name,
                  },
                },
                {
                  name: {
                    equals: product.category?.name,
                  },
                },
              ],
            },
          },
          {
            OR: [
              {
                name: {
                  contains: product.name,
                },
              },
              {
                name: {
                  equals: product.name,
                },
              },
            ],
          },
        ],
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
              orderBy: {
                createdAt: "desc",
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
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });

    return recommendedProducts;
  } catch (err) {
    return [];
  }
};
