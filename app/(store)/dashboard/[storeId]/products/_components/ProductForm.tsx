"use client";

import React, { useState } from "react";
import AddBtn from "./AddBtn";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import AvailableForm from "./AvailableForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TextEditor from "@/components/TextEditor";
import BtnSpinner from "@/components/BtnSpinner";
import ImageUpload from "@/components/ImageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import ColorModal from "@/components/modal/ColorModal";
import AlertModal from "@/components/modal/AlertModal";
import CategoryModal from "@/components/modal/CategoryModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { ProductValidator, ProductSchema } from "@/lib/validators/product";
import {
  Available,
  Category,
  Color,
  Product,
  ProductItem,
  Size,
} from "@prisma/client";
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

type ProductItemType = ProductItem & {
  availableItems: Available[];
};

type Props = {
  data?: Product & {
    productItems: ProductItemType[];
  };
};

const ProductForm = ({ data }: Props) => {
  const params = useParams();

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const formattedProductItems = data?.productItems.map((item) => ({
    id: item.id,
    colorId: item.colorId || undefined,
    price: item.originalPrice,
    discount: item.discount,
    availableItems: item.availableItems || [],
    images: item.images || [],
  }));

  const form = useForm<ProductValidator>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: data?.name || "",
      categoryId: data?.categoryId || "",
      description: data?.description || "",
      productItems: formattedProductItems || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "productItems",
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

  const { data: sizes } = useQuery({
    queryKey: ["product-sizes"],
    queryFn: async () => {
      const res = await axios.get(`/api/stores/${params.storeId}/sizes`);

      return res.data as Size[];
    },
  });

  const {
    data: colors,
    error: colorsError,
    isLoading: colorsLoading,
  } = useQuery({
    queryKey: ["product-colors"],
    queryFn: async () => {
      const res = await axios.get(`/api/stores/${params.storeId}/colors`);

      return res.data;
    },
  });

  const { mutate: deleteItem, isPending: deletingItem } = useMutation({
    mutationKey: ["delete-product-item"],
    mutationFn: async (id: string) => {
      if (!id || data?.id) return;

      await axios.delete(
        `/api/stores/${params.storeId}/products/${data?.id}/items/${id}`
      );
    },
    onSuccess: () => {
      toast.success("Item deleted successfully");

      window.location.reload();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const { mutate: onDeleteProduct, isPending: deletingProduct } = useMutation({
    mutationKey: ["delete-product"],
    mutationFn: async () => {
      await axios.delete(`/api/stores/${params.storeId}/products/${data?.id}`);
    },
    onSuccess: () => {
      toast.success("Product Deleted!");

      router.refresh();

      router.push(`/dashboard/${params.storeId}/products`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: data ? ["update-product"] : ["create-product"],
    mutationFn: async (values: ProductValidator) => {
      if (data) {
        await axios.patch(
          `/api/stores/${params.storeId}/products/${data.id}`,
          values
        );
      } else {
        await axios.post(`/api/stores/${params.storeId}/products/new`, values);
      }
    },
    onSuccess: () => {
      toast.success(data ? "Product Updated!" : "Product Created!");

      router.push(`/dashboard/${params.storeId}/products`);

      router.refresh();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      } else {
        toast.error("Something went wrong");
      }

      console.log(err);
    },
  });

  const onSubmit = (values: ProductValidator) => {
    mutate(values);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDeleteProduct}
        loading={deletingProduct}
        featureToDelete="product"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
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
                        disabled={isPending || deletingItem}
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
                        <AddBtn disabled={isPending || deletingItem} />
                      </CategoryModal>
                    </FormLabel>

                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending || deletingItem}
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <TextEditor
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending || deletingItem}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-2 pt-16 lg:pt-10">
            <h4 className="text-xl font-bold">Add Product Details</h4>

            <AddBtn
              onClick={() =>
                append({
                  id: "",
                  images: [],
                  colorId: "",
                  price: 0,
                  discount: 0,
                  availableItems: [],
                })
              }
              disabled={isPending || deletingItem}
            />
          </div>

          <div className="space-y-6">
            {fields.map((item, index) => (
              <div key={item.id} className="space-y-4">
                <Controller
                  name={`productItems.${index}.images`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>

                      <FormControl>
                        <ImageUpload
                          forProduct
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isPending || deletingItem}
                          storeId={params.storeId as string}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AvailableForm
                  form={form}
                  index={index}
                  sizes={sizes || []}
                  productId={data?.id || undefined}
                  disabled={isPending || deletingItem}
                  availableItems={
                    data?.productItems?.[index]?.availableItems || []
                  }
                />

                <div className="w-full grid items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Controller
                    name={`productItems.${index}.colorId`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <span>Color</span>

                          <ColorModal>
                            <AddBtn disabled={isPending || deletingItem} />
                          </ColorModal>
                        </FormLabel>

                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isPending || deletingItem}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose Color" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {colorsLoading && (
                                <div className="py-4">
                                  <BtnSpinner />
                                </div>
                              )}

                              {colors?.length === 0 && (
                                <div className="flex items-center justify-center py-4 text-sm">
                                  No color found! Create a new color.
                                </div>
                              )}

                              {!colorsLoading && !colorsError && colors && (
                                <>
                                  {colors?.map((color: Color) => (
                                    <SelectItem key={color.id} value={color.id}>
                                      {color.name}
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

                  <Controller
                    name={`productItems.${index}.price`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (£)</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min={0}
                            disabled={isPending || deletingItem}
                            placeholder="Price"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Controller
                    name={`productItems.${index}.discount`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount (%)</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min={0}
                            disabled={isPending || deletingItem}
                            placeholder="Discount"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-end">
                  {data?.productItems[index] ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => deleteItem(data.productItems[index].id)}
                      disabled={isPending || deletingItem}
                    >
                      Delete Item
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => remove(index)}
                      disabled={isPending || deletingItem}
                    >
                      Remove Item
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="disabled:cursor-not-allowed disabled:opacity-75"
              type="submit"
              disabled={isPending || deletingItem}
            >
              {data ? "Save" : "Create"}
            </Button>

            {data && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setOpen(true)}
                disabled={isPending || deletingItem}
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
