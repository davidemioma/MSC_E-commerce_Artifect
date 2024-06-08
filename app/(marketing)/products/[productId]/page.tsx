import { redirect } from "next/navigation";
import Container from "@/components/Container";
import { getProductById } from "@/data/product";
import Reviews from "./_components/reviews/Reviews";
import ProductContent from "./_components/ProductContent";
import Recommendation from "./_components/Recommendation";

export default async function ProductPage({
  params: { productId },
}: {
  params: { productId: string };
}) {
  const product = await getProductById(productId);

  if (!product) {
    return redirect("/");
  }

  return (
    <div className="w-full space-y-5">
      <Container>
        <ProductContent product={product} />
      </Container>

      <Recommendation
        product={{
          id: product.id,
          name: product.name,
          category: {
            name: product.category.name,
          },
        }}
      />

      <Reviews productId={productId} />
    </div>
  );
}
