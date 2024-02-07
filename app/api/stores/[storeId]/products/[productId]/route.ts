import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";
import { storeStatus } from "@prisma/client";
import { getCurrentPrice } from "@/lib/utils";
import { currentRole, currentUser } from "@/lib/auth";
import { ProductSchema } from "@/lib/validators/product";

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { storeId, productId } = params;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    //Check if there is a current user
    const { user } = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //Check if user is a seller
    const { role } = await currentRole();

    if (role !== "SELLER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //Check if the user owns the store
    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId: user.id,
      },
    });

    if (!store) {
      return new NextResponse("Store not found!", { status: 404 });
    }

    //Check if store has been approved
    if (store.status !== storeStatus.APPROVED) {
      return new NextResponse("Unauthorized, Store not approved yet!", {
        status: 401,
      });
    }

    const body = await request.json();

    const { name, categoryId, description, productItems } =
      ProductSchema.parse(body);

    //Check if there is at least one product item
    if (productItems.length < 1) {
      return new NextResponse("At least one product item is required.", {
        status: 400,
      });
    }

    //Check if product exists
    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
        storeId,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", {
        status: 404,
      });
    }

    //Check if there is an existing product item
    const existingProductItems = await prismadb.productItem.findMany({
      where: {
        id: {
          in: [...productItems.map((item) => item.id)],
        },
      },
    });

    //if there are existing product items update them else create new ones.
    await Promise.all(
      productItems.map(async (item) => {
        const existingItem = existingProductItems.find(
          (existing) => existing.id === item.id
        );

        if (existingItem) {
          await prismadb.productItem.update({
            where: {
              id: existingItem.id,
              productId: product.id,
            },
            data: {
              sizeId: item.sizeId,
              colorId: item.colorId || undefined,
              imageUrl: item.imageUrl,
              discount: item.discount || 0,
              originalPrice: item.price,
              numInStocks: item.numInStocks,
              currentPrice: getCurrentPrice({
                price: item.price,
                discount: item.discount || 0,
              }),
            },
          });
        } else {
          await prismadb.productItem.create({
            data: {
              productId: product.id,
              sizeId: item.sizeId,
              colorId: item.colorId || undefined,
              imageUrl: item.imageUrl,
              discount: item.discount || 0,
              originalPrice: item.price,
              numInStocks: item.numInStocks,
              currentPrice: getCurrentPrice({
                price: item.price,
                discount: item.discount || 0,
              }),
            },
          });
        }
      })
    );

    //Update Product
    await prismadb.product.update({
      where: {
        id: productId,
        storeId,
      },
      data: {
        name,
        categoryId,
        description,
      },
    });

    return NextResponse.json("Product Updated!");
  } catch (err) {
    console.log("[PRODUCT_UPDATE]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { storeId, productId } = params;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    //Check if there is a current user
    const { user } = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //Check if user is a seller
    const { role } = await currentRole();

    if (role !== "SELLER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //Check if the user owns the store
    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId: user.id,
      },
    });

    if (!store) {
      return new NextResponse("Store not found!", { status: 404 });
    }

    //Check if store has been approved
    if (store.status !== storeStatus.APPROVED) {
      return new NextResponse("Unauthorized, Store not approved yet!", {
        status: 401,
      });
    }

    //Check if product exists
    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
        storeId,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", {
        status: 404,
      });
    }

    //Delete Product
    await prismadb.product.delete({
      where: {
        id: product.id,
        storeId,
      },
    });

    return NextResponse.json("Product Deleted!");
  } catch (err) {
    console.log("[PRODUCT_DELETE]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
