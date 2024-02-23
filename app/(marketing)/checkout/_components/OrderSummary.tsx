"use client";

import React from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { CartItemType } from "../../../../types";
import BtnSpinner from "@/components/BtnSpinner";
import { useMutation } from "@tanstack/react-query";
import { CartItemsValidator } from "@/lib/validators/cart-item";
import { SHIPPING_FEE, TRANSACTION_FEE, formatPrice } from "@/lib/utils";

type Props = {
  cartItems: CartItemType[];
};

const OrderSummary = ({ cartItems }: Props) => {
  const cartTotal =
    (cartItems?.reduce(
      (total, item) =>
        total + ((item.availableItem?.currentPrice || 0) * item?.quantity || 0),
      0
    ) || 0) +
    TRANSACTION_FEE +
    SHIPPING_FEE;

  const { mutate: createStripeSession, isPending } = useMutation({
    mutationKey: ["create-checkout-session"],
    mutationFn: async (values: CartItemsValidator) => {
      const res = await axios.post("/api/checkout", values);

      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success("Redirecting");

      window.location.href = data.url;
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
    <div className="bg-white h-fit p-5 space-y-5 rounded-lg">
      <h1 className="text-lg font-bold">Order Summary</h1>

      <div className="space-y-2 text-sm">
        <div className="flex">
          <span className="flex-1">Shipping</span>

          <span className="font-semibold">
            {formatPrice(SHIPPING_FEE, { currency: "GBP" })}
          </span>
        </div>

        <div className="flex">
          <span className="flex-1">Transaction Fee</span>

          <span className="font-semibold">
            {formatPrice(TRANSACTION_FEE, { currency: "GBP" })}
          </span>
        </div>

        <div className="flex">
          <span className="flex-1">Total</span>

          <span className="font-semibold">
            {formatPrice(cartTotal, { currency: "GBP" })}
          </span>
        </div>
      </div>

      <Button
        className="w-full bg-violet-500 hover:bg-violet-600 hover:opacity-75 disabled:opacity-75 disabled:cursor-not-allowed"
        size="lg"
        type="button"
        disabled={cartItems?.length === 0 || isPending}
        onClick={() =>
          createStripeSession({
            cartItems: cartItems.map((item) => ({
              productId: item.productId,
              productItemId: item.productItemId,
              availableItemId: item.availableItemId,
              quantity: item.quantity,
            })),
          })
        }
      >
        {isPending ? <BtnSpinner /> : "Checkout"}
      </Button>
    </div>
  );
};

export default OrderSummary;
