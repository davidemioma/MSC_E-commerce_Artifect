import prismadb from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";
import Container from "@/components/Container";
import SearchFeed from "./_component/SearchFeed";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";

export default async function SearchProductPage({
  searchParams: { query },
}: {
  searchParams: { query: string };
}) {
  const products = await prismadb.product.findMany({
    where: {
      status: ProductStatus.APPROVED,
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          name: {
            equals: query,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
        {
          category: {
            name: {
              equals: query,
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
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return (
    <Container>
      <SearchFeed query={query} initialData={products} />
    </Container>
  );
}
