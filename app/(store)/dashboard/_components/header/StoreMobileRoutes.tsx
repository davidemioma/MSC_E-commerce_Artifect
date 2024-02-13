import React from "react";
import { RouteType } from "@/types";
import MobileRoutes from "@/components/nav/MobileRoutes";

type Props = {
  routes: RouteType[];
};

const StoreMobileRoutes = ({ routes }: Props) => {
  return <MobileRoutes routes={routes} />;
};

export default StoreMobileRoutes;
