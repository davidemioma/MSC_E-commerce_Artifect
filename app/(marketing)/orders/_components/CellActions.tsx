"use client";

import React, { useState } from "react";
import { OrderCol } from "@/types";
import { canCancel } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Ban, Undo2 } from "lucide-react";
import TrackOrderModal from "@/components/modal/TrackOrderModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  data: OrderCol;
};

const CellActions = ({ data }: Props) => {
  const [trackOrder, setTrackOrder] = useState(false);

  return (
    <>
      <TrackOrderModal
        order={data}
        isOpen={trackOrder}
        onClose={() => setTrackOrder(false)}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>

            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Order</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setTrackOrder(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Track Order
          </DropdownMenuItem>

          {canCancel(data.status) && (
            <DropdownMenuItem onClick={() => {}}>
              <Ban className="w-4 h-4 mr-2" />
              Cancel Order
            </DropdownMenuItem>
          )}

          {data.status === OrderStatus.DELIVERED && (
            <DropdownMenuItem onClick={() => {}}>
              <Undo2 className="w-4 h-4 mr-2" />
              Return Item(s)
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellActions;
