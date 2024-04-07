import Container from "@/components/Container";
import SearchFeed from "./_component/SearchFeed";
import { getProductBySearchQuery } from "@/data/search";

export default async function SearchProductPage({
  searchParams: {
    query,
    category,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
  },
}: {
  searchParams: {
    query: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    minDiscount?: string;
    maxDiscount?: string;
  };
}) {
  const products = await getProductBySearchQuery({
    query: query.toLowerCase(),
    category,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
  });

  return (
    <Container>
      <SearchFeed
        initialData={products}
        query={query.toLowerCase()}
        category={category || ""}
        minPrice={minPrice || "0"}
        maxPrice={maxPrice || "1000000"}
        minDiscount={minDiscount || "0"}
        maxDiscount={maxDiscount || "50"}
      />
    </Container>
  );
}
