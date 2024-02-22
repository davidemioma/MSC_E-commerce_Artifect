"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CartItemType } from "../../../../types";
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
        disabled={cartItems?.length === 0}
      >
        Checkout
      </Button>
    </div>
  );
};

export default OrderSummary;
