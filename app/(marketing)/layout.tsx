"use client";

import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import NavBar from "./_components/NavBar";
import { usePathname } from "next/navigation";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "relative flex flex-col min-h-full w-full bg-gray-100",
        pathname === "/orders" && "bg-white"
      )}
    >
      <NavBar />

      <main className="flex-1 flex-grow py-20">{children}</main>

      <Footer />
    </div>
  );
};

export default MarketingLayout;
