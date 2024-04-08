"use client";

import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import Empty from "@/components/Empty";
import Spinner from "@/components/Spinner";
import SearchFilters from "./SearchFilters";
import { useQuery } from "@tanstack/react-query";
import Product from "../../../_components/Product";
import { Response } from "@/app/api/products/search/route";
import ProductSkeleton from "@/components/ProductSkeleton";
import SearchBar from "@/app/(marketing)/_components/SearchBar";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";

type Props = {
  query: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minDiscount: string;
  maxDiscount: string;
};

const SearchFeed = ({
  query,
  category,
  minPrice,
  maxPrice,
  minDiscount,
  maxDiscount,
}: Props) => {
  const observer = useRef<any>();

  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "search-products-feed",
      query,
      category,
      minPrice,
      maxPrice,
      minDiscount,
      maxDiscount,
    ],
    queryFn: async () => {
      const res = await axios.post(
        `/api/products/search?q=${query}&page=${pageNumber}&limit=${INFINITE_SCROLL_PAGINATION_RESULTS}`,
        {
          category,
          minPrice,
          maxPrice,
          minDiscount,
          maxDiscount,
        }
      );

      return res.data as Response;
    },
  });

  const lastElementRef = useCallback(
    (node: any) => {
      if (isLoading) return;

      if (observer?.current) observer?.current?.disconnect();

      observer.current = new IntersectionObserver((entries: any[]) => {
        if (entries[0]?.isIntersecting && data?.hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });

      if (node) observer?.current?.observe(node);
    },
    [isLoading, data?.hasMore]
  );

  const categories =
    Array.from(
      new Set(data?.products?.map((product) => product?.category?.name))
    ) || [];

  const prices =
    data?.products.map(
      (product) => product?.productItems[0]?.availableItems[0]?.currentPrice
    ) || [];

  if (!data && isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {new Array(20).fill("").map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold" data-cy="product-search-result-text">
        Results ({data?.products?.length || 0})
      </h1>

      <div className="w-full max-w-lg md:hidden">
        <SearchBar />
      </div>

      <div className="relative flex flex-col md:flex-row gap-5">
        <SearchFilters
          query={query}
          categories={categories}
          prices={prices}
          isLoading={isLoading}
          category={category}
          minPrice={minPrice}
          maxPrice={maxPrice}
          minDiscount={minDiscount}
          maxDiscount={maxDiscount}
        />

        {data?.products && data.products?.length > 0 ? (
          <div className="flex-1">
            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              data-testid="search-product-feed"
            >
              {data.products?.map((product, i) => {
                if (i === data.products.length - 1) {
                  return (
                    <div key={product.id} ref={lastElementRef}>
                      <Product product={product} />
                    </div>
                  );
                } else {
                  return <Product key={product.id} product={product} />;
                }
              })}
            </div>

            {isLoading && <Spinner />}

            {isError && (
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
