import { redirect } from "next/navigation";
import { currentRole, currentUser } from "@/lib/auth";
import AdminNav from "./_components/nav/AdminNav";

const AdminDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = await currentUser();

  const { role } = await currentRole();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  if (role !== "ADMIN") {
    return redirect("/");
  }

  return (
    <div className="relative min-h-full w-full bg-white">
      <AdminNav />

      <main className="py-6">{children}</main>
    </div>
  );
};

export default AdminDashboardLayout;
