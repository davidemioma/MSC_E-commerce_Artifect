import Stripe from "stripe";
import { format } from "date-fns";
import prismadb from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { cacheCartData } from "@/data/redis-data";
import { generateTrackingId } from "@/lib/functions";
import { SHIPPING_FEE, TRANSACTION_FEE, formatPrice } from "@/lib/utils";
import {
  sendConfirmationOrderEmail,
  sendStoreConfirmationEmail,
} from "@/lib/mail";

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

  const paymentIntentId = session.payment_intent as string;

  if (!paymentIntentId) {
    return new NextResponse("Payment Intent ID is required", { status: 400 });
  }

  const userId = session?.metadata?.userId;

  if (!userId) {
    return new NextResponse("User ID is required", { status: 400 });
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      email: true,
      name: true,
    },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const orderId = session?.metadata?.orderId;

  if (!orderId) {
    return new NextResponse("Order ID is required", { status: 400 });
  }

  const orderExists = await prismadb.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      id: true,
    },
  });

  if (!orderExists) {
    return new NextResponse("Order not found", { status: 404 });
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

    await cacheCartData(userId);

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
        paymentIntentId,
      },
      include: {
        orderItems: {
          select: {
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
            store: {
              select: {
                email: true,
                name: true,
              },
            },
            availableItemId: true,
            availableItem: {
              select: {
                currentPrice: true,
              },
            },
          },
        },
      },
    });

    //Send confirmation email to user and store
    try {
      const totalAmount =
        order?.orderItems?.reduce(
          (total, item) =>
            total + item.availableItem?.currentPrice * item?.quantity,
          0
        ) +
        TRANSACTION_FEE +
        SHIPPING_FEE;

      await sendConfirmationOrderEmail({
        email: user.email || "",
        username: user.name || "",
        address: addressString,
        totalAmount: `${formatPrice(totalAmount, { currency: "GBP" })}`,
      });

      await Promise.all(
        order.orderItems.map(async (item) => {
          await sendStoreConfirmationEmail({
            email: item.store.email || "",
            storeName: item.store.name || "",
            customerName: user.name || "",
            orderDate: `${format(order.createdAt, "MMMM do, yyyy")}`,
            items: `${item.product.name} (Qty: ${
              item.quantity
            }), price: ${formatPrice(item.availableItem.currentPrice, {
              currency: "GBP",
            })}`,
          });
        })
      );
    } catch (err) {
      console.error("Error sending confirmation email to user:", err);
    }

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
