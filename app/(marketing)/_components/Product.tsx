"use client";

import React from "react";
import ProductImg from "./ProductImg";
import { ProductType } from "@/types";
import { useRouter } from "next/navigation";
import { cn, formatPrice } from "@/lib/utils";

type Props = {
  product: ProductType;
};
const Product = ({ product }: Props) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-300 rounded-b-lg cursor-pointer shadow-sm md:hover:scale-105 transition-transform duration-300"
    >
      <ProductImg
        images={product?.productItems?.map((item) => item.images[0]) || []}
      />

      <div className="px-2 py-3">
        <h2 className="w-full text-lg font-bold truncate">{product.name}</h2>

        <p className="text-xs text-gray-500">{product.category?.name}</p>

        <p className="text-xs text-gray-500">
          {product.productItems?.length} Colors
        </p>

        <div className="my-2">Ratings</div>

        <div className="text-sm mb-2">
          {product.productItems?.[0]?.discount ? (
            <div className="flex items-center gap-2 font-semibold">
              <span>
                {formatPrice(product.productItems?.[0]?.currentPrice || 0, {
                  currency: "GBP",
                })}
              </span>

              <span className="line-through text-gray-500">
                {formatPrice(product.productItems?.[0]?.originalPrice || 0, {
                  currency: "GBP",
                })}
              </span>

              <span
                className={cn(
                  product.productItems?.[0]?.discount > 1
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                {product.productItems?.[0]?.discount}% off
              </span>
            </div>
          ) : (
            <div className="font-semibold">
              {formatPrice(product.productItems?.[0]?.currentPrice || 0, {
                currency: "GBP",
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
