import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentRole, currentUser } from "@/lib/auth";
import { CategorySchema } from "@/lib/validators/category";

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; id: string } }
) {
  try {
    const { storeId, id } = params;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!id) {
      return new NextResponse("Category Id is required", { status: 400 });
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

    const body = await request.json();

    const { name } = CategorySchema.parse(body);

    //Check if category name exists
    const category = await prismadb.category.findFirst({
      where: {
        id: {
          not: id,
        },
        storeId,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (category) {
      return new NextResponse("Name already taken!", { status: 409 });
    }

    await prismadb.category.update({
      where: {
        id,
        storeId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json("Category Updated!");
  } catch (err) {
    console.log("[CATEGORY_UPDATE]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; id: string } }
) {
  try {
    const { storeId, id } = params;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!id) {
      return new NextResponse("Category Id is required", { status: 400 });
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

    await prismadb.category.delete({
      where: {
        id,
        storeId,
      },
    });

    return NextResponse.json("Category Deleted!");
  } catch (err) {
    console.log("[CATEGORY_DELETE]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
