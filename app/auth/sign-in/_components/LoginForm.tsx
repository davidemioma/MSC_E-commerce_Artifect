"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
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

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterValidator>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: RegisterValidator) => {};

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

          <Button className="w-full" type="submit" disabled={isPending}>
            Sign In
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
