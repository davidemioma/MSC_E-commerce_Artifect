"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const Socials = () => {
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const signInWithGoogle = () => {
    signIn("google", {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="w-full flex items-center gap-2">
      <Button
        className="w-full flex items-center gap-2"
        size="lg"
        variant="outline"
        onClick={signInWithGoogle}
      >
        <FcGoogle className="w-5 h-5" />

        <span>Sign in with Google</span>
      </Button>
    </div>
  );
};

export default Socials;
