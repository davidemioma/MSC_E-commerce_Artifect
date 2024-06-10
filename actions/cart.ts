"use server";

import prismadb from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { CartItemSchema, CartItemValidator } from "@/lib/validators/cart-item";

export const addToCartHandler = async (values: CartItemValidator) => {
  try {
    //Check if there is a current user
    const { user } = await currentUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized, You need to be logged in.");
    }

    if (user.role !== "USER") {
      throw new Error("Unauthorized, Only users can delete cartItem");
    }

    const validatedBody = CartItemSchema.parse(values);

    if (!validatedBody) {
      throw new Error("Invalid Credentials");
    }

    const { productId, productItemId, availableItemId } = validatedBody;

    //Check if product exists
    const productExists = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!productExists) {
      throw new Error("Product with provided ID does not exist.");
    }

    //Check if product item exists
    const productItemExists = await prismadb.productItem.findUnique({
      where: {
        id: productItemId,
      },
    });

    if (!productItemExists) {
      throw new Error("Product item with provided ID does not exist.");
    }

    //Check if available Item exists
    const availableItemExists = await prismadb.available.findUnique({
      where: {
        id: availableItemId,
      },
    });

    if (!availableItemExists) {
      throw new Error("Available item with provided ID does not exist.");
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

    const cartItemExists = await prismadb.cartItem.findUnique({
      where: {
        cartId_productId_productItemId_availableItemId: {
          cartId: cart.id,
          productId,
          productItemId,
          availableItemId,
        },
      },
      select: {
        quantity: true,
        availableItem: {
          select: {
            numInStocks: true,
          },
        },
      },
    });

    //Check if item is available in stock
    if (
      cartItemExists &&
      cartItemExists.quantity >= cartItemExists.availableItem.numInStocks
    ) {
      throw new Error(
        `Only ${cartItemExists.availableItem.numInStocks} of this item is in stocks!`
      );
    }

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

    return { message: "Item added to cart!" };
  } catch (err) {
    console.log("[CART_ITEM_CREATE]", err);

    throw new Error("Internal server error");
  }
};

export const updateCartItem = async ({
  cartItemId,
  task,
}: {
  cartItemId: string;
  task: "add" | "minus";
}) => {
  try {
    if (!cartItemId) return;

    const { user } = await currentUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized, You need to be logged in.");
    }

    //Check if cart item exists
    const cartItem = await prismadb.cartItem.findUnique({
      where: {
        id: cartItemId,
        cart: {
          user: {
            id: user.id,
            role: "USER",
          },
        },
      },
      select: {
        quantity: true,
        availableItem: {
          select: {
            numInStocks: true,
          },
        },
      },
    });

    if (!cartItem) {
      throw new Error("Cart item not found!");
    }

    if (task === "add") {
      //Check if there is an item in stocks.
      if (cartItem.quantity >= cartItem.availableItem.numInStocks) {
        throw new Error(
          `Only ${cartItem.availableItem.numInStocks} of this item is in stocks!`
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

    return { message: "Cart item updated!" };
  } catch (err) {
    console.log("[CART_ITEM_PATCH]", err);

    throw new Error("Internal server error");
  }
};

export const deleteCartItem = async (cartItemId: string) => {
  try {
    if (!cartItemId) {
      return;
    }

    const { user } = await currentUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized, You need to be logged in.");
    }

    //Check if cart item exists
    const cartItem = await prismadb.cartItem.findUnique({
      where: {
        id: cartItemId,
        cart: {
          user: {
            id: user.id,
            role: "USER",
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!cartItem) {
      throw new Error("Cart item not found!");
    }

    //Delete cart item
    await prismadb.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    return { message: "Cart item deleted!" };
  } catch (err) {
    console.log("[CART_ITEM_DELETE]", err);

    throw new Error("Internal server error");
  }
};
