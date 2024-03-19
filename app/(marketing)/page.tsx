import Link from "next/link";
import Feed from "./_components/Feed";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Heading from "@/components/Heading";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { getHomePageProducts } from "@/data/product";

export default async function Home() {
  const { user } = await currentUser();

  const products = await getHomePageProducts();

  return (
    <div className="w-full space-y-10">
      <div className="bg-white w-full h-[70vh] flex items-center justify-center">
        <div className="flex flex-col gap-4 items-center text-center">
          <Container>
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6 text-center">
              <h1 className="text-4xl sm:text-6xl text-gray-900 font-bold tracking-tight">
                High-Quality <span className="text-violet-500">Products</span>{" "}
                You Can Trust, Every Time.
              </h1>

              <p className="max-w-prose text-lg text-gray-500">
                Welcome to LocalMart 🛍 - your trusted source for top-quality
                products. We check everything to make sure it&apos;s the best
                you can find!
              </p>

              {user?.role === UserRole.USER && (
                <Link href="/store" data-cy="become-a-seller">
                  <Button
                    variant="default"
                    aria-label="Click to become a seller"
                  >
                    Become a Seller <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              )}

              {user?.role === UserRole.SELLER && (
                <Link href="/store" data-cy="go-to-store">
                  <Button variant="default" aria-label="Click to go to store">
                    Go to Store <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              )}

              {user?.role === UserRole.ADMIN && (
                <Link href="/admin">
                  <Button
                    variant="default"
                    aria-label="Click to go to dashboard"
                  >
                    Go to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              )}

              {!user && (
                <div className="flex items-center gap-3">
                  <Link href="/auth/sign-in">
                    <Button
                      variant="default"
                      aria-label="Click to go to sign in"
                    >
                      Sign In
                    </Button>
                  </Link>

                  <Link href="/auth/sign-up">
                    <Button
                      variant="outline"
                      aria-label="Click to go to register"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Container>
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
