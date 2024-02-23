import prismadb from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
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

  const recommendedProduct = await prismadb.product.findMany({
    where: {
      id: {
        not: product.id,
      },
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

      <Recommendation products={recommendedProduct} />

      <Reviews
        productId={productId}
        initialData={reviews}
        reviewCount={reviewCount}
        hasReviewed={hasReviewed}
      />
    </div>
  );
}
