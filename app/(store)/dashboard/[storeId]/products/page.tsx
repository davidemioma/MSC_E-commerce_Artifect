import Link from "next/link";
import prismadb from "@/lib/prisma";
import { Plus } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Heading from "@/components/Heading";
import Container from "@/components/Container";
import { columns } from "./_components/Columns";
import NotApproved from "./_components/NotApproved";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { buttonVariants } from "@/components/ui/button";

export default async function ProductsPage({
  params: { storeId },
}: {
  params: { storeId: string };
}) {
  const { user } = await currentUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  const store = await prismadb.store.findUnique({
    where: {
      id: storeId,
      userId: user.id,
    },
  });

  if (!store) {
    return redirect("/store");
  }

  if (store.status !== "APPROVED") {
    return (
      <div className="w-full h-[calc(100vh-110px)] flex items-center justify-center">
        <NotApproved
          status={store.status}
          statusFeedback={store.statusFeedback}
        />
      </div>
    );
  }

  const products = await prismadb.product.findMany({
    where: {
      userId: user.id,
      storeId,
    },
  });

  return (
    <div className="w-full">
      <Container>
        <div className="flex items-center justify-between">
          <Heading
            title={`Products (${products.length})`}
            description="Manage products in your store"
          />

          <Link
            href={`/dashboard/${storeId}/products/new`}
            className={buttonVariants()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add new
          </Link>
        </div>

        <Separator className="my-4" />

        <DataTable columns={columns} data={products} searchKey="name" />
      </Container>
    </div>
  );
}
