import { z } from "zod";
import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";
import { SearchBodySchema } from "@/lib/validators/search-body";

export async function POST(request: Request) {
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

    if (q === "") {
      return NextResponse.json([]);
    }

    const body = await request.json();

    const validatedBody = SearchBodySchema.parse(body);

    const { category, minPrice, maxPrice, minDiscount, maxDiscount } =
      validatedBody;

    let whereQuery: any = {
      status: "APPROVED",
      OR: [
        {
          name: {
            contains: q,
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
    };

    // if (category !== undefined) {
    //   whereQuery.category = {
    //     name: {
    //       equals: category,
    //       mode: "insensitive",
    //     },
    //   };
    // }

    // if (minPrice !== undefined && maxPrice !== undefined) {
    //   whereQuery.productItems.some.availableItems.some.currentPrice = {
    //     gte: +minPrice,
    //     lte: +maxPrice,
    //   };
    // }

    // if (minDiscount !== undefined && maxDiscount !== undefined) {
    //   whereQuery.productItems.some.discount = {
    //     gte: +minDiscount,
    //     lte: +maxDiscount,
    //   };
    // }

    const products = await prismadb.product.findMany({
      where: whereQuery,
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
    console.error("GET_SEARCHED_PRODUCTS", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
