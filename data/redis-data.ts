import prismadb from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { ProductDetailType } from "@/types";

export const getCachedCartData = async (userId?: string) => {
  if (!userId) return null;

  const cachedCart = await redis.get(`${userId}-cart`);

  return cachedCart;
};

export const cacheCartData = async (userId?: string) => {
  if (!userId) return;

  const cart = await prismadb.cart.findUnique({
    where: {
      userId,
    },
    include: {
      cartItems: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
          productItem: true,
          availableItem: {
            include: {
              size: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  await redis.set(`${userId}-cart`, cart);
};

export const getCachedProductData = async (productId?: string) => {
  if (!productId) return null;

  const cachedProduct = await redis.get(`${productId}-product`);

  return cachedProduct as ProductDetailType;
};

export const deleteCachedProductData = async (productId?: string) => {
  if (!productId) return null;

  await redis.del(`${productId}-product`);
};

export const cacheProductData = async (productId?: string) => {
  if (!productId) return;

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

  await redis.set(`${productId}-product`, product);
};
