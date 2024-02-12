import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    if (!productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        productItems: {
          where: {
            numInStocks: {
              gt: 0,
            },
          },
        },
      },
    });

    if (product?.status !== "APPROVED") {
      return new NextResponse("Product has not been approved", { status: 400 });
    }

    return NextResponse.json(product);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
