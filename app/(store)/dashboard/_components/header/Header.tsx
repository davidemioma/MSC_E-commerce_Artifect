"use client";

import React from "react";
import Routes from "./Routes";
import { Store } from "@prisma/client";
import MobileRoutes from "./MobileRoutes";
import StoreAccount from "../StoreAccount";
import StoreSwitcher from "../StoreSwitcher";
import Container from "@/components/Container";
import { useParams, usePathname } from "next/navigation";

type Props = {
  stores: Store[];
};

const Header = ({ stores }: Props) => {
  const params = useParams();

  const pathname = usePathname();

  const currentStore = stores.find((store) => store.id === params.storeId);

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/dashboard/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/dashboard/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/dashboard/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
      active: pathname === `/dashboard/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathname === `/dashboard/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathname === `/dashboard/${params.storeId}/orders`,
    },
  ];

  return (
    <header className="h-14 bg-white flex items-center border-b border-gray-200 shadow-sm">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MobileRoutes routes={routes} />

            <StoreSwitcher stores={stores} />
          </div>

          <div className="hidden md:inline-flex mx-6 flex-1">
            <Routes routes={routes} />
          </div>

          <StoreAccount currentStore={currentStore} />
        </div>
      </Container>
    </header>
  );
};

export default Header;
