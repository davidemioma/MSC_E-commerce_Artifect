"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import ProductSlider from "./ProductSlider";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useCurrentUser from "@/hooks/use-current-user";
import AverageRating from "@/components/AverageRating";
import { Size, Color, UserRole } from "@prisma/client";
import TooltipContainer from "@/components/TooltipContainer";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CartItemValidator } from "@/lib/validators/cart-item";
import { ProductItemType, ProductDetailType } from "../../../../../types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

type Props = {
  product: ProductDetailType;
};

const ProductContent = ({ product }: Props) => {
  const { user } = useCurrentUser();

  const queryClient = useQueryClient();

  const [curSize, setCurSize] = useState<Size | undefined>(undefined);

  const [priceIndex, setPriceIndex] = useState(0);

  const [curProductItem, setCurProductItem] = useState<
    ProductItemType | undefined
  >(product.productItems?.[0]);

  const {
    data: colors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product-details-colors", curProductItem?.id],
    queryFn: async () => {
      if (curProductItem?.colorIds.length === 0) return;

      const res = await axios.post(`/api/products/${product.id}/colors/some`, {
        colorIds: curProductItem?.colorIds,
      });

      return res.data as Color[];
    },
  });

  const [curAvailableId, setCurAvailableId] = useState("");

  const currentSizes =
    curProductItem?.availableItems?.map((item) => ({
      availableItemId: item.id,
      size: item.size,
      inStock: item.numInStocks > 0,
      originalPrice: item.originalPrice,
      currentPrice: item.currentPrice,
    })) || [];

  const { mutate: addToCart, isPending } = useMutation({
    mutationKey: ["add-to-cart"],
    mutationFn: async (values: CartItemValidator) => {
      await axios.post("/api/cart", values);
    },
    onSuccess: () => {
      toast.success("Item added to cart!");

      queryClient.invalidateQueries({
        queryKey: ["get-cart-item"],
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <div className="w-full grid md:grid-cols-2">
      <ProductSlider images={curProductItem?.images || []} />

      <div className="py-5 md:py-0 md:pl-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <p className="text-gray-500">{product.category.name}</p>

          <AverageRating
            ratings={product?.reviews?.map((review) => review?.value)}
          />
        </div>

        <div
          className="text-sm mt-2 mb-3"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />

        <div className="text-lg">
          {curProductItem?.discount ? (
            <div className="flex items-center gap-2 font-semibold">
              <span>
                {formatPrice(currentSizes?.[priceIndex]?.currentPrice || 0, {
                  currency: "GBP",
                })}
              </span>

              <span className="line-through text-gray-500">
                {formatPrice(currentSizes?.[priceIndex]?.originalPrice || 0, {
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
              {formatPrice(currentSizes?.[priceIndex]?.currentPrice || 0, {
                currency: "GBP",
              })}
            </div>
          )}
        </div>

        <div className="w-full flex flex-wrap gap-2">
          {product.productItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                "relative w-16 h-16 rounded-lg border border-gray-300 overflow-hidden disabled:cursor-not-allowed",
                curProductItem?.id === item.id && "border-2 border-black"
              )}
              onClick={() => setCurProductItem(item)}
              disabled={isPending}
            >
              <Image
                className="object-cover"
                fill
                src={item.images[0]}
                alt={`product-item-${item.id}`}
              />
            </button>
          ))}
        </div>

        {!isError && !isLoading && colors && colors.length > 0 && (
          <div className="space-y-2 mt-5">
            <h2 className="text-lg font-semibold">Product Colors:</h2>

            <div className="w-full max-w-md flex flex-wrap gap-2">
              {colors.map((color) => (
                <div
                  key={color.id}
                  style={{ backgroundColor: color.value }}
                  className="w-4 h-4 rounded-full border overflow-hidden"
                />
              ))}
            </div>
          </div>
        )}

        {currentSizes && currentSizes?.length > 0 && (
          <div className="space-y-2 mt-5">
            <h2 className="text-lg font-semibold">Available Sizes:</h2>

            <div className="w-full max-w-md flex flex-wrap gap-2">
              {currentSizes.map((item, i) => (
                <button
                  key={i}
                  className={cn(
                    "flex items-center justify-center p-2 rounded-lg cursor-pointer border border-gray-300 overflow-hidden disabled:cursor-not-allowed",
                    curSize?.id === item?.size?.id && "border-2 border-black",
                    item.inStock
                      ? "opacity-100"
                      : "opacity-70 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (!item.inStock) return;

                    setPriceIndex(i);

                    setCurSize(item?.size);

                    setCurAvailableId(item.availableItemId);
                  }}
                  disabled={!item.inStock || isPending}
                >
                  {item?.size?.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {user && user.role === UserRole.USER && (
          <div className="mt-4 mb-10">
            <TooltipContainer message="View Store">
              <Link href={`/products/${product.id}/stores/${product.storeId}`}>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={product.store.logo || "/no-profile.jpeg"}
                    />
                  </Avatar>

                  <p className="text-sm font-semibold">{product.store.name}</p>
                </div>
              </Link>
            </TooltipContainer>
          </div>
        )}

        {user && user.role === UserRole.USER && (
          <Button
            className="bg-violet-500 w-full md:max-w-md font-semibold rounded-full"
            size="lg"
            onClick={() =>
              addToCart({
                productId: product.id,
                productItemId: curProductItem?.id || "",
                availableItemId: curAvailableId,
              })
            }
            disabled={isPending || !curProductItem || !curAvailableId}
          >
            Add To Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductContent;
