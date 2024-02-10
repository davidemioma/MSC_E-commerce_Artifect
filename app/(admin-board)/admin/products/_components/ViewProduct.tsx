"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import BtnSpinner from "@/components/BtnSpinner";
import ImageSlider from "@/components/ImageSlider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Color, Product, ProductItem, Size } from ".prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
};

type ProductItemType = ProductItem & {
  color: Color;
  size: Size;
};

type ProductType = Product & {
  productItems: ProductItemType[];
};

const ViewProduct = ({ isOpen, onClose, productId }: Props) => {
  const [mounted, setMounted] = useState(false);

  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const [activeSize, setActiveSize] = useState<Size | null>(null);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-product-modal", productId],
    queryFn: async () => {
      const res = await axios.get(`/api/admin/products/${productId}`);

      return res.data as ProductType;
    },
  });

  const currentProductItem = product?.productItems[activeItemIndex];

  const {
    data: sizes,
    isLoading: sizesLoading,
    isError: sizesError,
  } = useQuery({
    queryKey: ["admin-product-item-sizes", currentProductItem?.id],
    queryFn: async () => {
      if (!currentProductItem || currentProductItem?.sizeIds.length < 1) return;

      const res = await axios.post(`/api/admin/sizes`, {
        sizeIds: currentProductItem?.sizeIds || [],
      });

      return res.data as Size[];
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Product</DialogTitle>

          <DialogDescription>
            Admin view of how your product will be displayed.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="w-full flex items-center justify-center py-4">
            <BtnSpinner />
          </div>
        )}

        {isError && (
          <div className="w-full flex items-center justify-center py-4">
            <p>No product found! Try again.</p>
          </div>
        )}

        {product && (
          <ScrollArea className="w-full h-[50vh] scrollbar-hide">
            <div className="space-y-6">
              <div className="space-y-1">
                <h1 className="text-xl font-bold">{product.name}</h1>

                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              <ImageSlider images={currentProductItem?.images ?? []} />

              <div className="flex items-center justify-between">
                <div className="flex-1 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="font-bold">Color: </div>

                    <div
                      style={{
                        backgroundColor: currentProductItem?.color.value,
                      }}
                      className="w-5 h-5 rounded-full"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="font-bold">In Stock: </div>

                    <div>{currentProductItem?.numInStocks}</div>
                  </div>
                </div>

                {currentProductItem?.discount ? (
                  <div className="flex items-center gap-2 font-semibold">
                    <span>
                      {formatPrice(currentProductItem?.currentPrice || 0, {
                        currency: "GBP",
                      })}
                    </span>

                    <span className="line-through text-gray-500">
                      {formatPrice(currentProductItem?.originalPrice || 0, {
                        currency: "GBP",
                      })}
                    </span>

                    <span
                      className={cn(
                        currentProductItem.discount > 1
                          ? "text-green-500"
                          : "text-red-500"
                      )}
                    >
                      {currentProductItem.discount}% off
                    </span>
                  </div>
                ) : (
                  <div className="font-semibold">
                    {formatPrice(currentProductItem?.currentPrice || 0, {
                      currency: "GBP",
                    })}
                  </div>
                )}
              </div>

              {sizesLoading && <BtnSpinner />}

              {sizesError && (
                <div className="text-sm text-red-500 text-center">
                  Could not load sizes. Refresh the page and try again
                </div>
              )}

              {!sizesError && !sizesLoading && sizes && sizes?.length > 0 && (
                <div className="space-y-2">
                  <h1 className="text-lg font-bold">Sizes:</h1>

                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <div
                        key={size.id}
                        className={cn(
                          "p-2 text-sm border rounded-lg cursor-pointer",
                          activeSize?.id === size.id && "border-2 border-black"
                        )}
                        onClick={() => setActiveSize(size)}
                      >
                        {size.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h1 className="text-lg font-bold">Choose Options:</h1>

                <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                  {product.productItems.map((item, i) => (
                    <div
                      key={item.id}
                      className={cn(
                        "relative w-20 h-20 border rounded-lg cursor-pointer overflow-hidden",
                        i === activeItemIndex && "border-2 border-black"
                      )}
                      onClick={() => setActiveItemIndex(i)}
                    >
                      <Image
                        className="object-cover"
                        fill
                        src={item.images[0]}
                        alt="product-item"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewProduct;
