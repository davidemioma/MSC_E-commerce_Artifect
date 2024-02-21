"use client";

import { format } from "date-fns";
import CellActions from "./CellActions";
import { Query, UserRole } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export type CategoryCol = Query & {
  user: {
    name: string | null;
    role: UserRole;
  };
};

export const columns: ColumnDef<CategoryCol>[] = [
  {
    accessorKey: "ticketNumber",
    header: "#Ticket No",
    cell: ({ row }) => <div>#{row.original.ticketNumber}</div>,
  },
  { accessorKey: "userId", header: "User ID" },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div>#{row.original.user.name}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div>#{row.original.user.role}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div>{format(row.original.createdAt, "MMMM do, yyyy")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="font-bold text-violet-500">{row.original.status}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
