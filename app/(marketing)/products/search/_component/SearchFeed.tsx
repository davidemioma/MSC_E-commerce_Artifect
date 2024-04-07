"use client";

import React, { useEffect } from "react";
import Empty from "@/components/Empty";
import { HomeProductType } from "@/types";
import Spinner from "@/components/Spinner";
import SearchFilters from "./SearchFilters";
import Product from "../../../_components/Product";
import ProductSkeleton from "@/components/ProductSkeleton";
import useUnlimitedSearch from "@/hooks/use-unlimited-search";
import SearchBar from "@/app/(marketing)/_components/SearchBar";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";

type Props = {
  query: string;
  initialData: HomeProductType[];
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minDiscount?: string;
  maxDiscount?: string;
};

const SearchFeed = ({
  query,
  initialData,
  category,
  minPrice,
  maxPrice,
  minDiscount,
  maxDiscount,
}: Props) => {
  const {
    ref,
    entry,
    data,
    error,
    refetch,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useUnlimitedSearch({
    key: ["search-products-feed", query],
    query: `/api/products/search?q=${query}&limit=${INFINITE_SCROLL_PAGINATION_RESULTS}`,
    initialData,
    body: {
      category: category || "",
      minPrice: minPrice || "0",
      maxPrice: maxPrice || "1000000",
      minDiscount: minDiscount || "0",
      maxDiscount: maxDiscount || "50",
    },
  });

  //@ts-ignore
  const products: HomeProductType[] =
    data?.pages?.flatMap((page) => page) ?? initialData;

  const categories =
    Array.from(new Set(products?.map((product) => product?.category?.name))) ||
    [];

  const prices =
    products.map(
      (product) => product?.productItems[0]?.availableItems[0]?.currentPrice
    ) || [];

  //When you scroll to the bottom it triggers the fetchNextPage() to fetch more products
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {new Array(20).fill("").map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold" data-cy="product-search-result-text">
        Results ({products?.length || 0})
      </h1>

      <div className="w-full max-w-lg md:hidden">
        <SearchBar />
      </div>

      <div className="relative flex flex-col md:flex-row gap-5">
        <SearchFilters
          query={query}
          categories={categories}
          prices={prices}
          category={category || ""}
          minPrice={minPrice || "0"}
          maxPrice={maxPrice || "1000000"}
          minDiscount={minDiscount || "0"}
          maxDiscount={maxDiscount || "50"}
          refetch={() => refetch()}
          isLoading={isLoading}
        />

        {products.length > 0 ? (
          <div className="flex-1">
            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              data-testid="search-product-feed"
            >
              {products?.map((product, i) => {
                if (i === products.length - 1) {
                  return (
                    <div key={product.id} ref={ref}>
                      <Product product={product} />
                    </div>
                  );
                } else {
                  return <Product key={product.id} product={product} />;
                }
              })}
            </div>

            {isFetchingNextPage && <Spinner />}

            {error && (
              <div className="py-5 text-center text-sm text-red-500 font-medium">
                Could not get products! Try refreshing the page.
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1">
            <Empty
              message="Sorry, no products found! Try again later."
              testId="product-search-empty"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFeed;
