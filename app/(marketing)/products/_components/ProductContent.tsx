"use client";

import React, { useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import Spinner from "@/components/Spinner";
import ProductSlider from "./ProductSlider";
import { ProductItem } from "@prisma/client";
import { ProductType } from "../../../../types";
import { useQuery } from "@tanstack/react-query";

type Props = {
  productId: string;
};

const ProductContent = ({ productId }: Props) => {
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-product", productId],
    queryFn: async () => {
      const res = await axios.get(`/api/products/${productId}`);

      return res.data as ProductType;
    },
  });

  const [curProductItem, setCurProductItem] = useState<ProductItem | undefined>(
    product?.productItems?.[0]
  );

  if (isError) {
    return redirect("/");
  }

  if (isLoading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full grid md:grid-cols-2">
      <ProductSlider images={curProductItem?.images || []} />

      <div>Content</div>
    </div>
  );
};

export default ProductContent;
