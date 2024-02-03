import prismadb from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const getUserById = async (id: string) => {
  try {
    const user = await prismadb.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (err) {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (err) {
    return null;
  }
};

export const getUsersByAdmin = async ({
  userId,
  userRole,
}: {
  userId?: string;
  userRole?: UserRole;
}) => {
  try {
    if (!userId || !userRole || userRole !== "ADMIN") {
      return [];
    }

    const users = await prismadb.user.findMany({
      where: {
        id: {
          not: userId,
        },
        role: {
          not: "ADMIN",
        },
      },
    });

    return users;
  } catch (err) {
    return [];
  }
};
