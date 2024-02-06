"use client";

import { format } from "date-fns";
import { Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export type ProductCol = Product;

export const columns: ColumnDef<ProductCol>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div>{format(row.original.createdAt, "MMMM do, yyyy")}</div>
    ),
  },
];
