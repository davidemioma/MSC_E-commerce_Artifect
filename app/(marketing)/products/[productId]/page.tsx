import { redirect } from "next/navigation";
import Container from "@/components/Container";
import { getProductById } from "@/data/product";
import ProductContent from "../_components/ProductContent";

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
    <Container>
      <ProductContent product={product} />
    </Container>
  );
}
