import prismadb from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export const getStore = async ({
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
      select: {
        name: true,
        description: true,
      },
    });

    return store;
  } catch (err) {
    return null;
  }
};

export const getStoreBanner = async ({ storeId }: { storeId: string }) => {
  try {
    const banner = await prismadb.banner.findFirst({
      where: {
        storeId,
        active: true,
      },
      select: {
        image: true,
      },
    });

    return banner;
  } catch (err) {
    return null;
  }
};

export const getTotalRevenue = async ({ storeId }: { storeId: string }) => {
  try {
    let totalRevenue = 0;

    const orders = await prismadb.order.findMany({
      where: {
        orderItems: {
          some: {
            storeId,
          },
        },
        status: {
          in: [
            OrderStatus.CONFIRMED,
            OrderStatus.READYFORSHIPPING,
            OrderStatus.SHIPPED,
            OrderStatus.OUTFORDELIVERY,
            OrderStatus.DELIVERED,
            OrderStatus.RETURNREQUESTED,
            OrderStatus.RETURNING,
          ],
        },
      },
      select: {
        orderItems: {
          select: {
            quantity: true,
            availableItem: {
              select: {
                currentPrice: true,
              },
            },
          },
        },
      },
    });

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const itemTotal = item.quantity * item.availableItem.currentPrice;

        totalRevenue += itemTotal;
      });
    });

    return totalRevenue;
  } catch (err) {
    return 0;
  }
};

export const getSalesCountByStoreId = async ({
  storeId,
}: {
  storeId: string;
}) => {
  try {
    const salesCount = await prismadb.order.count({
      where: {
        orderItems: {
          some: {
            storeId,
          },
        },
        status: {
          in: [
            OrderStatus.CONFIRMED,
            OrderStatus.READYFORSHIPPING,
            OrderStatus.SHIPPED,
            OrderStatus.OUTFORDELIVERY,
            OrderStatus.DELIVERED,
            OrderStatus.RETURNREQUESTED,
            OrderStatus.RETURNING,
          ],
        },
      },
    });

    return salesCount;
  } catch (err) {
    return 0;
  }
};

export const getNumOfProductsInStock = async ({
  storeId,
}: {
  storeId: string;
}) => {
  try {
    const productCount = await prismadb.product.count({
      where: {
        storeId,
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
    });

    return productCount;
  } catch (err) {
    return 0;
  }
};

export const getGraphData = async (
  storeId: string
): Promise<{ name: string; total: number }[]> => {
  try {
    if (!storeId) return [];

    const orders = await prismadb.order.findMany({
      where: {
        orderItems: {
          some: {
            storeId,
          },
        },
        status: {
          in: [
            OrderStatus.CONFIRMED,
            OrderStatus.READYFORSHIPPING,
            OrderStatus.SHIPPED,
            OrderStatus.OUTFORDELIVERY,
            OrderStatus.DELIVERED,
            OrderStatus.RETURNREQUESTED,
            OrderStatus.RETURNING,
          ],
        },
      },
      select: {
        orderItems: {
          select: {
            quantity: true,
            availableItem: {
              select: {
                currentPrice: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });

    const monthlyRevenue: { [key: number]: number } = {};

    for (const order of orders) {
      const month = order.createdAt.getMonth();

      let revenueForOrder = 0;

      for (const item of order.orderItems) {
        revenueForOrder += item.availableItem.currentPrice * item.quantity;
      }

      // Adding the revenue for this order to the respective month
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }

    // Converting the grouped data into the format expected by the graph
    const graphData: { name: string; total: number }[] = [
      { name: "Jan", total: 0 },
      { name: "Feb", total: 0 },
      { name: "Mar", total: 0 },
      { name: "Apr", total: 0 },
      { name: "May", total: 0 },
      { name: "Jun", total: 0 },
      { name: "Jul", total: 0 },
      { name: "Aug", total: 0 },
      { name: "Sep", total: 0 },
      { name: "Oct", total: 0 },
      { name: "Nov", total: 0 },
      { name: "Dec", total: 0 },
    ];

    // Filling in the revenue data
    for (const month in monthlyRevenue) {
      graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return graphData;
  } catch (err) {
    return [];
  }
};
