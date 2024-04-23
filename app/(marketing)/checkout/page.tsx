"use client";

import axios from "axios";
import { CartType } from "@/types";
import Empty from "@/components/Empty";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import Heading from "@/components/Heading";
import Container from "@/components/Container";
import { useQuery } from "@tanstack/react-query";
import CartItem from "@/components/cart/CartItem";
import { Separator } from "@/components/ui/separator";
import OrderSummary from "./_components/OrderSummary";
import useCurrentUser from "@/hooks/use-current-user";
import CheckoutSkeleton from "@/components/CheckoutSkeleton";

export default function CheckoutPage() {
  const { user } = useCurrentUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  if (user.role !== UserRole.USER) {
    return redirect("/");
  }

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

  return (
    <Container>
      <Heading title="Checkout" description="Finalize Your Purchase" />

      <Separator className="my-4" />

      {isError && (
        <Empty message="Something went wrong! could not get cart items." />
      )}

      {isLoading && (
        <div className="space-y-5">
          {new Array(5).fill("").map((_, i) => (
            <CheckoutSkeleton key={i} />
          ))}
        </div>
      )}

      {!isError && !isLoading && cart && (
        <main className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            {cart?.cartItems && cart?.cartItems?.length > 0 ? (
              <div className="space-y-5">
                {cart.cartItems.map((item, i) => (
                  <CartItem
                    key={item.id}
                    cartItem={item}
                    isCheckout
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <Empty message="Looks like you haven't added anything to your cart yet. Ready to start shopping? Browse our collection to find something you'll love!" />
            )}
          </div>

          <OrderSummary
            cartId={cart?.id || ""}
            cartItems={cart?.cartItems || []}
          />
        </main>
      )}
    </Container>
  );
}
