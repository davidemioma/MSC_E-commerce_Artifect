import { currentUser } from "@/lib/auth";
import { storeStatus } from "@prisma/client";
import Container from "@/components/Container";
import Heading from "../../_components/Heading";
import { getStoresByAdmin } from "@/data/store";
import { columns } from "./_components/Columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

export default async function AdminStoresPage({
  searchParams,
}: {
  searchParams: {
    status: string;
  };
}) {
  const { status } = searchParams;

  const { user } = await currentUser();

  const stores = await getStoresByAdmin({
    userRole: user?.role,
    status,
  });

  return (
    <Container>
      <Heading title="Stores" description="Manage stores for sellers" />

      <Separator className="my-4" />

      <DataTable columns={columns} data={stores} searchKey="name" isStores />
    </Container>
  );
}
