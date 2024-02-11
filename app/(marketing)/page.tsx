import Feed from "./_components/Feed";
import Container from "@/components/Container";
import { getHomePageProducts } from "@/data/product";

export default async function Home() {
  const products = await getHomePageProducts();

  return (
    <Container>
      <Feed initialData={products} />
    </Container>
  );
}
