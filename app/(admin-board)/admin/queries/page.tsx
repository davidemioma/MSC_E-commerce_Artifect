import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import Heading from "@/components/Heading";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import { columns } from "./_components/Columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { getAdminQueries } from "@/data/query";

export default async function AdminQueriesPage({
  searchParams: { status },
}: {
  searchParams: { status: string };
}) {
  const { user } = await currentUser();

  if (!user || user.role !== UserRole.ADMIN) {
    return redirect("/");
  }

  const queries = await getAdminQueries(status);

  return (
    <Container>
      <Heading
        title={`Queries (${queries.length})`}
        description="View all Queries"
      />

      <Separator className="my-4" />

      <DataTable
        columns={columns}
        data={queries}
        searchKey="ticketNumber"
        isQueries
      />
    </Container>
  );
}
