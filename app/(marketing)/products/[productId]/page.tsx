import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Reviews from "./_components/reviews/Reviews";
import Container from "@/components/Container";
import { getProductById } from "@/data/product";
import ProductContent from "./_components/ProductContent";
import {
  getReviewsForProduct,
  getReviewCount,
  checkIfReviewed,
} from "@/data/review";
import { UserRole } from "@prisma/client";
import prismadb from "@/lib/prisma";

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

      <div>Recommended items</div>

      <Reviews
        productId={productId}
        initialData={reviews}
        reviewCount={reviewCount}
        hasReviewed={hasReviewed}
      />
    </div>
  );
}
