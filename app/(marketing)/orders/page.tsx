import prismadb from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import Heading from "@/components/Heading";
import Container from "@/components/Container";
import { Separator } from "@/components/ui/separator";

export default async function OrdersPage() {
  const { user } = await currentUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  if (user.role !== UserRole.USER) {
    return redirect("/");
  }

  const orders = await prismadb.order.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <Container>
      <Heading title="Your Orders" description="View all orders" />

      <Separator className="my-4" />
    </Container>
  );
}
