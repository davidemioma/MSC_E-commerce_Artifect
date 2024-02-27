import prismadb from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { currentRole, currentUser } from "@/lib/auth";
import { OrderStatus, UserRole } from "@prisma/client";
import { getRefundFailedReason } from "@/lib/functions";

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
      include: {
        orderItems: {
          select: {
            quantity: true,
            availableItem: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return new NextResponse("Order not found!", { status: 404 });
    }

    //Cancel Order.
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId as string,
    });

    if (refund.status !== "succeeded") {
      return new NextResponse(
        `Refund was unsuccessful, reason: ${getRefundFailedReason(
          refund.failure_reason
        )}`,
        {
          status: 400,
        }
      );
    }

    //Update Order status.
    await prismadb.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });

    //Update number of product in stocks for each order item.
    await Promise.all(
      order.orderItems.map(async (orderItem) => {
        await prismadb.available.update({
          where: {
            id: orderItem.availableItem.id,
          },
          data: {
            numInStocks: {
              increment: orderItem.quantity,
            },
          },
        });
      })
    );

    return NextResponse.json({
      message: "Order has been cancelled and refunded!",
    });
  } catch (err) {
    console.log("[CANCEL_ORDER]", err);

    // Handle Stripe specific errors
    if (err instanceof stripe.errors.StripeError) {
      console.log(`Stripe error occurred: ${err.message}`);

      return new NextResponse(`Stripe Error: ${err.message}`, { status: 400 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
