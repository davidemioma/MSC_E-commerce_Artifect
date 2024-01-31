"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import AuthError from "@/components/auth/AuthError";
import CardWrapper from "@/components/auth/CardWrapper";
import AuthSuccess from "@/components/auth/AuthSuccess";

type Props = {
  token: string;
};

const NewVerificationForm = ({ token }: Props) => {
  const [error, setError] = useState<string | undefined>();

  const [success, setSuccess] = useState<string | undefined>();

  const verify = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");

      return;
    }

    axios
      .patch("/api/auth/new-verification", { token })
      .then((res) => {
        setSuccess(res.data);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response?.data || "Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      secondaryLabel="Back to login"
      secondaryHref="/auth/sign-in"
    >
      <div className="w-full flex items-center justify-center">
        {!success && !error && <BeatLoader />}

        <AuthSuccess message={success} />

        {!success && <AuthError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
