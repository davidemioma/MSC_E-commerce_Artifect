import { z } from "zod";
import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const { limit, page } = z
      .object({
        limit: z.string(),
        page: z.string(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    const products = await prismadb.product.findMany({
      where: {
        status: "APPROVED",
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
      orderBy: {
        createdAt: "desc",
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    });

    return NextResponse.json(products);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
