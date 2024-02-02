"use client";

import React from "react";
import Modal from "./Modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import useCountries from "@/hooks/use-countries";
import useStoreModal from "@/hooks/use-store-modal";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const storeModal = useStoreModal();

  const { getAll } = useCountries();

  const countries = getAll();

  const form = useForm<StoreValidator>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      country: "",
      postcode: "",
    },
  });

  const onSubmit = (values: StoreValidator) => {};

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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input {...field} placeholder="Store Name" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>

                  <FormControl>
                    <Input {...field} placeholder="+441234567890" />
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
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Anywhere" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
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
                    <Input {...field} placeholder="123456" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => storeModal.onClose()}>
              Cancel
            </Button>

            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default StoreModal;
