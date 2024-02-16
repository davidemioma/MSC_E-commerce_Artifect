import prismadb from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { currentRole, currentUser } from "@/lib/auth";
import { BannerSchema } from "@/lib/validators/banner";

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
      validatedBody = BannerSchema.parse(body);
    } catch (err) {
      return NextResponse.json("Invalid Credentials", { status: 400 });
    }

    const { name, image } = validatedBody;

    //Check if banner name exists
    const banner = await prismadb.banner.findFirst({
      where: {
        storeId,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (banner) {
      return new NextResponse("Name already taken!", { status: 409 });
    }

    await prismadb.banner.create({
      data: {
        name,
        image,
        storeId,
      },
    });

    return NextResponse.json({ message: "Banner Created!" });
  } catch (err) {
    console.log("[BANNER_CREATE]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
