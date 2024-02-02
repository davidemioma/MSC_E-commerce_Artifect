"use client";

import React from "react";
import Link from "next/link";
import { Store } from "@prisma/client";
import { signOut } from "next-auth/react";
import useCurrentUser from "@/hooks/use-current-user";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  currentStore?: Store;
};

const StoreAccount = ({ currentStore }: Props) => {
  const { user } = useCurrentUser();

  if (!currentStore) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.image || "/no-profile.jpeg"} />
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[250px]" align="end">
        <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href="/">Go to Homepage</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link href={`/dashboard/${currentStore.id}/settings`}>
            Store Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <button onClick={() => signOut()}>Sign Out</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StoreAccount;
