"use client";

import React, { useEffect } from "react";
import { Category, Product, ProductItem } from "@prisma/client";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";
import useUnlimitedScrolling from "@/hooks/use-unlimited-scrolling";

type ProductType = Product & {
  category: Category;
  productItems: ProductItem[];
};

type Props = {
  initialData: ProductType[];
};

const Feed = ({ initialData }: Props) => {
  const { ref, entry, data, error, fetchNextPage, isFetchingNextPage } =
    useUnlimitedScrolling({
      key: "feed-products",
      query: `/api/products?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}`,
      initialData,
    });

  //@ts-ignore
  const products: ProductType[] =
    data?.pages?.flatMap((page) => page) ?? initialData;

  //When you scroll to the bottom it triggers the fetchNextPage() to fetch more products
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  if (products.length === 0) {
    return <div>No Products</div>;
  }

  return (
    <>
      <div>
        {products.map((product, i) => {
          if (i === products.length - 1) {
            return (
              <div key={product.id} ref={ref}>
                <div>Product</div>
              </div>
            );
          } else {
            return <div key={product.id}>Product</div>;
          }
        })}
      </div>

      {isFetchingNextPage && <div>Spinner</div>}

      {error && <div>Error</div>}
    </>
  );
};

export default Feed;
