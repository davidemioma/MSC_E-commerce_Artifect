import React from "react";
import MobileRoutes from "@/components/nav/MobileRoutes";

type Props = {
  routes: RouteType[];
};

const MobileAdminNav = ({ routes }: Props) => {
  return <MobileRoutes routes={routes} />;
};

export default MobileAdminNav;
