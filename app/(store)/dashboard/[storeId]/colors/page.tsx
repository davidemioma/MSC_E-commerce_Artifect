import Link from "next/link";
import { Plus } from "lucide-react";
import prismadb from "@/lib/prisma";
import Heading from "@/components/Heading";
import Container from "@/components/Container";
import { columns } from "./_components/Columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { buttonVariants } from "@/components/ui/button";

export default async function ColorsPage({
  params: { storeId },
}: {
  params: { storeId: string };
}) {
  const colors = await prismadb.color.findMany({
    where: {
      storeId,
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
            title={`Colors (${colors.length})`}
            description="Manage your store colors"
          />

          <Link
            href={`/dashboard/${storeId}/colors/new`}
            className={buttonVariants()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add new
          </Link>
        </div>

        <Separator className="my-4" />

        <DataTable columns={columns} data={colors} searchKey="name" />
      </Container>
    </div>
  );
}
