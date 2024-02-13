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
      include: {
        availableItems: true,
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
              colorId: item.colorId || undefined,
              images: item.images,
              discount: item.discount || 0,
              originalPrice: item.price,
              currentPrice: getCurrentPrice({
                price: item.price,
                discount: item.discount || 0,
              }),
            },
          });

          const updatedAvailableItems = item.availableItems;

          await Promise.all(
            updatedAvailableItems.map(async (item) => {
              const existingAvaliableItem = existingItem.availableItems.find(
                (existingItem) => existingItem.id === item.id
              );

              if (existingAvaliableItem) {
                await prismadb.available.update({
                  where: {
                    id: item.id,
                    productId: product.id,
                    productItemId: existingItem.id,
                  },
                  data: {
                    sizeId: item.sizeId,
                    numInStocks: item.numInStocks,
                  },
                });
              } else {
                await prismadb.available.create({
                  data: {
                    productId: product.id,
                    productItemId: existingItem.id,
                    sizeId: item.sizeId,
                    numInStocks: item.numInStocks,
                  },
                });
              }
            })
          );
        } else {
          const productItem = await prismadb.productItem.create({
            data: {
              productId: product.id,
              colorId: item.colorId || undefined,
              images: item.images,
              discount: item.discount || 0,
              originalPrice: item.price,
              currentPrice: getCurrentPrice({
                price: item.price,
                discount: item.discount || 0,
              }),
            },
          });

          await Promise.all(
            item.availableItems.map(async (item) => {
              await prismadb.available.create({
                data: {
                  productId: product.id,
                  productItemId: productItem.id,
                  sizeId: item.sizeId,
                  numInStocks: item.numInStocks,
                },
              });
            })
          );
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

export async function GET(
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

    //Get Product
    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
        storeId,
      },
      include: {
        productItems: {
          include: {
            color: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.log("[PRODUCT_GET]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
