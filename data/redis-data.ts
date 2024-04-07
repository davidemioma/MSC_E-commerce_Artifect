import prismadb from "@/lib/prisma";
import { redis } from "@/lib/redis";

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
