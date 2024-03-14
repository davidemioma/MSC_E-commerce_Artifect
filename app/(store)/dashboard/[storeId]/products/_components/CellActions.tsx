import React, { useState } from "react";
import Status from "./Status";
import { toast } from "sonner";
import { ProductCol } from "./Columns";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import AlertModal from "@/components/modal/AlertModal";
import { useParams, useRouter } from "next/navigation";
import ViewProductModal from "@/components/modal/ViewProductModal";
import { MoreVertical, Edit, Trash, Eye, View } from "lucide-react";
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

  const [open, setOpen] = useState(false);

  const [viewProduct, setViewProduct] = useState(false);

  const [viewStatus, setViewStatus] = useState(false);

  const { mutate: onDelete, isPending } = useMutation({
    mutationKey: ["delete-product-modal"],
    mutationFn: async () => {
      await axios.delete(`/api/stores/${params.storeId}/products/${data?.id}`);
    },
    onSuccess: () => {
      toast.success("Product Deleted!");

      router.push(`/dashboard/${params.storeId}/products`);

      router.refresh();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
        featureToDelete="product"
      />

      <ViewProductModal
        isOpen={viewProduct}
        onClose={() => setViewProduct(false)}
        productId={data.id}
      />

      <Status
        open={viewStatus}
        status={data.status}
        statusFeedback={data.statusFeedback}
        onOpenChange={() => setViewStatus(false)}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild data-cy={`${data.id}-trigger`}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>

            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Product</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setViewStatus(true)}
            disabled={isPending}
          >
            <View className="w-4 h-4 mr-2" />
            View Status
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setViewProduct(true)}
            disabled={isPending}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/${data.storeId}/products/${data.id}`)
            }
            disabled={isPending}
            data-cy={`${data.id}-update`}
          >
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpen(true)}
            disabled={isPending}
            data-cy={`${data.id}-delete`}
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellActions;
