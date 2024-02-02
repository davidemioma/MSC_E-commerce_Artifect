import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFirstStoreByUserId } from "@/data/store";

const CreateStoreLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = await currentUser();

  if (!user) {
    return redirect("/auth/sign-in");
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
