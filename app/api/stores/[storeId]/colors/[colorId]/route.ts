import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ColorSchema } from "@/lib/validators/color";
import { currentRole, currentUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { storeId, colorId } = params;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color Id is required", { status: 400 });
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

    const { name, value } = ColorSchema.parse(body);

    //Check if category name exists
    const color = await prismadb.color.findFirst({
      where: {
        id: {
          not: colorId,
        },
        storeId,
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });

    if (color) {
      return new NextResponse(`${name} already taken!`, { status: 409 });
    }

    await prismadb.color.update({
      where: {
        id: colorId,
        storeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json("Color Updated!");
  } catch (err) {
    console.log("[COLOR_UPDATE]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { storeId, colorId } = params;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color Id is required", { status: 400 });
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

    await prismadb.color.delete({
      where: {
        id: colorId,
        storeId,
      },
    });

    return NextResponse.json("Color Deleted!");
  } catch (err) {
    console.log("[COLOR_DELETE]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
