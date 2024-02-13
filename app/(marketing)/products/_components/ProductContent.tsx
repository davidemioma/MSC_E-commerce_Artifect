"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Size } from "@prisma/client";
import ProductSlider from "./ProductSlider";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useCurrentUser from "@/hooks/use-current-user";
import { ProductItemType, ProductType } from "../../../../types";

type Props = {
  product: ProductType;
};

const ProductContent = ({ product }: Props) => {
  const { user } = useCurrentUser();

  const [curSize, setCurSize] = useState<Size | undefined>(undefined);

  const [curProductItem, setCurProductItem] = useState<
    ProductItemType | undefined
  >(product.productItems?.[0]);

  const currentSizes =
    curProductItem?.availableItems?.map((item) => ({
      size: item.size,
      inStock: item.numInStocks > 0,
    })) || [];

  return (
    <div className="w-full grid md:grid-cols-2">
      <ProductSlider images={curProductItem?.images || []} />

      <div className="py-5 md:py-0 md:pl-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <p className="text-gray-500">{product.category.name}</p>

          <div>Ratings</div>
        </div>

        <div
          className="text-sm mt-2 mb-3"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />

        <div className="text-lg">
          {curProductItem?.discount ? (
            <div className="flex items-center gap-2 font-semibold">
              <span>
                {formatPrice(curProductItem?.currentPrice || 0, {
                  currency: "GBP",
                })}
              </span>

              <span className="line-through text-gray-500">
                {formatPrice(curProductItem?.originalPrice || 0, {
                  currency: "GBP",
                })}
              </span>

              <span
                className={cn(
                  curProductItem?.discount > 1
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                {curProductItem?.discount}% off
              </span>
            </div>
          ) : (
            <div className="font-semibold">
              {formatPrice(curProductItem?.currentPrice || 0, {
                currency: "GBP",
              })}
            </div>
          )}
        </div>

        <div className="w-full flex flex-wrap gap-2 mb-5">
          {product.productItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative w-16 h-16 rounded-lg border border-gray-300 overflow-hidden",
                curProductItem?.id === item.id && "border-2 border-black"
              )}
              onClick={() => setCurProductItem(item)}
            >
              <Image
                className="object-cover"
                fill
                src={item.images[0]}
                alt={`product-item-${item.id}`}
              />
            </div>
          ))}
        </div>

        {currentSizes && currentSizes?.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Available Sizes:</h2>

            <div className="w-full max-w-md flex flex-wrap gap-2">
              {currentSizes.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-center p-2 rounded-lg cursor-pointer border border-gray-300 overflow-hidden",
                    curSize?.id === item?.size?.id && "border-2 border-black",
                    item.inStock
                      ? "opacity-100"
                      : "opacity-70 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (!item.inStock) return;

                    setCurSize(item?.size);
                  }}
                >
                  {item?.size?.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {user && user.role !== "ADMIN" && (
          <Button
            className="bg-violet-500 w-full md:max-w-md mt-10 font-semibold rounded-full"
            size="lg"
          >
            Add To Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductContent;
