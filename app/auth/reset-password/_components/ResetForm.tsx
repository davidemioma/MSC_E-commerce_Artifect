"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthError from "@/components/auth/AuthError";
import { zodResolver } from "@hookform/resolvers/zod";
import CardWrapper from "@/components/auth/CardWrapper";
import AuthSuccess from "@/components/auth/AuthSuccess";
import { resetPassword } from "@/actions/reset-password";
import { ResetValidator, ResetSchema } from "@/lib/validators/reset-password";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ResetForm = () => {
  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetValidator>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ResetValidator) => {
    setError("");

    setSuccess("");

    startTransition(() => {
      resetPassword(values)
        .then((data) => {
          if (data?.error) {
            form.reset();

            setError(data.error);
          }
          if (data?.success) {
            form.reset();

            setSuccess(data.success);
          }
        })
        .catch((err) => {
          setError("Something went wrong");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      secondaryLabel="Back to login"
      secondaryHref="/auth/sign-in"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="john.doe@example.com"
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <AuthSuccess message={success} />

          <AuthError message={error} />

          <Button className="w-full" type="submit" disabled={isPending}>
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
