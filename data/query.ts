import prismadb from "@/lib/prisma";
import { getQueryStatusValue } from "@/lib/utils";

export const getAdminQueries = async (status: string) => {
  try {
    if (!status.trim()) {
      return [];
    }

    let queries = [];

    if (status === "user" || status === "seller") {
      queries = await prismadb.query.findMany({
        where: {
          user: {
            role: status === "user" ? "USER" : "SELLER",
          },
        },
        include: {
          user: {
            select: {
              name: true,
              role: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (status !== "all") {
      queries = await prismadb.query.findMany({
        where: {
          status: getQueryStatusValue(status),
        },
        include: {
          user: {
            select: {
              name: true,
              role: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      queries = await prismadb.query.findMany({
        include: {
          user: {
            select: {
              name: true,
              role: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return queries;
  } catch (err) {
    return [];
  }
};
