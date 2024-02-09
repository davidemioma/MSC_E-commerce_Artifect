"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { cn } from "@/lib/utils";
import BtnSpinner from "../BtnSpinner";
import ImageSlider from "../ImageSlider";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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

const ViewProductModal = ({ isOpen, onClose, productId }: Props) => {
  const params = useParams();

  const [mounted, setMounted] = useState(false);

  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product-modal", productId],
    queryFn: async () => {
      const res = await axios.get(
        `/api/stores/${params.storeId}/products/${productId}`
      );

      return res.data as ProductType;
    },
  });

  // const [images, setImages] = useState<string[]>([]);

  // useEffect(() => {
  //   setImages(product?.productItems.map((item) => item.imageUrl) || []);
  // }, [product]);

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
            This is a preview of how your product will be displayed to potential
            customers.
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
              {product.status !== "APPROVED" && (
                <div className="bg-red-100 p-2 rounded-lg">
                  <p className="text-sm text-red-500">
                    Your product is currently undergoing our review process and
                    will be made visible to customers once it receives approval.
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <h1 className="text-xl font-bold">{product.name}</h1>

                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* <ImageSlider images={images} /> */}

              <div className="space-y-2">
                <h1 className="text-lg font-bold">Choose Options:</h1>

                <div className="space-y-4">
                  {product.productItems.map((item, i) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-end gap-4 p-2 border rounded-lg cursor-pointer",
                        i === activeItemIndex && "border-2 border-black"
                      )}
                      onClick={() => setActiveItemIndex(i)}
                    >
                      {/* <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image
                          className="object-cover"
                          fill
                          src={item.imageUrl}
                          alt="product-item"
                        />
                      </div> */}

                      <div className="flex-1 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="font-bold">Size: </div>

                          {/* <div>{item.size.name}</div> */}
                        </div>

                        <div className="flex items-center gap-1">
                          <div className="font-bold">Color: </div>

                          <div
                            style={{ backgroundColor: item.color.value }}
                            className="w-5 h-5 rounded-full"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <div className="font-bold">In Stock: </div>

                          <div>{item.numInStocks}</div>
                        </div>
                      </div>

                      <div>{item.currentPrice}</div>
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

export default ViewProductModal;
