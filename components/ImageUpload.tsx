"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { X, ImagePlus } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadToStorage } from "@/lib/functions";
import useCurrentUser from "@/hooks/use-current-user";

type Props = {
  value?: string;
  disabled?: boolean;
  forProduct?: boolean;
  onChange: (base64: string) => void;
};

const ImageUpload = ({ value, disabled, forProduct, onChange }: Props) => {
  const { user } = useCurrentUser();

  const [base64, setBase64] = useState(value);

  const clearImage = () => {
    setBase64("");

    onChange("");
  };

  const handleDrop = (files: any) => {
    if (!user) return;

    const file = files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async (e: any) => {
      setBase64(e.target.result);

      const imgUrl = await uploadToStorage({
        file: e.target.result,
        userId: user?.id,
      });

      onChange(imgUrl || "");
    };
  };

  const handleProductDrop = (files: any) => {};

  const { getRootProps, getInputProps } = useDropzone({
    multiple: forProduct,
    maxFiles: forProduct ? 10 : 1,
    maxSize: 4 * 1024 * 1024,
    onDrop: forProduct ? handleProductDrop : handleDrop,
    onDropRejected: () => {
      toast.error("Could not upload image!");

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
    <>
      {forProduct ? (
        <div></div>
      ) : (
        <div
          {...getRootProps()}
          className="w-full max-w-[300px] mx-auto p-4 text-center rounded-md cursor-pointer border-2 border-dotted border-gray-200"
        >
          <input {...getInputProps()} />

          {!base64 && (
            <div className="flex flex-col">
              <ImagePlus className="w-10 h-10 mb-5 mx-auto text-violet-400" />

              <span className="text-violet-400 font-medium">
                Choose files or drag and drop
              </span>

              <span className="text-sm">Profile Image (4MB)</span>
            </div>
          )}

          {base64 && (
            <div className="relative w-16 h-16 mx-auto bg-black rounded-full">
              <Image
                className="object-cover rounded-full"
                src={base64}
                fill
                alt=""
              />

              <X
                className="absolute top-0 -right-2 cursor-ponter text-red-500"
                onClick={clearImage}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageUpload;
