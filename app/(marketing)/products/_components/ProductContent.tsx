"use client";

import React, { useState } from "react";
import ProductSlider from "./ProductSlider";
import { ProductItem } from "@prisma/client";
import { ProductType } from "../../../../types";

type Props = {
  product: ProductType;
};

const ProductContent = ({ product }: Props) => {
  const [curProductItem, setCurProductItem] = useState<ProductItem | undefined>(
    product.productItems?.[0]
  );

  return (
    <div className="w-full grid md:grid-cols-2">
      <ProductSlider images={curProductItem?.images || []} />

      <div className="py-5 md:py-0 md:pl-10">Content</div>
    </div>
  );
};

export default ProductContent;
