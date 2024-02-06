"use client";

import React, { useState } from "react";
import axios from "axios";
import AddBtn from "./AddBtn";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BtnSpinner from "@/components/BtnSpinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import CategoryModal from "@/components/modal/CategoryModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProductValidator, ProductSchema } from "@/lib/validators/product";
import { Category, Product } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  data?: Product & {
    productItems: {
      sizeId: string;
      colorId: string;
      price: number;
      discount: number;
      numInStocks: number;
    }[];
  };
};

const ProductForm = ({ data }: Props) => {
  const params = useParams();

  const router = useRouter();

  const form = useForm<ProductValidator>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: data?.name || "",
      categoryId: data?.categoryId || "",
      description: data?.description || "",
      ProductItem: data?.productItems || [],
    },
  });

  const {
    data: categories,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["product-category"],
    queryFn: async () => {
      const res = await axios.get(`/api/stores/${params.storeId}/categories`);

      return res.data;
    },
  });

  const { mutate, isPending } = useMutation({});

  const onSubmit = (values: ProductValidator) => {};

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Name..."
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <span>Category</span>

                    <CategoryModal>
                      <AddBtn disabled={isPending} />
                    </CategoryModal>
                  </FormLabel>

                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Category" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {isLoading && (
                          <div className="py-4">
                            <BtnSpinner />
                          </div>
                        )}

                        {categories?.length === 0 && (
                          <div className="flex items-center justify-center py-4 text-sm">
                            No category found! Create a new category.
                          </div>
                        )}

                        {!isLoading && !error && categories && (
                          <>
                            {categories?.map((cat: Category) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
