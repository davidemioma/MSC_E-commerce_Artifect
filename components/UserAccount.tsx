"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import useCurrentUser from "@/hooks/use-current-user";
import useCurrentRole from "@/hooks/use-current-role";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserAccount = () => {
  const { user } = useCurrentUser();

  const { role } = useCurrentRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild data-testid="user-account-trigger">
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={user?.image || "/no-profile.jpeg"}
            alt="user-profile"
          />
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[250px]" align="end">
        <DropdownMenuLabel>{user?.name}&apos;s Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {role === "ADMIN" && (
          <DropdownMenuItem asChild data-testid="go-to-dashboard">
            <Link href={"/admin"}>Go to admin dashboard</Link>
          </DropdownMenuItem>
        )}

        {role !== "ADMIN" && (
          <DropdownMenuItem
            asChild
            data-testid={role === "USER" ? "become-a-seller" : "go-to-store"}
          >
            <Link href={"/store"}>
              {role === "USER" ? "Become a seller" : "Go to store"}
            </Link>
          </DropdownMenuItem>
        )}

        {role === "USER" && (
          <DropdownMenuItem asChild>
            <Link href={"/orders"}>My Orders</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href={"/settings"}>Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <button onClick={async () => await signOut()}>Sign Out</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccount;
