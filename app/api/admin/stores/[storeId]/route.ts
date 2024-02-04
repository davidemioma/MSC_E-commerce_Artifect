import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";
import { StatusSchema } from "@/lib/validators/status";
import { currentRole, currentUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const { user } = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { role } = await currentRole();

    if (role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { status } = StatusSchema.parse(body);

    await prismadb.store.update({
      where: {
        id: storeId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json("Status updated!");
  } catch (err) {
    console.log("[STATUS_PATCH]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
