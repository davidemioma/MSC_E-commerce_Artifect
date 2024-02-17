"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { HomeProductType } from "@/types";
import Container from "@/components/Container";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Product from "@/app/(marketing)/_components/Product";

type Props = {
  products: HomeProductType[];
};

const Recommendation = ({ products }: Props) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: string) => {
    setIsMoved(true);

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <Container>
      <div className="py-10 space-y-5">
        <h1 className="text-2xl md:text-3xl font-bold">You Might Also Like</h1>

        {products.length > 1 && (
          <div className="flex items-center justify-end gap-3">
            <button
              className={cn(
                "bg-black/60 items-center justify-center p-2 text-white rounded-full",
                !isMoved ? "hideen" : "inline-flex"
              )}
              onClick={(e) => handleClick("left")}
            >
              <ArrowLeft />
            </button>

            <button
              className={cn(
                "bg-black/60 items-center justify-center p-2 text-white rounded-full"
              )}
              onClick={() => handleClick("right")}
            >
              <ArrowRight />
            </button>
          </div>
        )}

        <div
          ref={rowRef}
          className="flex items-center gap-2 overflow-x-scroll scrollbar-hide"
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[350px]">
              <Product product={product} />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Recommendation;
