"use client";

import React, { useState, useTransition } from "react";
import Modal from "./Modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import BtnSpinner from "../BtnSpinner";
import AuthError from "../auth/AuthError";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import AuthSuccess from "../auth/AuthSuccess";
import useCountries from "@/hooks/use-countries";
import useStoreModal from "@/hooks/use-store-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStore } from "@/actions/createStore";
import { StoreValidator, StoreSchema } from "@/lib/validators/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";

const StoreModal = () => {
  const router = useRouter();

  const { getAll } = useCountries();

  const countries = getAll();

  const storeModal = useStoreModal();

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isPending, startTransition] = useTransition();

  const [showVerifyEmail, setShowVerifyEmail] = useState(false);

  const form = useForm<StoreValidator>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "",
      postcode: "",
    },
  });

  const onSubmit = (values: StoreValidator) => {
    setError("");

    setSuccess("");

    startTransition(() => {
      createStore(values)
        .then((data) => {
          if (data?.error) {
            form.reset();

            setError(data.error);
          }

          if (data?.success) {
            form.reset();

            setSuccess(data.success);

            router.refresh();
          }

          if (data?.verificationCode) {
            setShowVerifyEmail(true);
          }
        })
        .catch((err) => {
          setError("Something went wrong");
        });
    });
  };

  return (
    <Modal
      title="Create your Store"
      description="Add a new store to create and manage products"
      isOpen={storeModal.isOpen}
      onClose={() => storeModal.onClose()}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showVerifyEmail ? (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Verification Code</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Store Name"
                          disabled={isPending}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>

                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          placeholder="user@mail.com"
                          disabled={isPending}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Anywhere" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.value}
                              value={country.value}
                            >
                              {country.flag} {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          placeholder="123456"
                          disabled={isPending}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <AuthSuccess message={success} />

          <AuthError message={error} />

          <div className="w-full flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => storeModal.onClose()}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <BtnSpinner />
              ) : showVerifyEmail ? (
                "Confirm"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default StoreModal;
