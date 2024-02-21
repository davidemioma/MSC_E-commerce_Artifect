"use client";

import React, { useEffect, useState } from "react";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { queryCategories } from "@/lib/utils";
import { Combobox } from "@/components/ui/combo-box";

const QueryFilters = () => {
  const router = useRouter();

  const [value, setValue] = useState("all");

  useEffect(() => {
    const pushToUrl = () => {
      const url = qs.stringifyUrl(
        {
          url: "/admin/queries",
          query: {
            status: value,
          },
        },
        { skipNull: true }
      );

      router.push(url);
    };

    pushToUrl();
  }, [value]);

  return (
    <Combobox frameworks={queryCategories} value={value} setValue={setValue} />
  );
};

export default QueryFilters;
