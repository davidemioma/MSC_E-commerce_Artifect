import Container from "@/components/Container";
import SearchFeed from "./_component/SearchFeed";

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
  return (
    <Container>
      <SearchFeed
        query={query.toLowerCase()}
        category={category || ""}
        minPrice={minPrice || "0"}
        maxPrice={maxPrice || "100000"}
        minDiscount={minDiscount || "0"}
        maxDiscount={maxDiscount || "50"}
      />
    </Container>
  );
}
