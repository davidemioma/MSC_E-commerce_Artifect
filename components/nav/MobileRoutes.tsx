import React from "react";
import Routes from "./Routes";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type Props = {
  routes: RouteType[];
};

const MobileRoutes = ({ routes }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent className="max-w-[250px] pt-16" side="left">
        <Routes routes={routes} className="flex-col items-start gap-6" />
      </SheetContent>
    </Sheet>
  );
};

export default MobileRoutes;
