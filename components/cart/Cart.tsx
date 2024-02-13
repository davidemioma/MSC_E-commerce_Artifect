"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { CartType } from "@/types";
import { ShoppingCartIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useCurrentUser from "@/hooks/use-current-user";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Cart = () => {
  const { user } = useCurrentUser();

  const [isMounted, setIsMounted] = useState(false);

  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-cart-item", user?.id],
    queryFn: async () => {
      const res = await axios.get("/api/cart");

      return res.data as CartType;
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet>
      <SheetTrigger className="group flex items-center gap-1 px-2">
        <ShoppingCartIcon
          className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />

        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {cart?.cartItems.length || 0}
        </span>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="py-2.5">
            Cart ({cart?.cartItems.length || 0})
          </SheetTitle>
        </SheetHeader>

        <div>Items</div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
