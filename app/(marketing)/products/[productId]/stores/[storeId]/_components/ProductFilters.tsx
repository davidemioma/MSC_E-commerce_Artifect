"use client";

import React, { useEffect, useState } from "react";
import qs from "query-string";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

type Props = {
  storeId: string;
  productId: string;
};

const ProductFilters = ({ storeId, productId }: Props) => {
  const router = useRouter();

  const [value, setValue] = useState("");

  const [debounceValue, setDebounceValue] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setDebounceValue(value);
    }, 1000);
  }, [value]);

  useEffect(() => {
    const pushToUrl = () => {
      const url = qs.stringifyUrl(
        {
          url: `/products/${productId}/stores/${storeId}`,
          query: {
            search: debounceValue,
          },
        },
        { skipNull: true }
      );

      router.push(url);
    };

    pushToUrl();
  }, [debounceValue, productId, storeId]);

  return (
    <div className="relative w-full max-w-96">
      <Input
        className="w-full rounded-lg pr-6"
        placeholder="Search Product"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {value.trim() && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={() => setValue("")}
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ProductFilters;
