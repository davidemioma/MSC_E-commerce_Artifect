"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  routes: RouteType[];
  className?: string;
};

const Routes = ({ routes, className }: Props) => {
  return (
    <div className={cn("flex items-center gap-4 lg:gap-6", className)}>
      {routes.map((route) => (
        <Link
          className={`text-sm font-medium transition-colors hover:text-primary ${
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          }`}
          key={route.href}
          href={route.href}
        >
          {route.label}
        </Link>
      ))}
    </div>
  );
};

export default Routes;
