"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { settings } from "@/actions/settings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/ImageUpload";
import AuthError from "@/components/auth/AuthError";
import { signOut, useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import useCurrentUser from "@/hooks/use-current-user";
import useCurrentRole from "@/hooks/use-current-role";
import AuthSuccess from "@/components/auth/AuthSuccess";
import { SettingsValidator, SettingsSchema } from "@/lib/validators/settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function SettingsPage() {
  const { update } = useSession();

  const { user } = useCurrentUser();

  const { role } = useCurrentRole();

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isPending, startTransition] = useTransition();

  //Use undifined so if you submit it does not change in prisma or your database.
  const form = useForm<SettingsValidator>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      image: user?.image || undefined,
      name: user?.name || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
      password: undefined,
      newPassword: undefined,
    },
  });

  const onSubmit = (values: SettingsValidator) => {
    setError("");

    setSuccess("");

    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            //Client side next auth update.
            update();

            setSuccess(data.success);
          }
        })
        .catch((err) => {
          setError("Something went wrong");
        });
    });
  };

  return (
    <Card className="w-full max-w-[600px] mx-auto">
      <CardHeader>
        <CardTitle>⚙️ Settings</CardTitle>

        <CardDescription>Customise your Account.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {user?.isOAuth === false && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            placeholder="******"
                            type="password"
                            disabled={isPending}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            placeholder="******"
                            type="password"
                            disabled={isPending}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {user?.isOAuth === false && (
                <FormField
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-3 rounded-lg border shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Two Factor Authentication</FormLabel>

                        <FormDescription>
                          Enable two factor authentication for your account
                        </FormDescription>
                      </div>

                      <FormControl>
                        <Switch
                          disabled={isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <AuthSuccess message={success} />

            <AuthError message={error} />

            <Button disabled={isPending} type="submit">
              Save
            </Button>
          </form>
        </Form>

        <Separator className="mt-5" />
      </CardContent>

      <CardFooter>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" disabled={isPending}>
            <Link href={"/store"}>
              {role === "USER" ? "Become a seller" : "Go to store"}
            </Link>
          </Button>

          <Button onClick={() => signOut()} disabled={isPending}>
            Sign Out
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
