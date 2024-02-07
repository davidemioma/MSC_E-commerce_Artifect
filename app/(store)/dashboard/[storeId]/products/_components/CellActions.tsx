import React from "react";
import { ProductCol } from "./Columns";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { MoreVertical, Edit, Trash, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  data: ProductCol;
};

const CellActions = ({ data }: Props) => {
  const params = useParams();

  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>

            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Product</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => {}} disabled={false}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/${data.storeId}/products/${data.id}`)
            }
            disabled={false}
          >
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {}} disabled={false}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellActions;
