"use client";

import React from "react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

const Socials = () => {
  return (
    <div className="w-full flex items-center gap-2">
      <Button
        className="w-full flex items-center gap-2"
        size="lg"
        variant="outline"
        onClick={() => {}}
      >
        <FcGoogle className="w-5 h-5" />

        <span>Sign in with Google</span>
      </Button>
    </div>
  );
};

export default Socials;
