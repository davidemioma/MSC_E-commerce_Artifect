import prismadb from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { getOrderStatusValue } from "@/lib/utils";

export const getUserOrdersByStatus = async ({
  userId,
  status,
}: {
  userId: string;
  status: string;
}) => {
  try {
    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user || !user.id) {
      return [];
    }

    let orders = [];

    if (status && status !== "all") {
      orders = await prismadb.order.findMany({
        where: {
          userId: user.id,
          status: getOrderStatusValue(status),
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
              productItem: {
                select: {
                  images: true,
                },
              },
              availableItem: {
                select: {
                  currentPrice: true,
                  size: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      orders = await prismadb.order.findMany({
        where: {
          userId: user.id,
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
              productItem: {
                select: {
                  images: true,
                },
              },
              availableItem: {
                select: {
                  currentPrice: true,
                  size: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return orders;
  } catch (err) {
    return [];
  }
};

export const getStoreOrdersByStatus = async ({
  storeId,
  status,
}: {
  storeId: string;
  status: string;
}) => {
  try {
    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
      },
      select: {
        id: true,
      },
    });

    if (!store || !store.id) {
      return [];
    }

    let orders = [];

    if (status && status !== "all") {
      orders = await prismadb.orderItem.findMany({
        where: {
          storeId: store.id,
          order: {
            status: getOrderStatusValue(status),
          },
        },
        include: {
          order: {
            select: {
              status: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          product: {
            select: {
              name: true,
            },
          },
          productItem: {
            select: {
              images: true,
            },
          },
          availableItem: {
            select: {
              currentPrice: true,
              size: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      orders = await prismadb.orderItem.findMany({
        where: {
          storeId: store.id,
        },
        include: {
          order: {
            select: {
              status: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          product: {
            select: {
              name: true,
            },
          },
          productItem: {
            select: {
              images: true,
            },
          },
          availableItem: {
            select: {
              currentPrice: true,
              size: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return orders;
  } catch (err) {
    return [];
  }
};

export const getAdminOrdersByStatus = async ({
  userId,
  status,
}: {
  userId: string;
  status: string;
}) => {
  try {
    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user || !user.id || user.role !== UserRole.ADMIN) {
      return [];
    }

    let orders = [];

    if (status && status !== "all") {
      orders = await prismadb.order.findMany({
        where: {
          status: getOrderStatusValue(status),
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
              productItem: {
                select: {
                  images: true,
                },
              },
              availableItem: {
                select: {
                  currentPrice: true,
                  size: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      orders = await prismadb.order.findMany({
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
              productItem: {
                select: {
                  images: true,
                },
              },
              availableItem: {
                select: {
                  currentPrice: true,
                  size: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return orders;
  } catch (err) {
    return [];
  }
};
