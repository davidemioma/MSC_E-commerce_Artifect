import Image from "next/image";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Heading from "@/components/Heading";
import { storeStatus } from "@prisma/client";
import { cn, formatPrice } from "@/lib/utils";
import Container from "@/components/Container";
import { Separator } from "@/components/ui/separator";
import RevenueGraph from "../_components/RevenueGraph";
import ShareStoreLink from "../_components/ShareStoreLink";
import { PoundSterling, CreditCard, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getGraphData,
  getNumOfProductsInStock,
  getSalesCountByStoreId,
  getStore,
  getStoreBanner,
  getTotalRevenue,
} from "@/data/store-overview";

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

  const store = await getStore({ userId: user?.id, storeId });

  if (!store) {
    return redirect("/store");
  }

  const graphData = await getGraphData(storeId);

  const banner = await getStoreBanner({ storeId });

  const totalRevenue = await getTotalRevenue({ storeId });

  const salesCount = await getSalesCountByStoreId({ storeId });

  const productInStock = await getNumOfProductsInStock({ storeId });

  return (
    <div className="w-full">
      <Container>
        <div className="flex items-center justify-between gap-3">
          <Heading title={store.name} description="Overview of your store" />

          {store.status === storeStatus.APPROVED && (
            <ShareStoreLink storeId={storeId} />
          )}
        </div>

        {banner?.image && <div className="my-4" />}

        {!banner?.image && <Separator className="my-4" />}
      </Container>

      {banner?.image && (
        <div className="relative w-full aspect-square md:aspect-video lg:h-[65vh] overflow-hidden mb-10">
          <Image
            className="object-cover"
            src={banner?.image}
            fill
            alt="banner-img"
          />
        </div>
      )}

      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="font-bold">Total Revenue</CardTitle>

              <PoundSterling className="h-5 w-5 text-violet-500 font-bold" />
            </CardHeader>

            <CardContent>
              <div
                className={cn(
                  "text-2xl font-bold",
                  totalRevenue > 0 && "text-green-500"
                )}
              >
                {formatPrice(totalRevenue, {
                  currency: "GBP",
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="font-bold">Sales</CardTitle>

              <CreditCard className="h-5 w-5 text-violet-500 font-bold" />
            </CardHeader>

            <CardContent>
              <div
                className={cn(
                  "text-2xl font-bold",
                  salesCount > 0 && "text-green-500"
                )}
              >
                {salesCount > 0 && "+"}
                {salesCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="font-bold">Products in Stocks</CardTitle>

              <Package className="h-5 w-5 text-violet-500 font-bold" />
            </CardHeader>

            <CardContent>
              <div
                className={cn(
                  "text-2xl font-bold",
                  productInStock > 0 && "text-green-500"
                )}
              >
                {productInStock > 0 && "+"}
                {productInStock}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="font-bold">Overview</CardTitle>
            </CardHeader>

            <CardContent className="pl-2">
              <RevenueGraph data={graphData} />
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
