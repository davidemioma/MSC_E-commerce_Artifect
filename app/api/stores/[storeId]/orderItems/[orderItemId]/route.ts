import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentRole, currentUser } from "@/lib/auth";
import { UserRole, OrderStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; orderItemId: string } }
) {
  try {
    const { storeId, orderItemId } = params;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!orderItemId) {
      return new NextResponse("Order item Id is required", { status: 400 });
    }

    //Check if there is a current user
    const { user } = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized, you need to be logged in.", {
        status: 401,
      });
    }

    //Check if user is a seller
    const { role } = await currentRole();

    if (role !== UserRole.SELLER) {
      return new NextResponse("Unauthorized, you need be a seller.", {
        status: 401,
      });
    }

    //Check if the user owns the store
    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId: user.id,
      },
    });

    if (!store) {
      return new NextResponse("Store not found!", { status: 404 });
    }

    //Check if order item exists
    const orderItem = await prismadb.orderItem.findUnique({
      where: {
        id: orderItemId,
        storeId,
      },
    });

    if (!orderItem) {
      return new NextResponse("Order item not found!", { status: 404 });
    }

    //Check if order status is confirmed
    const order = await prismadb.order.findUnique({
      where: {
        id: orderItem.orderId,
      },
      select: {
        status: true,
        orderItems: {
          select: {
            readyToBeShipped: true,
          },
        },
      },
    });

    if (!order) {
      return new NextResponse("Order not found!", { status: 404 });
    }

    if (order?.status !== OrderStatus.CONFIRMED) {
      return new NextResponse(
        "Order not yet confirmed, it needs to be confirmed for shipping",
        { status: 401 }
      );
    }

    const updatedOrderItem = await prismadb.orderItem.update({
      where: {
        id: orderItem.id,
        storeId,
      },
      data: {
        readyToBeShipped: true,
      },
    });

    const updatedOrder = await prismadb.order.findUnique({
      where: {
        id: orderItem.orderId,
      },
      select: {
        orderItems: {
          select: {
            readyToBeShipped: true,
          },
        },
      },
    });

    if (
      updatedOrder?.orderItems.every((item) => item.readyToBeShipped === true)
    ) {
      await prismadb.order.update({
        where: {
          id: updatedOrderItem.orderId,
        },
        data: {
          status: OrderStatus.READYFORSHIPPING,
        },
      });
    }

    return NextResponse.json({ message: "Item is now ready to be shipped!" });
  } catch (err) {
    console.log("[ORDER_ITEM_UPDATE]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
