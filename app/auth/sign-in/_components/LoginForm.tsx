"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { login } from "@/actions/login";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BtnSpinner from "@/components/BtnSpinner";
import AuthError from "@/components/auth/AuthError";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthSuccess from "@/components/auth/AuthSuccess";
import CardWrapper from "@/components/auth/CardWrapper";
import { LoginValidator, LoginSchema } from "@/lib/validators/login";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const LoginForm = () => {
  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginValidator>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginValidator) => {
    setError("");

    setSuccess("");

    startTransition(() => {
      login(values)
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
      headerLabel="Welcome back"
      showSocial
      secondaryLabel="Don't have an account?"
      secondaryHref="/auth/sign-up"
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
                      placeholder="email@example.com"
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
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

                  <FormMessage />

                  <Button
                    className="px-0 font-normal"
                    asChild
                    size="sm"
                    variant="link"
                    disabled={isPending}
                  >
                    <Link href="/auth/reset-password">Forgot password?</Link>
                  </Button>
                </FormItem>
              )}
            />
          </div>

          <AuthSuccess message={success} />

          <AuthError message={error} />

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? <BtnSpinner /> : "Sign In"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
