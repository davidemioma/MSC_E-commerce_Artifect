"use client";

import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Category } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { CategoryValidator, CategorySchema } from "@/lib/validators/category";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  data?: Category;
};

const CategoryForm = ({ data }: Props) => {
  const params = useParams();

  const router = useRouter();

  const form = useForm<CategoryValidator>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: data?.name || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: data ? ["update-category"] : ["create-category"],
    mutationFn: async (values: CategoryValidator) => {
      if (data) {
        await axios.patch(
          `/api/stores/${params.storeId}/categories/${data.id}`,
          values
        );
      } else {
        await axios.post(
          `/api/stores/${params.storeId}/categories/new`,
          values
        );
      }
    },
    onSuccess: () => {
      toast.success(data ? "Category Updated!" : "Category Created!");

      router.push(`/dashboard/${params.storeId}/categories`);

      router.refresh();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const onSubmit = (values: CategoryValidator) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-sm"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>

              <FormControl>
                <Input {...field} disabled={isPending} placeholder="Shoes..." />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {data ? "Save" : "Create"}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
