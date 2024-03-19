import Image from "next/image";
import prismadb from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MdVerified } from "react-icons/md";
import Container from "@/components/Container";
import StoreFeed from "./_components/StoreFeed";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";

export default async function StorePage({
  params: { storeId, productId },
}: {
  params: { productId: string; storeId: string };
}) {
  const store = await prismadb.store.findUnique({
    where: {
      id: storeId,
    },
    include: {
      Banners: {
        where: {
          active: true,
        },
      },
    },
  });

  if (!store) {
    return redirect("/");
  }

  const products = await prismadb.product.findMany({
    where: {
      storeId,
      status: "APPROVED",
      productItems: {
        some: {
          availableItems: {
            some: {
              numInStocks: {
                gt: 0,
              },
            },
          },
        },
      },
    },
    include: {
      category: true,
      productItems: {
        where: {
          availableItems: {
            some: {
              numInStocks: {
                gt: 0,
              },
            },
          },
        },
        include: {
          availableItems: {
            include: {
              size: true,
            },
          },
        },
      },
      reviews: {
        select: {
          value: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  const productCount = await prismadb.product.count({
    where: {
      storeId,
      status: "APPROVED",
    },
  });

  return (
    <div className="w-full space-y-10">
      <div className="relative w-full h-40 md:h-[50vh] bg-white overflow-hidden border-b shadow-sm">
        {store.Banners[0].image ? (
          <Image
            className="object-cover"
            src={store.Banners[0].image}
            fill
            alt="store-banner"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6 text-center">
              <h1 className="text-4xl sm:text-6xl text-gray-900 font-bold tracking-tight">
                High-Quality <span className="text-violet-500">Products</span>{" "}
                You Can Trust, Every Time.
              </h1>

              <p className="max-w-prose text-lg text-gray-500">
                LocalMart 🛍 - your trusted source for top-quality products. We
                check everything to make sure it&apos;s the best you can find!
              </p>
            </div>
          </div>
        )}
      </div>

      <Container>
        <div className="flex items-center gap-2">
          <Avatar className="w-20 h-20">
            <AvatarImage src={store.logo || "/no-profile.jpeg"} />
          </Avatar>

          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-bold">{store.name}</h2>

            {store.emailVerified && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">Verified</span>

                <MdVerified className="w-4 h-4 text-violet-500" />
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        {store.description && (
          <div
            className="w-full text-sm text-gray-500 max-w-2xl"
            dangerouslySetInnerHTML={{ __html: store.description }}
          />
        )}

        <main className="mt-10 space-y-5">
          <h1 className="text-2xl font-bold">Products ({productCount})</h1>

          <StoreFeed
            storeId={storeId}
            productId={productId}
            initialData={products}
          />
        </main>
      </Container>
    </div>
  );
}
