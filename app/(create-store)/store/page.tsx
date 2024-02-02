"use client";

import { useEffect } from "react";
import useStoreModal from "@/hooks/use-store-modal";

export default function CreateStorePage() {
  const storeModal = useStoreModal();

  useEffect(() => {
    if (!storeModal.isOpen) {
      storeModal.onOpen();
    }
  }, [storeModal.isOpen, storeModal.onOpen]);

  return null;
}
