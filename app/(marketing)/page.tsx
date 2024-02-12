import Link from "next/link";
import Feed from "./_components/Feed";
import { currentUser } from "@/lib/auth";
import Heading from "@/components/Heading";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { getHomePageProducts } from "@/data/product";

export default async function Home() {
  const { user } = await currentUser();

  const products = await getHomePageProducts();

  return (
    <div className="w-full space-y-10">
      <div className="bg-white w-full h-[60vh] flex items-center justify-center">
        <div className="flex flex-col gap-4 items-center text-center">
          <div className="flex items-center gap-2">
            <div className="text-8xl">🛍</div>

            <div className="text-4xl font-semibold">LocalMart</div>
          </div>

          {user ? (
            <h1 className="text-3xl font-semibold">Welcome, {user.name}</h1>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/sign-in">
                <Button variant="default">Sign In</Button>
              </Link>

              <Link href="/auth/sign-up">
                <Button variant="outline">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Container>
        <Heading title="Products" description="View all product" />

        <div className="my-4" />

        <Feed initialData={products} />
      </Container>
    </div>
  );
}
