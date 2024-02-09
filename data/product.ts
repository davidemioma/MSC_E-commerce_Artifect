import prismadb from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { getProductStatusValue } from "@/lib/utils";

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
