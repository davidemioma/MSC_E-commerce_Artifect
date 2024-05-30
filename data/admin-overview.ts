"use server";

import prismadb from "@/lib/prisma";
import { UserRole, storeStatus, ProductStatus } from "@prisma/client";

export const getUsersCount = async (verified?: boolean) => {
  try {
    let userCount = 0;

    if (verified) {
      userCount = await prismadb.user.count({
        where: {
          emailVerified: {
            not: null,
          },
          role: {
            not: UserRole.ADMIN,
          },
        },
      });
    } else {
      userCount = await prismadb.user.count({
        where: {
          emailVerified: null,
          role: {
            not: UserRole.ADMIN,
          },
        },
      });
    }

    return userCount;
  } catch (err) {
    return 0;
  }
};

export const getStoreChartData = async (): Promise<
  { name: string; value: number }[]
> => {
  try {
    const closedStoresCount = await await prismadb.store.count({
      where: {
        emailVerified: {
          not: null,
        },
        status: storeStatus.CLOSED,
      },
    });

    const pendingStoresCount = await await prismadb.store.count({
      where: {
        emailVerified: {
          not: null,
        },
        status: storeStatus.PENDING,
      },
    });

    const approvedStoresCount = await await prismadb.store.count({
      where: {
        emailVerified: {
          not: null,
        },
        status: storeStatus.APPROVED,
      },
    });

    const declinedStoresCount = await await prismadb.store.count({
      where: {
        emailVerified: {
          not: null,
        },
        status: storeStatus.DECLINED,
      },
    });

    const reviewingStoresCount = await await prismadb.store.count({
      where: {
        emailVerified: {
          not: null,
        },
        status: storeStatus.REVIEWING,
      },
    });

    return [
      {
        name: "Pending",
        value: pendingStoresCount + 1,
      },
      {
        name: "Reviewing",
        value: reviewingStoresCount + 1,
      },
      { name: "Delined", value: declinedStoresCount + 1 },
      { name: "Approved", value: approvedStoresCount + 1 },
      { name: "Closed", value: closedStoresCount + 1 },
    ];
  } catch (err) {
    return [];
  }
};

export const getProductChartData = async (): Promise<
  { name: string; value: number }[]
> => {
  try {
    const pendingCount = await await prismadb.product.count({
      where: {
        status: ProductStatus.PENDING,
      },
    });

    const reviewingCount = await await prismadb.product.count({
      where: {
        status: ProductStatus.REVIEWING,
      },
    });

    const approvedCount = await await prismadb.product.count({
      where: {
        status: ProductStatus.APPROVED,
      },
    });

    const declinedCount = await await prismadb.product.count({
      where: {
        status: ProductStatus.DECLINED,
      },
    });

    const archivedCount = await await prismadb.product.count({
      where: {
        status: ProductStatus.ARCHIVED,
      },
    });

    return [
      {
        name: "Pending",
        value: pendingCount + 1,
      },
      {
        name: "Reviewing",
        value: reviewingCount + 1,
      },
      { name: "Delined", value: declinedCount + 1 },
      { name: "Approved", value: approvedCount + 1 },
      { name: "Archived", value: archivedCount + 1 },
    ];
  } catch (err) {
    return [];
  }
};
