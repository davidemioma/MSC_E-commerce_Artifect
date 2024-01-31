import prismadb from "@/lib/prisma";

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
