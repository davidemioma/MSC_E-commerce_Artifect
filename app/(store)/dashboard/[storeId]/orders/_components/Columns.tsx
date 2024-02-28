"use client";

import Image from "next/image";
import { format } from "date-fns";
import { StoreOrderCol } from "@/types";
import CellActions from "./CellActions";
import { ColumnDef } from "@tanstack/react-table";
import { cn, formatPrice } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";

export const columns: ColumnDef<StoreOrderCol>[] = [
  {
    accessorKey: "user",
    header: "Ordered By",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.order.user?.name || ""}</div>
    ),
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => (
      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 rounded-full overflow-hidden">
            <Image
              className="object-cover"
              src={row.original.productItem.images[0]}
              fill
              alt="item-image"
            />
          </div>

          <span className="font-medium">
            {row.original.product.name} ({row.original.availableItem.size.name})
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.quantity}</div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="font-medium">
        {formatPrice(
          row.original.quantity * row.original.availableItem.currentPrice,
          { currency: "GBP" }
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => (
      <div
        className={cn(
          "font-bold text-black",
          row.original.order.status === OrderStatus.CONFIRMED &&
            "text-green-500",
          row.original.order.status === OrderStatus.CANCELLED && "text-red-500"
        )}
      >
        {row.original.order.status}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div>{format(row.original.createdAt, "MMMM do, yyyy")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
