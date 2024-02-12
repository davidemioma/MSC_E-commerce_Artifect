import Container from "@/components/Container";
import ProductContent from "../_components/ProductContent";

export default function ProductPage({
  params: { productId },
}: {
  params: { productId: string };
}) {
  return (
    <Container>
      <ProductContent productId={productId} />
    </Container>
  );
}
