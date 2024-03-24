import { z } from "zod";
import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
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

    const { productId, storeId } = params;

    if (!productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    //check if store exists
    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
      },
    });

    if (!store) {
      return new NextResponse("Store not found!", { status: 404 });
    }

    //check if product exists
    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return new NextResponse("Product not found!", { status: 404 });
    }

    let products = [];

    if (q !== "") {
      products = await prismadb.product.findMany({
        where: {
          storeId,
          status: "APPROVED",
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
    }

    products = await prismadb.product.findMany({
      where: {
        storeId,
        status: "APPROVED",
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
    console.log("GET_STORE_PRODUCTS", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
