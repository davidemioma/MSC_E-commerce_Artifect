import React from "react";
import { Store } from "@prisma/client";
import StoreSwitcher from "./StoreSwitcher";
import Container from "@/components/Container";

type Props = {
  stores: Store[];
};

const Header = ({ stores }: Props) => {
  return (
    <header className="h-14 bg-white flex items-center border-b border-gray-200 shadow-sm">
      <Container>
        <div>
          <StoreSwitcher stores={stores} />
        </div>
      </Container>
    </header>
  );
};

export default Header;
