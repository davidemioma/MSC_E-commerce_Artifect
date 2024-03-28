"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { register } from "@/actions/register";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BtnSpinner from "@/components/BtnSpinner";
import AuthError from "@/components/auth/AuthError";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthSuccess from "@/components/auth/AuthSuccess";
import CardWrapper from "@/components/auth/CardWrapper";
import { RegisterSchema, RegisterValidator } from "@/lib/validators/register";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const RegisterForm = () => {
  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [honeyPot, setHoneyPot] = useState("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterValidator>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: RegisterValidator) => {
    if (honeyPot) return;

    setError("");

    setSuccess("");

    startTransition(() => {
      register(values)
        .then((data) => {
          if (data?.error) {
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
      headerLabel="Create an account"
      showSocial
      secondaryLabel="Already have an account?"
      secondaryHref="/auth/sign-in"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="David..."
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage data-cy="error-name" />
                </FormItem>
              )}
            />

            <div className="hidden">
              <input
                type="text"
                value={honeyPot}
                onChange={(e) => setHoneyPot(e.target.value)}
              />
            </div>

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
                      placeholder="email@example.com"
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage data-cy="error-email" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="******"
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage data-cy="error-password" />
                </FormItem>
              )}
            />
          </div>

          <AuthError message={error} data-cy="register-auth-msg" />

          <AuthSuccess message={success} data-cy="register-auth-msg" />

          <Button
            className="w-full"
            data-cy="create-acc-btn"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <BtnSpinner className="border-white" />
            ) : (
              "Create an account"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
