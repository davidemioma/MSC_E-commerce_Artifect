import prismadb from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Heading from "@/components/Heading";
import Options from "./_components/Options";
import Container from "@/components/Container";
import { cn, getStatusColor } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import SettingsForm from "./_components/SettingsForm";

export default async function StoreDashboardPage({
  params,
}: {
  params: { storeId: string };
}) {
  const { storeId } = params;

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

  return (
    <Container>
      <Heading
        title="Store Settings"
        description="Manage your store settings."
      />

      <Separator className="my-4" />

      <div className="w-full space-y-3">
        <h1 className="text-2xl font-bold">Status</h1>

        <div className="space-y-1">
          <p className="font-medium">
            Status:{" "}
            <span className={cn("font-semibold", getStatusColor(store.status))}>
              {store.status}
            </span>
          </p>

          <p className="text-sm">{store.statusFeedback}</p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="w-full space-y-3">
        <h1 className="text-2xl font-bold">Details</h1>

        <SettingsForm store={store} />
      </div>

      <Separator className="my-4" />

      <Options storeId={store.id} status={store.status} />
    </Container>
  );
}
