import Stripe from "stripe";
import prismadb from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { currentRole, currentUser } from "@/lib/auth";
import { CartItemsSchema } from "@/lib/validators/cart-item";

export async function POST(request: Request) {
  try {
    //Check if there is a current user
    const { user } = await currentUser();

    if (!user) {
      return new NextResponse(
        "User must be logged in to perform this action.",
        { status: 401 }
      );
    }

    const { role } = await currentRole();

    //Check if current role is USER
    if (role !== UserRole.USER) {
      return new NextResponse("You do not have permission to use stripe.", {
        status: 401,
      });
    }

    const body = await request.json();

    let validatedBody;

    try {
      validatedBody = CartItemsSchema.parse(body);
    } catch (err) {
      return NextResponse.json("Invalid Credentials", { status: 400 });
    }

    const { cartId } = validatedBody;

    //Check if user has a cart
    const cart = await prismadb.cart.findUnique({
      where: {
        id: cartId,
        userId: user.id,
      },
    });

    if (!cart) {
      return new NextResponse("Your cart is empty! Try adding to cart.", {
        status: 400,
      });
    }

    const cartItems = await prismadb.cartItem.findMany({
      where: {
        cartId: cart.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            storeId: true,
          },
        },
        productItem: {
          select: {
            id: true,
            images: true,
          },
        },
        availableItem: {
          select: {
            id: true,
            currentPrice: true,
            numInStocks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (cartItems.length === 0) {
      return new NextResponse("Your cart is empty! Try adding to cart.", {
        status: 400,
      });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    cartItems.forEach((item) => {
      const unit_amount = Math.round(item.availableItem.currentPrice * 100);

      line_items.push({
        price_data: {
          product_data: {
            name: item?.product.name,
            images: item.productItem.images,
          },
          unit_amount,
          currency: "gbp",
        },
        quantity: item.quantity,
      });
    });

    if (line_items.length === 0) {
      return new NextResponse("Stripe Error! Line items empty", {
        status: 400,
      });
    }

    const order = await prismadb.order.create({
      data: {
        userId: user.id,
      },
    });

    await Promise.all(
      cartItems.map(async (item) => {
        await prismadb.orderItem.create({
          data: {
            orderId: order.id,
            storeId: item?.product.storeId,
            productId: item?.product.id,
            productItemId: item?.productItem.id,
            availableItemId: item?.availableItem.id,
            quantity: item?.quantity,
          },
        });
      })
    );

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      customer_email: user?.email || "",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      metadata: {
        userId: user.id,
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.log("[CHECKOUT_SESSION_ERROR]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
