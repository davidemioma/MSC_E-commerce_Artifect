import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { getStoreById } from "@/data/store";

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

  const store = await getStoreById({ userId: user?.id, storeId });

  if (!store) {
    return redirect("/store");
  }

  return <div>StoreDashboardPage {storeId}</div>;
}
