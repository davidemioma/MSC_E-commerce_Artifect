import Header from "./_components/header/Header";
import { redirect } from "next/navigation";
import { getStoresByUserId } from "@/data/store";
import { currentRole, currentUser } from "@/lib/auth";

const StoreDashboardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const { storeId } = params;

  const { user } = await currentUser();

  const { role } = await currentRole();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  if (role !== "SELLER") {
    return redirect("/");
  }

  const stores = await getStoresByUserId({ userId: user.id });

  return (
    <div className="relative min-h-full w-full bg-gray-100">
      <Header stores={stores} />

      <main className="py-6">{children}</main>
    </div>
  );
};

export default StoreDashboardLayout;
