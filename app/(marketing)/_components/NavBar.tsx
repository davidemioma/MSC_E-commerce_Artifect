"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Cart from "@/components/cart/Cart";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import UserAccount from "@/components/UserAccount";
import useCurrentUser from "@/hooks/use-current-user";

const NavBar = () => {
  const { user } = useCurrentUser();

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-white h-16 flex items-center border-b border-gray-200 shadow-sm">
      <Container>
        <div className="flex items-center justify-between">
          <Logo />

          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <UserAccount />

              <Cart />
            </div>
          ) : (
            <Button variant="outline" data-testid="nav-sign-in-btn">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </Container>
    </nav>
  );
};

export default NavBar;
