"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Empty from "../Empty";
import Spinner from "../Spinner";
import CartItem from "./CartItem";
import { CartType } from "@/types";
import { UserRole } from "@prisma/client";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { ShoppingCartIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useCurrentUser from "@/hooks/use-current-user";
import { SHIPPING_FEE, TRANSACTION_FEE, formatPrice } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

const Cart = () => {
  const pathname = usePathname();

  const { user } = useCurrentUser();

  const [isMounted, setIsMounted] = useState(false);

  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-cart-item"],
    queryFn: async () => {
      const res = await axios.get("/api/cart");

      return res.data as CartType;
    },
  });

  const emptyCart =
    !isLoading &&
    !isError &&
    (!cart || !cart.cartItems || cart.cartItems.length === 0);

  const cartTotal =
    (cart?.cartItems?.reduce(
      (total, item) =>
        total + ((item.availableItem?.currentPrice || 0) * item?.quantity || 0),
      0
    ) || 0) +
    TRANSACTION_FEE +
    SHIPPING_FEE;

  const showCart = user?.role === UserRole.USER && pathname !== "/checkout";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !showCart) return null;

  return (
    <Sheet>
      <SheetTrigger
        className="group flex items-center gap-1 px-2"
        data-cy="cart-trigger"
        data-testid="cart-trigger"
      >
        <ShoppingCartIcon
          className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />

        <span
          className="text-sm font-medium text-gray-700 group-hover:text-gray-800"
          data-cy="cart-number"
        >
          {cart?.cartItems?.length || 0}
        </span>
      </SheetTrigger>

      <SheetContent
        className="w-full sm:max-w-lg flex flex-col"
        data-cy="cart-content"
        data-testid="cart-content"
      >
        <SheetHeader>
          <SheetTitle className="py-2.5">
            Cart ({cart?.cartItems?.length || 0})
          </SheetTitle>
        </SheetHeader>

        {isLoading && (
          <div className="h-full">
            <Spinner />
          </div>
        )}

        {isError && <Empty message="Could not get item! Try again later" />}

        {emptyCart && (
          <div data-cy="empty-cart">
            <Empty message="Looks like you haven't added anything to your cart yet. Ready to start shopping? Browse our collection to find something you'll love!" />
          </div>
        )}

        {!isLoading && !isError && cart?.cartItems && (
          <>
            {cart?.cartItems?.length > 0 && (
              <ScrollArea>
                <div className="space-y-5">
                  {cart?.cartItems?.map((item, i) => (
                    <CartItem key={item.id} cartItem={item} index={i} />
                  ))}
                </div>
              </ScrollArea>
            )}
          </>
        )}

        {!isLoading &&
          !isError &&
          cart?.cartItems &&
          cart.cartItems.length > 0 && (
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
          )}

        {!isLoading &&
          !isError &&
          cart?.cartItems &&
          cart.cartItems.length > 0 && (
            <SheetFooter>
              <SheetTrigger asChild>
                <Link
                  href="/checkout"
                  className={buttonVariants({
                    className: "w-full bg-violet-500",
                  })}
                  data-cy="checkout-btn"
                >
                  Continue to Checkout
                </Link>
              </SheetTrigger>
            </SheetFooter>
          )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
