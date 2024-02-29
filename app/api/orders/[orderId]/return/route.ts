import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentRole, currentUser } from "@/lib/auth";
import { OrderStatus, UserRole } from "@prisma/client";
import { ReturnSchema } from "@/lib/validators/return";

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return new NextResponse("Order Id is required", { status: 400 });
    }

    //Check if there is a current user
    const { user } = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized, You need to be logged in.", {
        status: 401,
      });
    }

    //Check if user role is user
    const { role } = await currentRole();

    if (role !== UserRole.USER) {
      return new NextResponse("Unauthorized, Only users can cancel orders", {
        status: 401,
      });
    }

    //check if order exists
    const order = await prismadb.order.findUnique({
      where: {
        id: orderId,
        userId: user.id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!order) {
      return new NextResponse("Order not found!", { status: 404 });
    }

    //Check if order status is Delivered
    if (order.status !== OrderStatus.DELIVERED) {
      return new NextResponse("You can request a return at this time", {
        status: 401,
      });
    }

    const body = await request.json();

    let validatedBody;

    try {
      validatedBody = ReturnSchema.parse(body);
    } catch (err) {
      return NextResponse.json("Invalid Credentials", { status: 400 });
    }

    const { orderItemIds, reason } = validatedBody;

    //Create a return request
    const returnRequest = await prismadb.returnRequest.create({
      data: {
        orderId: order.id,
        reason,
      },
      select: {
        id: true,
      },
    });

    //Create request Items
    await Promise.all(
      orderItemIds.map(async (id) => {
        await prismadb.returnItem.create({
          data: {
            orderItemId: id,
            returnRequestId: returnRequest.id,
          },
        });
      })
    );

    //Update order status
    await prismadb.order.update({
      where: {
        id: order.id,
        userId: user.id,
      },
      data: {
        status: OrderStatus.RETURNREQUESTED,
      },
    });

    return NextResponse.json({ message: "Refund request has been submitted!" });
  } catch (err) {
    console.log("[RETURN_REQUEST]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
