import React from "react";
import { cn } from "@/lib/utils";
import { Nunito_Sans } from "next/font/google";

const font = Nunito_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("text-4xl font-semibold", font.className)}>🛍</span>

      <span className="font-medium">LocalMart</span>
    </div>
  );
};

export default Logo;
