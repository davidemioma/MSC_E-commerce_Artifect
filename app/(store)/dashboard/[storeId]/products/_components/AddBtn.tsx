"use client";

import React from "react";
import { Plus } from "lucide-react";

type Props = {
  onClick?: () => void;
  disabled: boolean;
};

const AddBtn = ({ onClick, disabled }: Props) => {
  return (
    <button
      type="button"
      className="bg-blue-400 w-5 h-5 flex items-center justify-center rounded-full overflow-hidden disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      <Plus className="w-3 h-3 text-white" />
    </button>
  );
};

export default AddBtn;
