import prismadb from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { currentRole, currentUser } from "@/lib/auth";
import { postcodeValidator } from "postcode-validator";
import { StoreSettingsSchema } from "@/lib/validators/storeSettings";

export async function PATCH(
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

    if (role !== UserRole.SELLER) {
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

    let validatedBody;

    try {
      validatedBody = StoreSettingsSchema.parse(body);
    } catch (err) {
      return NextResponse.json("Invalid Credentials", { status: 400 });
    }

    const { name, country, postcode, description, logo } = validatedBody;

    //Check if postcode is valid
    const locationIsValid = postcodeValidator(postcode, country);

    if (!locationIsValid) {
      return new NextResponse("Invalid postcode!", { status: 400 });
    }

    await prismadb.store.update({
      where: {
        id: storeId,
        userId: user.id,
      },
      data: {
        name,
        country,
        postcode,
        description,
        logo,
      },
    });

    return NextResponse.json({ message: "Store Updated!" });
  } catch (err) {
    console.log("[STORE_UPDATE]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
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

    //Delete all categories
    await prismadb.category.deleteMany({
      where: {
        storeId,
      },
    });

    //Delete all colors
    await prismadb.color.deleteMany({
      where: {
        storeId,
      },
    });

    //Delete all sizes
    await prismadb.size.deleteMany({
      where: {
        storeId,
      },
    });

    //Delete all Product
    await prismadb.product.deleteMany({
      where: {
        storeId,
        userId: user.id,
      },
    });

    //Delete Store
    await prismadb.store.delete({
      where: {
        id: storeId,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Store Deleted!" });
  } catch (err) {
    console.log("[STORE_DELETE]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
