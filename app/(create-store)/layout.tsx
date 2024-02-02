import { redirect } from "next/navigation";
import { getFirstStoreByUserId } from "@/data/store";
import { currentRole, currentUser } from "@/lib/auth";

const CreateStoreLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = await currentUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  const { role } = await currentRole();

  if (role === "ADMIN" || role === "USER") {
    return redirect("/");
  }

  const store = await getFirstStoreByUserId(user?.id);

  if (store) {
    return redirect(`/dashboard/${store.id}`);
  }

  return (
    <div className="relative min-h-full w-full bg-gray-100">{children}</div>
  );
};

export default CreateStoreLayout;
