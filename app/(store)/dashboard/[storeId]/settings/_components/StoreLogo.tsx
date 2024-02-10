"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { Trash2, ImagePlus } from "lucide-react";
import useCurrentUser from "@/hooks/use-current-user";
import { uploadToStorage } from "@/lib/functions";

type Props = {
  value?: string | undefined;
  disabled?: boolean;
  storeId: string;
  onChange: (base64: string | undefined) => void;
};

const StoreLogo = ({ value, disabled, storeId, onChange }: Props) => {
  const { user } = useCurrentUser();

  const [base64, setBase64] = useState(value);

  const clearImage = () => {
    setBase64("");

    onChange(undefined);
  };

  const handleDrop = (files: any) => {
    if (!user || !storeId) return;

    const file = files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async (e: any) => {
      setBase64(e.target.result);

      const imgUrl = await uploadToStorage({
        file: e.target.result,
        userId: user?.id,
        pathname: `/store/${storeId}/logo`,
      });

      onChange(imgUrl || undefined);
    };
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    onDrop: handleDrop,
    onDropRejected: () => {
      toast.error("Could not upload! Try again later.");

      return;
    },
    disabled,
    accept: {
      "image/*": [],
    },
  });

  useEffect(() => {
    setBase64(value);
  }, [value]);

  return (
    <div
      {...getRootProps()}
      className="w-full max-w-sm p-4 text-center rounded-md cursor-pointer border-2 border-dotted border-gray-200"
    >
      <input {...getInputProps()} />

      {!base64 && (
        <div className="flex flex-col">
          <ImagePlus className="w-10 h-10 mb-5 mx-auto text-violet-400" />

          <span className="text-violet-400 font-medium">
            Choose files or drag and drop
          </span>

          <span className="text-sm">Store Logo (2MB)</span>
        </div>
      )}

      {base64 && typeof base64 === "string" && (
        <div className="relative w-16 h-16 mx-auto bg-black rounded-full">
          <Image
            className="object-cover rounded-full"
            src={base64}
            fill
            alt=""
          />

          <Trash2
            className="absolute -top-1 -right-0 cursor-ponter text-red-500"
            onClick={clearImage}
          />
        </div>
      )}
    </div>
  );
};

export default StoreLogo;
