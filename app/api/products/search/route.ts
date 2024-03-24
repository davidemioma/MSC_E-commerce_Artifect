import { z } from "zod";
import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ProductStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const { limit, page, q } = z
      .object({
        limit: z.string(),
        page: z.string(),
        q: z.string(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        q: url.searchParams.get("q"),
      });

    const products = await prismadb.product.findMany({
      where: {
        status: ProductStatus.APPROVED,
        OR: [
          {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            name: {
              equals: q,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: q,
                mode: "insensitive",
              },
            },
          },
          {
            category: {
              name: {
                equals: q,
                mode: "insensitive",
              },
            },
          },
        ],
        productItems: {
          some: {
            availableItems: {
              some: {
                numInStocks: {
                  gt: 0,
                },
              },
            },
          },
        },
      },
      include: {
        category: true,
        productItems: {
          where: {
            availableItems: {
              some: {
                numInStocks: {
                  gt: 0,
                },
              },
            },
          },
          include: {
            availableItems: {
              include: {
                size: true,
              },
            },
          },
        },
        reviews: {
          select: {
            value: true,
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
    console.log("GET_SEARCHED_PRODUCTS", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
