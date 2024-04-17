import prismadb from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProductIds } from "@/data/static";
import { ProductStatus } from "@prisma/client";
import Container from "@/components/Container";
import { getProductById } from "@/data/product";
import Reviews from "./_components/reviews/Reviews";
import ProductContent from "./_components/ProductContent";
import Recommendation from "./_components/Recommendation";
import {
  getReviewsForProduct,
  getReviewCount,
  checkIfReviewed,
} from "@/data/review";

export const revalidate = 60; //Revalidate every 60 seconds

export async function generateStaticParams() {
  const productIds = await getProductIds();

  return productIds?.map((product) => ({
    productId: product.id,
  }));
}

export default async function ProductPage({
  params: { productId },
}: {
  params: { productId: string };
}) {
  const { user } = await currentUser();

  const product = await getProductById(productId);

  if (!product) {
    return redirect("/");
  }

  const reviews = await getReviewsForProduct(productId);

  const reviewCount = await getReviewCount(productId);

  const hasReviewed = await checkIfReviewed({
    userId: user?.id || "",
    productId,
  });

  const recommendedProducts = await prismadb.product.findMany({
    where: {
      id: {
        not: product.id,
      },
      status: ProductStatus.APPROVED,
      OR: [
        {
          category: {
            OR: [
              {
                name: {
                  contains: product.category.name,
                },
              },
              {
                name: {
                  equals: product.category.name,
                },
              },
            ],
          },
        },
        {
          OR: [
            {
              name: {
                contains: product.name,
              },
            },
            {
              name: {
                equals: product.name,
              },
            },
          ],
        },
      ],
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
            orderBy: {
              createdAt: "desc",
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
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full space-y-5">
      <Container>
        <ProductContent product={product} />
      </Container>

      <Recommendation products={recommendedProducts} />

      <Reviews
        productId={productId}
        initialData={reviews}
        reviewCount={reviewCount}
        hasReviewed={hasReviewed}
      />
    </div>
  );
}
