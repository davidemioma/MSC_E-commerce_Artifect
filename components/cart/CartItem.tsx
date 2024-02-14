"use client";

import React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  cartItem: CartItemType;
};

const CartItem = ({ cartItem }: Props) => {
  const queryClient = useQueryClient();

  const { mutate: removeItem, isPending } = useMutation({
    mutationKey: ["remove-cart-item"],
    mutationFn: async () => {
      await axios.delete(`/api/cart/${cartItem.id}`);
    },
    onSuccess: () => {
      toast.success("Item removed from cart.");

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

  const { mutate: onQuantityChange, isPending: isLoading } = useMutation({
    mutationKey: ["add-quantity", cartItem.id],
    mutationFn: async ({ task }: { task: "add" | "minus" }) => {
      if (
        cartItem.availableItem?.numInStocks &&
        task === "add" &&
        cartItem.quantity >= cartItem.availableItem?.numInStocks
      ) {
        toast.message(
          `Only ${cartItem.availableItem?.numInStocks} are in stocks`
        );

        return;
      }

      await axios.patch(`/api/cart/${cartItem.id}?task=${task}`);
    },
    onSuccess: () => {
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
    <div className="space-y-5 pb-8 border-b">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg border overflow-hidden">
            <Image
              className="object-cover"
              src={cartItem.productItem?.images[0] || ""}
              fill
              alt="cart-item-image"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <h2 className="font-bold">{cartItem.product?.name}</h2>

            <p className="text-sm text-gray-500">
              {cartItem.product?.category?.name}
            </p>

            {cartItem.productItem?.color && (
              <div className="flex items-center gap-2 text-sm">
                <div>Color:</div>

                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cartItem.productItem.color.value }}
                />
              </div>
            )}

            <p className="text-sm">
              Size: {cartItem.availableItem?.size?.name}
            </p>
          </div>
        </div>

        <div className="font-semibold">
          {formatPrice(cartItem.productItem?.currentPrice || 0, {
            currency: "GBP",
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            className="text-lg font-semibold"
            variant="outline"
            disabled={isPending || isLoading}
            onClick={() => onQuantityChange({ task: "minus" })}
          >
            -
          </Button>

          <div className="px-3 font-semibold">{cartItem.quantity}</div>

          <Button
            className="text-lg font-semibold"
            variant="outline"
            disabled={isPending || isLoading}
            onClick={() => onQuantityChange({ task: "add" })}
          >
            +
          </Button>
        </div>

        <Button
          variant="destructive"
          onClick={() => removeItem()}
          disabled={isPending || isLoading}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
