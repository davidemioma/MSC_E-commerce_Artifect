import prismadb from "@/lib/prisma";
import Empty from "@/components/Empty";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import Heading from "@/components/Heading";
import Container from "@/components/Container";
import CartItem from "@/components/cart/CartItem";
import { Separator } from "@/components/ui/separator";
import OrderSummary from "./_components/OrderSummary";

export default async function CheckoutPage() {
  const { user } = await currentUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  if (user.role !== UserRole.USER) {
    return redirect("/");
  }

  const cart = await prismadb.cart.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      cartItems: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
          productItem: true,
          availableItem: {
            include: {
              size: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return (
    <Container>
      <Heading title="Checkout" description="Finalize Your Purchase" />

      <Separator className="my-4" />

      <main className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2">
          {cart?.cartItems && cart?.cartItems?.length > 0 ? (
            <div className="space-y-5">
              {cart.cartItems.map((item, i) => (
                <CartItem key={item.id} cartItem={item} isCheckout index={i} />
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
    </Container>
  );
}
