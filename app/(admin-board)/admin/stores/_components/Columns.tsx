"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Store, storeStatus } from "@prisma/client";

export type CategoryCol = Store;

const getColor = (status: storeStatus) => {
  let color;

  switch (status) {
    case "PENDING":
      color = "text-gray-500";
      break;
    case "REVIEWING":
      color = "text-orange-500";
      break;
    case "APPROVED":
      color = "text-green-500";
      break;
    case "DECLINED":
      color = "text-red-500";
      break;
    case "CLOSED":
      color = "text-gray-600";
      break;
    default:
      color = "text-black";
      break;
  }

  return color;
};

export const columns: ColumnDef<CategoryCol>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "emailVerified",
    header: "Email Verified",
    cell: ({ row }) => (
      <>
        {row.original.emailVerified ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <X className="w-4 h-4 text-red-500" />
        )}
      </>
    ),
  },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "postcode", header: "Postcode" },
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => (
      <div className="relative w-7 h-7 rounded-full overflow-hidden">
        <Image
          className="object-cover"
          src={row.original.logo || "/no-profile.jpeg"}
          fill
          alt=""
        />
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className={cn("font-bold", getColor(row.original.status))}>
        {row.original.status}
      </div>
    ),
  },
];
