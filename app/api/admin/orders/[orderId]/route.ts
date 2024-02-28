import prismadb from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { currentRole, currentUser } from "@/lib/auth";
import { OrderStatusSchema } from "@/lib/validators/order-status";

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

    if (role !== UserRole.ADMIN) {
      return new NextResponse(
        "Unauthorized, Only admin can change order status",
        {
          status: 401,
        }
      );
    }

    //check if order exists
    const order = await prismadb.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return new NextResponse("Order not found!", { status: 404 });
    }

    const body = await request.json();

    let validatedBody;

    try {
      validatedBody = OrderStatusSchema.parse(body);
    } catch (err) {
      return NextResponse.json("Invalid Credentials", { status: 400 });
    }

    const { status } = validatedBody;

    await prismadb.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({ message: "Order status has been updated!" });
  } catch (err) {
    console.log("[CHANGE_ORDER_STATUS]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
