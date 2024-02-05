"use client";

import { format } from "date-fns";
import { Size } from "@prisma/client";
import CellActions from "./CellActions";
import { ColumnDef } from "@tanstack/react-table";

export type SizeCol = Size & {
  _count: {
    products: number;
  };
};

export const columns: ColumnDef<SizeCol>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "value", header: "Value" },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div>{format(row.original.createdAt, "MMMM do, yyyy")}</div>
    ),
  },
  {
    accessorKey: "Products",
    header: "Number of Products",
    cell: ({ row }) => <div>{row.original._count.products}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
