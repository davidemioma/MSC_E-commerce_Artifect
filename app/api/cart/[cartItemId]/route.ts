import { z } from "zod";
import { redis } from "@/lib/redis";
import prismadb from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { currentRole, currentUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { cartItemId: string } }
) {
  try {
    const url = new URL(request.url);

    const { task } = z
      .object({
        task: z.union([z.literal("add"), z.literal("minus")]),
      })
      .parse({
        task: url.searchParams.get("task"),
      });

    const { cartItemId } = params;

    if (!cartItemId) {
      return new NextResponse("Cart item Id is required", { status: 400 });
    }

    //Check if there is a current user
    const { user } = await currentUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized, You need to be logged in.", {
        status: 401,
      });
    }

    //Check if user role is user
    const { role } = await currentRole();

    if (role !== UserRole.USER) {
      return new NextResponse("Unauthorized, Only users can delete cartItem", {
        status: 401,
      });
    }

    //Check if cart item exists
    const cartItem = await prismadb.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
      include: {
        availableItem: {
          select: {
            numInStocks: true,
          },
        },
      },
    });

    if (!cartItem) {
      return new NextResponse("Cart item not found!", { status: 404 });
    }

    if (task === "add") {
      //Check if there is an item in stocks.
      if (cartItem.quantity >= cartItem.availableItem.numInStocks) {
        return new NextResponse(
          `Only ${cartItem.availableItem.numInStocks} of this item is in stocks!`,
          { status: 400 }
        );
      }

      //If there is allow customer to increase quality
      await prismadb.cartItem.update({
        where: {
          id: cartItemId,
        },
        data: {
          quantity: {
            increment: 1,
          },
        },
      });
    } else {
      //If quality is more than 1 then decrease by 1
      if (cartItem.quantity > 1) {
        await prismadb.cartItem.update({
          where: {
            id: cartItemId,
          },
          data: {
            quantity: {
              decrement: 1,
            },
          },
        });
      } else {
        //delete cart item.
        await prismadb.cartItem.delete({
          where: {
            id: cartItemId,
          },
        });
      }
    }

    const newCart = await prismadb.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
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

    await redis.set(`${user.id}-cart`, newCart);

    return NextResponse.json({ message: "Cart item updated!" });
  } catch (err) {
    console.log("[CART_ITEM_PATCH]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { cartItemId: string } }
) {
  try {
    const { cartItemId } = params;

    if (!cartItemId) {
      return new NextResponse("Cart item Id is required", { status: 400 });
    }

    //Check if there is a current user
    const { user } = await currentUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized, You need to be logged in.", {
        status: 401,
      });
    }

    //Check if user role is USER
    const { role } = await currentRole();

    if (role !== UserRole.USER) {
      return new NextResponse("Unauthorized, Only users can delete cartItem", {
        status: 401,
      });
    }

    //Check if cart item exists
    const cartItem = await prismadb.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
    });

    if (!cartItem) {
      return new NextResponse("Cart item not found!", { status: 404 });
    }

    //Delete cart item
    await prismadb.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    const newCart = await prismadb.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
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

    await redis.set(`${user.id}-cart`, newCart);

    return NextResponse.json({ message: "Cart item deleted!" });
  } catch (err) {
    console.log("[CART_ITEM_DELETE]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
