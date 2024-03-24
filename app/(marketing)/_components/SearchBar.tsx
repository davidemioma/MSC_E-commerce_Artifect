"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { XIcon, SearchIcon } from "lucide-react";

const SearchBar = () => {
  const router = useRouter();

  const [value, setValue] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value.trim() === "") return;

    router.push(`/products/search?query=${value}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full h-10 bg-background flex gap-3 border border-input px-3 py-2 rounded-md text-sm ring-offset-background "
    >
      <input
        className="w-full flex-1 outline-none"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {value.trim() && (
        <button
          type="button"
          className="flex items-center justify-center"
          onClick={() => setValue("")}
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}

      <button type="submit" className="flex items-center justify-center">
        <SearchIcon className="w-4 h-4" />
      </button>
    </form>
  );
};

export default SearchBar;
