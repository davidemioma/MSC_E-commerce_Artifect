import Link from "next/link";
import { Plus } from "lucide-react";
import prismadb from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Heading from "@/components/Heading";
import Container from "@/components/Container";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_components/Columns";

export default async function StoreCategoriesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const { storeId } = params;

  const { user } = await currentUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full">
      <Container>
        <div className="flex items-center justify-between">
          <Heading
            title={`Categories (${categories.length})`}
            description="Manage your store categories"
          />

          <Link
            href={`/dashboard/${storeId}/categories/new`}
            className={buttonVariants()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add new
          </Link>
        </div>

        <Separator className="my-4" />

        <DataTable columns={columns} data={categories} searchKey="name" />
      </Container>
    </div>
  );
}
