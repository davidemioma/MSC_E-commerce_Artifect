import Container from "@/components/Container";
import SearchFeed from "./_component/SearchFeed";
import { getProductBySearchQuery } from "@/data/search";

export default async function SearchProductPage({
  searchParams: { query },
}: {
  searchParams: { query: string };
}) {
  const products = await getProductBySearchQuery(query.toLowerCase());

  return (
    <Container>
      <SearchFeed query={query.toLowerCase()} initialData={products} />
    </Container>
  );
}
