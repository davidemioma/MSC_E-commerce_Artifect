"use client";

import React, { useState } from "react";
import { OrderCol } from "@/types";
import StatusModal from "./StatusModal";
import { adminCanUpdate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AdminOrderStatusChange } from "@/types";
import { MoreVertical, Eye, Upload } from "lucide-react";
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
  const [track, setTrack] = useState(false);

  const [update, setUpdate] = useState(false);

  return (
    <>
      <TrackOrderModal
        isOpen={track}
        onClose={() => setTrack(false)}
        order={data}
      />

      {adminCanUpdate(data.status) && (
        <StatusModal
          open={update}
          onOpenChange={() => setUpdate(false)}
          currentStatus={data.status as AdminOrderStatusChange}
          orderId={data.id}
        />
      )}

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

          <DropdownMenuItem onClick={() => setTrack(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Track Order
          </DropdownMenuItem>

          {adminCanUpdate(data.status) && (
            <DropdownMenuItem onClick={() => setUpdate(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Update Order
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellActions;
