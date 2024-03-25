"use client";

import React, { useEffect } from "react";
import Empty from "@/components/Empty";
import { HomeProductType } from "@/types";
import Spinner from "@/components/Spinner";
import Product from "../../../_components/Product";
import ProductSkeleton from "@/components/ProductSkeleton";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";
import useUnlimitedScrolling from "@/hooks/use-unlimited-scrolling";

type Props = {
  query: string;
  initialData: HomeProductType[];
};

const SearchFeed = ({ query, initialData }: Props) => {
  const {
    ref,
    entry,
    data,
    error,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useUnlimitedScrolling({
    key: ["search-products-feed", query],
    query: `/api/products/search?q=${query}&limit=${INFINITE_SCROLL_PAGINATION_RESULTS}`,
    initialData,
  });

  //@ts-ignore
  const products: HomeProductType[] =
    data?.pages?.flatMap((page) => page) ?? initialData;

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

  if (products?.length === 0) {
    return (
      <Empty
        message="Sorry, no products found! Try again later."
        testId="product-search-empty"
      />
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold" data-cy="product-search-result-text">
        Results ({products?.length || 0})
      </h1>

      <div
        className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
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
  );
};

export default SearchFeed;
