import prismadb from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import NotApproved from "./_components/NotApproved";

export default async function ProductsPage({
  params: { storeId },
}: {
  params: { storeId: string };
}) {
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

  if (store.status !== "APPROVED") {
    return (
      <div className="w-full h-[calc(100vh-110px)] flex items-center justify-center">
        <NotApproved
          status={store.status}
          statusFeedback={store.statusFeedback}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Container>ProductsPage</Container>
    </div>
  );
}
