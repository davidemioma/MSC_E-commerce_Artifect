import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";
import { storeStatus } from "@prisma/client";
import { getCurrentPrice } from "@/lib/utils";
import { currentRole, currentUser } from "@/lib/auth";
import { ProductSchema } from "@/lib/validators/product";

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
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

    //Create Product
    await prismadb.product.create({
      data: {
        userId: user.id,
        storeId,
        name,
        categoryId,
        description,
        productItems: {
          createMany: {
            data: productItems.map((item) => ({
              sizeIds: item.sizeIds,
              images: item.images,
              colorId: item.colorId,
              numInStocks: item.numInStocks,
              discount: item.discount,
              originalPrice: item.price,
              currentPrice: getCurrentPrice({
                price: item.price,
                discount: item.discount || 0,
              }),
            })),
          },
        },
      },
    });

    return NextResponse.json("Product Created!");
  } catch (err) {
    console.log("[PRODUCT_CREATE]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
