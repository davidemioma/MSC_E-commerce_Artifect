"use client";

import React from "react";
import { Product } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

type Props = {
  data?: Product;
};

const ProductForm = ({ data }: Props) => {
  const params = useParams();

  const router = useRouter();

  return <div>ProductForm</div>;
};

export default ProductForm;
