"use client";

import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Textarea } from "./ui/textarea";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
};

const TextEditor = ({ value, onChange, disabled }: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  if (!isClient) {
    return (
      <Textarea
        rows={6}
        placeholder="Product Description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }

  return (
    <div className="w-full h-44 max-w-2xl">
      <ReactQuill
        style={{ width: "100%", height: "100%" }}
        theme="snow"
        value={value}
        onChange={(content: string) => onChange(content)}
        readOnly={disabled}
      />
    </div>
  );
};

export default TextEditor;
