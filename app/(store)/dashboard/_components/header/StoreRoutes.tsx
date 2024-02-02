import React from "react";
import Routes from "@/components/nav/Routes";

type Props = {
  routes: RouteType[];
  className?: string;
};

const StoreRoutes = ({ routes, className }: Props) => {
  return <Routes routes={routes} className={className} />;
};

export default StoreRoutes;
