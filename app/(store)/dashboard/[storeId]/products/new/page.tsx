import Heading from "@/components/Heading";
import Container from "@/components/Container";
import ProductForm from "../_components/ProductForm";
import { Separator } from "@/components/ui/separator";

export default function NewProductPage() {
  return (
    <Container>
      <Heading
        title="New Product"
        description="Create a new product for your store"
      />

      <Separator className="my-4" />

      <ProductForm />
    </Container>
  );
}
