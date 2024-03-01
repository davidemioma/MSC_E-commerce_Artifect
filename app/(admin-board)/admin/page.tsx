import Link from "next/link";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { currentUser } from "@/lib/auth";
import Heading from "@/components/Heading";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import DataChart from "../_components/DataChart";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getProductChartData,
  getStoreChartData,
  getUsersCount,
} from "@/data/admin-overview";

export default async function AdminPage() {
  const { user } = await currentUser();

  const storesChartData = await getStoreChartData();

  const nonVerifiedUserCount = await getUsersCount();

  const verifiedUserCount = await getUsersCount(true);

  const productChartData = await getProductChartData();

  return (
    <div className="w-full">
      <Container>
        <Heading
          title={`${user?.name}(Admin)`}
          description="Overview of the website."
        />

        <Separator className="my-4" />

        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Users</h1>

              <Link href="/admin/users">
                <Button variant={"violet"}>View All</Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="font-bold">Verified Users</CardTitle>

                  <Users className="h-5 w-5 text-violet-500 font-bold" />
                </CardHeader>

                <CardContent>
                  <div
                    className={cn(
                      "text-2xl font-bold",
                      verifiedUserCount > 0 && "text-green-500"
                    )}
                  >
                    {verifiedUserCount > 0 && "+"}
                    {verifiedUserCount}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="font-bold">
                    Non-Verified Users
                  </CardTitle>

                  <Users className="h-5 w-5 text-violet-500 font-bold" />
                </CardHeader>

                <CardContent>
                  <div
                    className={cn(
                      "text-2xl font-bold",
                      nonVerifiedUserCount > 0
                        ? "text-red-500"
                        : "text-green-500"
                    )}
                  >
                    {nonVerifiedUserCount > 0 && "+"}
                    {nonVerifiedUserCount}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Stores</h1>

              <Link href="/admin/stores">
                <Button variant={"violet"}>View All</Button>
              </Link>
            </div>

            <DataChart data={storesChartData} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Products</h1>

              <Link href="/admin/products">
                <Button variant={"violet"}>View All</Button>
              </Link>
            </div>

            <DataChart data={productChartData} />
          </div>
        </div>
      </Container>
    </div>
  );
}
