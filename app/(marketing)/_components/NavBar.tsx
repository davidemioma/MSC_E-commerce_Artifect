"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { UserRole } from "@prisma/client";
import Cart from "@/components/cart/Cart";
import { usePathname } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import UserAccount from "@/components/UserAccount";
import useCurrentUser from "@/hooks/use-current-user";

const NavBar = () => {
  const pathname = usePathname();

  const { user } = useCurrentUser();

  const showCart = user?.role === UserRole.USER && pathname !== "/checkout";

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-white h-16 flex items-center border-b border-gray-200 shadow-sm">
      <Container>
        <div className="flex items-center justify-between">
          <Logo />

          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <UserAccount />

              {showCart && <Cart />}
            </div>
          ) : (
            <Button variant="outline">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </Container>
    </nav>
  );
};

export default NavBar;
