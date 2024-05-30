"use server";

import prismadb from "@/lib/prisma";
import { INFINITE_SCROLL_REVIEWS_RESULT } from "@/lib/utils";

export const getReviewsForProduct = async (productId: string) => {
  if (!productId) return [];

  try {
    const reviews = await prismadb.review.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: INFINITE_SCROLL_REVIEWS_RESULT,
    });

    return reviews;
  } catch (err) {
    return [];
  }
};

export const getReviewCount = async (productId: string) => {
  if (!productId) return 0;

  try {
    const reviewCount = await prismadb.review.count({
      where: {
        productId,
      },
    });

    return reviewCount;
  } catch (err) {
    return 0;
  }
};

export const checkIfReviewed = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  if (!userId || !productId) return false;

  try {
    const review = await prismadb.review.count({
      where: {
        productId,
        userId,
      },
    });

    const hasReviewed = review > 0;

    return hasReviewed;
  } catch (err) {
    return false;
  }
};
