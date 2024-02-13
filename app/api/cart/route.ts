import prismadb from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { currentRole, currentUser } from "@/lib/auth";
import { CartItemSchema } from "@/lib/validators/cart-item";

export async function GET(request: Request) {
  try {
    //Check if there is a current user
    const { user } = await currentUser();

    if (!user) {
      return NextResponse.json({ cart: null });
    }

    const { role } = await currentRole();

    //Change it to user in production
    if (role === UserRole.ADMIN) {
      return NextResponse.json({ cart: null });
    }

    const cart = await prismadb.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        cartItems: {
          include: {
            product: true,
            productItem: true,
            availableItem: {
              include: {
                size: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(cart);
  } catch (err) {
    console.log("[CART_ITEM_GET]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

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

    //Change it to user in production
    if (role === UserRole.ADMIN) {
      return new NextResponse(
        "User does not have permission to add items to the cart.",
        { status: 401 }
      );
    }

    const body = await request.json();

    let validatedBody;

    try {
      validatedBody = CartItemSchema.parse(body);
    } catch (err) {
      return NextResponse.json("Invalid Credentials", { status: 400 });
    }

    const { productId, productItemId, availableItemId } = validatedBody;

    //Check if product exists
    const productExists = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!productExists) {
      return new NextResponse("Product with provided ID does not exist.", {
        status: 404,
      });
    }

    //Check if product item exists
    const productItemExists = await prismadb.productItem.findUnique({
      where: {
        id: productItemId,
      },
    });

    if (!productItemExists) {
      return new NextResponse("Product item with provided ID does not exist.", {
        status: 404,
      });
    }

    //Check if available Item exists
    const availableItemExists = await prismadb.available.findUnique({
      where: {
        id: availableItemId,
      },
    });

    if (!availableItemExists) {
      return new NextResponse(
        "Available item with provided ID does not exist.",
        { status: 404 }
      );
    }

    const cart = await prismadb.cart.upsert({
      where: {
        userId: user.id,
      },
      update: {},
      create: {
        userId: user.id,
      },
    });

    await prismadb.cartItem.upsert({
      where: {
        cartId_productId_productItemId_availableItemId: {
          cartId: cart.id,
          productId,
          productItemId,
          availableItemId,
        },
      },
      update: {
        quantity: {
          increment: 1,
        },
      },
      create: {
        cartId: cart.id,
        productId,
        productItemId,
        availableItemId,
        quantity: 1,
      },
    });

    return NextResponse.json("Item added to cart!");
  } catch (err) {
    console.log("[CART_ITEM_CREATE]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}