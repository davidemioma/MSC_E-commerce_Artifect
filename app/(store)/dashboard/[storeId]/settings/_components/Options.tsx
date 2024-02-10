"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { storeStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import StoreAlertModal from "./StoreAlertModal";
import { useMutation } from "@tanstack/react-query";

type Props = {
  storeId: string;
  status: string;
};

const Options = ({ storeId, status }: Props) => {
  const router = useRouter();

  const [openClose, setOpenClose] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: onClose, isPending: closing } = useMutation({
    mutationKey: ["close-store", storeId],
    mutationFn: async () => {
      await axios.patch(`/api/stores/${storeId}/close`);
    },
    onSuccess: () => {
      toast.success(
        "Your store has been closed and is now invisible to customers."
      );

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

  const { mutate: onOpen, isPending: opening } = useMutation({
    mutationKey: ["open-store", storeId],
    mutationFn: async () => {
      await axios.patch(`/api/stores/${storeId}/open`);
    },
    onSuccess: () => {
      toast.success(
        "Your store has been reopen and is now visible to customers."
      );

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

  const { mutate: onDelete, isPending: deleting } = useMutation({
    mutationKey: ["delete-store", storeId],
    mutationFn: async () => {
      await axios.delete(`/api/stores/${storeId}`);
    },
    onSuccess: () => {
      toast.success("Store Deleted!");

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
      <StoreAlertModal
        open={openClose}
        onOpenChange={() => setOpenClose(false)}
        onConfirm={onClose}
        loading={closing || deleting || opening}
        description="This action will make your store and all its listings invisible to customers. Note that your store and product will have to go through the reviewing process again if you decide to reopen. You can reopen your store at any time from your settings."
      />

      <StoreAlertModal
        open={openDelete}
        onOpenChange={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={closing || deleting || opening}
        description="This action cannot be undone. This will permanently delete your store and remove all your products, colors, sizes and categories from our server."
      />

      <div className="flex items-center gap-3">
        {status === storeStatus.APPROVED && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenClose(true)}
            disabled={closing || deleting || opening}
          >
            Close Store
          </Button>
        )}

        {status === storeStatus.CLOSED && (
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpen()}
            disabled={closing || deleting || opening}
          >
            Open Store
          </Button>
        )}

        <Button
          type="button"
          variant="destructive"
          onClick={() => setOpenDelete(true)}
          disabled={closing || deleting || opening}
        >
          Delete Store
        </Button>
      </div>
    </>
  );
};

export default Options;
