import Stripe from "stripe";
import prismadb from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { generateTrackingId } from "@/lib/functions";

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const userId = session?.metadata?.userId;

  if (!userId) {
    return new NextResponse("User ID is required", { status: 400 });
  }

  const orderId = session?.metadata?.orderId;

  if (!orderId) {
    return new NextResponse("Order ID is required", { status: 400 });
  }

  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    const paymentIntentId = session.payment_intent as string;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    //@ts-ignore
    const chargeId = paymentIntent.charges.data[0].id;

    const cart = await prismadb.cart.findUnique({
      where: {
        userId,
      },
    });

    //Delete every item from users cart
    await prismadb.cartItem.deleteMany({
      where: {
        cartId: cart?.id,
      },
    });

    //Generate Tracking ID and checking for uniqueness.
    let trackingId;

    let isUnique = false;

    while (!isUnique) {
      trackingId = generateTrackingId(10);

      const itExists = await prismadb.order.findUnique({
        where: {
          trackingId,
        },
        select: {
          id: true,
        },
      });

      isUnique = itExists === null;
    }

    //Update order address and status
    const order = await prismadb.order.update({
      where: {
        id: orderId,
      },
      data: {
        address: addressString,
        status: OrderStatus.CONFIRMED,
        trackingId,
      },
      include: {
        orderItems: true,
      },
    });

    //Update number of product in stocks for each order item.
    await Promise.all(
      order.orderItems.map(async (orderItem) => {
        await prismadb.available.update({
          where: {
            id: orderItem.availableItemId,
          },
          data: {
            numInStocks: {
              decrement: orderItem.quantity,
            },
          },
        });
      })
    );
  }

  return new NextResponse(null, { status: 200 });
}
