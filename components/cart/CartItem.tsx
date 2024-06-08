"use client";

import React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CartItemType } from "@/types";
import { useRouter } from "next/navigation";
import { cn, formatPrice } from "@/lib/utils";
import { deleteCartItem, updateCartItem } from "@/actions/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  cartItem: CartItemType;
  isCheckout?: boolean;
  index?: number;
};

const CartItem = ({ cartItem, isCheckout, index }: Props) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate: removeItem, isPending } = useMutation({
    mutationKey: ["remove-cart-item"],
    mutationFn: deleteCartItem,
    onSuccess: () => {
      toast.success("Item removed from cart.");

      queryClient.invalidateQueries({
        queryKey: ["get-cart-item"],
      });

      isCheckout && router.refresh();
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const { mutate: onQuantityChange, isPending: isLoading } = useMutation({
    mutationKey: ["update-quantity", cartItem.id],
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

      await updateCartItem({ cartItemId: cartItem.id, task });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-cart-item"],
      });

      isCheckout && router.refresh();
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  return (
    <div
      className={cn(
        "space-y-5 pb-8 border-b",
        isCheckout && "bg-white p-5 rounded-lg border-none shadow-sm"
      )}
      data-cy={`cart-item-${index}`}
    >
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

            <p className="text-sm">
              Size: {cartItem.availableItem?.size?.name}
            </p>
          </div>
        </div>

        <div className="font-semibold">
          {formatPrice(cartItem.availableItem?.currentPrice || 0, {
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
            data-cy={`cart-item-${index}-minus`}
          >
            -
          </Button>

          <div className="px-3 font-semibold">{cartItem.quantity}</div>

          <Button
            className="text-lg font-semibold"
            variant="outline"
            disabled={isPending || isLoading}
            onClick={() => onQuantityChange({ task: "add" })}
            data-cy={`cart-item-${index}-add`}
          >
            +
          </Button>
        </div>

        <Button
          variant="destructive"
          onClick={() => removeItem(cartItem.id)}
          disabled={isPending || isLoading}
          data-cy={`cart-item-${index}-remove`}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
