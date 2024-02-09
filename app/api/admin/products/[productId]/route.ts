import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentRole, currentUser } from "@/lib/auth";
import { ProductStatusSchema } from "@/lib/validators/product-status";

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    if (!productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    const { user } = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { role } = await currentRole();

    if (role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return new NextResponse("Product not found!", { status: 404 });
    }

    const body = await request.json();

    const { status, statusFeedback } = ProductStatusSchema.parse(body);

    if (!status || !statusFeedback) {
      return new NextResponse("Status and feedback required!", { status: 400 });
    }

    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        status,
        statusFeedback,
      },
    });

    return NextResponse.json("Status updated!");
  } catch (err) {
    console.log("[PRODUCT_STATUS_PATCH]", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
