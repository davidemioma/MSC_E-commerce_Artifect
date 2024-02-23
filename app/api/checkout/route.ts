import Stripe from "stripe";
import prismadb from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { currentRole, currentUser } from "@/lib/auth";
import { ProductStatus, UserRole } from "@prisma/client";
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

    const { cartItems } = validatedBody;

    if (cartItems.length === 0) {
      return new NextResponse("Cart items are required", { status: 400 });
    }

    const products = (
      await Promise.all(
        cartItems.map(async (item) => {
          const product = await prismadb.product.findUnique({
            where: {
              id: item.productId,
              status: ProductStatus.APPROVED,
            },
            select: {
              id: true,
              name: true,
              storeId: true,
            },
          });

          const productItem = await prismadb.productItem.findUnique({
            where: {
              id: item.productItemId,
            },
            select: {
              id: true,
              images: true,
            },
          });

          const availableItem = await prismadb.available.findUnique({
            where: {
              id: item.availableItemId,
            },
            select: {
              id: true,
              currentPrice: true,
              numInStocks: true,
            },
          });

          if (!product || !productItem || !availableItem) {
            return null;
          }

          return {
            product,
            productItem,
            availableItem,
            quantity: item.quantity,
          };
        })
      )
    ).filter(Boolean);

    if (products.length === 0) {
      return new NextResponse("Sorry, You have no product.", {
        status: 400,
      });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((element) => {
      if (element !== null) {
        line_items.push({
          quantity: element.quantity,
          price_data: {
            currency: "GBP",
            product_data: {
              name: element.product.name,
              images: element.productItem.images,
            },
            unit_amount: Math.round(element.availableItem.currentPrice) * 100,
          },
        });
      }
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
      products.map(async (element) => {
        if (element !== null) {
          await prismadb.orderItem.create({
            data: {
              orderId: order.id,
              storeId: element?.product.storeId,
              productId: element?.product.id,
              productItemId: element?.productItem.id,
              availableItemId: element?.availableItem.id,
              quantity: element?.quantity,
            },
          });
        }
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
