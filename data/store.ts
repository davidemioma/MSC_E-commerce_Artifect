"use server";

import prismadb from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { getStoreStatusValue } from "@/lib/utils";

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

export const getStoresByAdmin = async ({
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

    let stores = [];

    if (status && status !== "all") {
      stores = await prismadb.store.findMany({
        where: {
          status: getStoreStatusValue(status),
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      stores = await prismadb.store.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return stores;
  } catch (err) {
    return [];
  }
};
