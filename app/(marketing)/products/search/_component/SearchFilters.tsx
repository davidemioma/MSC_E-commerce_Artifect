"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { SearchFilters } from "@/types";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn, generatePriceRanges } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  query: string;
  categories: string[];
  prices: number[];
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minDiscount?: string;
  maxDiscount?: string;
  refetch: () => void;
};

const SearchFilters = ({
  query,
  categories,
  prices,
  category,
  minPrice,
  maxPrice,
  minDiscount,
  maxDiscount,
  refetch,
}: Props) => {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const maxProductPrice = Math.max(...prices);

  const priceRanges = generatePriceRanges({
    maxPrice: maxProductPrice,
    step: 20,
  });

  const [filters, setFilters] = useState<SearchFilters>({
    category: category || "",
    price: {
      isCustom: false,
      range:
        minPrice && maxPrice ? [+minPrice, +maxPrice] : priceRanges[0].value,
    },
    discount:
      minDiscount && maxDiscount ? [+minDiscount, +maxDiscount] : [0, 50],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(
        `/products/search?query=${query}&category=${filters.category}&minPrice=${filters.price.range[0]}&maxPrice=${filters.price.range[1]}&minDiscount=${filters.discount[0]}&maxDiscount=${filters.discount[1]}`
      );

      refetch();
    }, 400);

    return () => clearTimeout(timer);
  }, [filters, query, router, refetch]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full md:sticky md:top-20 md:w-[270px] md:h-[80vh] md:overflow-y-auto md:scrollbar-hide">
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger className="font-semibold text-lg hover:no-underline">
            Category
          </AccordionTrigger>

          <AccordionContent>
            <ToggleGroup
              type="single"
              className="grid justify-start text-start"
              value={filters.category}
              onValueChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  category: prev.category === value ? "" : value,
                }));
              }}
            >
              {categories.map((cat) => (
                <ToggleGroupItem
                  key={cat.toLowerCase()}
                  className={cn(
                    "flex justify-start",
                    filters.category === cat.toLowerCase()
                      ? "text-black font-medium"
                      : "text-muted-foreground"
                  )}
                  value={cat.toLowerCase()}
                >
                  {cat}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="font-semibold text-lg hover:no-underline">
            Price
          </AccordionTrigger>

          <AccordionContent>
            <ul className="space-y-3">
              {priceRanges.map((range, i) => (
                <li key={range.label} className="flex items-center gap-3">
                  <Input
                    type="radio"
                    className="h-4 w-4 rounded border-gray-300 \"
                    id={`price-${i}`}
                    onChange={() => {
                      setFilters((prev) => ({
                        ...prev,
                        price: {
                          isCustom: false,
                          range: [...range.value],
                        },
                      }));
                    }}
                    checked={
                      !filters.price.isCustom &&
                      filters.price.range[0] === range.value[0] &&
                      filters.price.range[1] === range.value[1]
                    }
                  />

                  <label
                    htmlFor={`price-${i}`}
                    className="text-sm text-gray-600"
                  >
                    {range.label}
                  </label>
                </li>
              ))}

              <li className="flex items-center gap-3">
                <Input
                  type="radio"
                  className="h-4 w-4 rounded border-gray-300 \"
                  id="price-custom"
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      price: {
                        isCustom: true,
                        range: priceRanges[0].value,
                      },
                    }))
                  }
                  checked={filters.price.isCustom}
                />

                <label htmlFor="price-custom" className="text-sm text-gray-600">
                  Custom
                </label>
              </li>
            </ul>

            {filters.price.isCustom && (
              <div className="mt-4 pl-2 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Input
                    className="w-20"
                    type="number"
                    value={filters.price.range[0]}
                    placeholder="Min (£)"
                    max={filters.price.range[1]}
                    step={2}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        price: {
                          isCustom: true,
                          range: [e.target.valueAsNumber, prev.price.range[1]],
                        },
                      }))
                    }
                  />

                  <Input
                    className="w-20"
                    type="number"
                    value={filters.price.range[1]}
                    min={filters.price.range[0]}
                    step={2}
                    placeholder="Max (£)"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        price: {
                          isCustom: true,
                          range: [prev.price.range[0], e.target.valueAsNumber],
                        },
                      }))
                    }
                  />
                </div>

                <Button
                  className="w-16"
                  onClick={() => {
                    if (
                      filters.price.range[0] > filters.price.range[1] ||
                      filters.price.range[1] < filters.price.range[0]
                    ) {
                      toast.info("Invalid price range");

                      return;
                    }
                  }}
                >
                  Go
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="font-semibold text-lg hover:no-underline">
            Discount
          </AccordionTrigger>

          <AccordionContent className="space-y-3">
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <span>Discount</span>

              <span>
                {filters.discount[0]}% - {filters.discount[1]}%
              </span>
            </div>

            <Slider
              value={filters.discount}
              defaultValue={[0, 50]}
              min={0}
              max={100}
              step={5}
              onValueChange={(range) => {
                const [min, max] = range;

                setFilters((prev) => ({
                  ...prev,
                  discount: [min, max],
                }));
              }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SearchFilters;
