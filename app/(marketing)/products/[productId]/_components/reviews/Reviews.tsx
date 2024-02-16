"use client";

import React from "react";
import { toast } from "sonner";
import { ReviewType } from "@/types";
import ReviewList from "./ReviewList";
import { UserRole } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FaStar, FaRegStar } from "react-icons/fa6";
import useCurrentUser from "@/hooks/use-current-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewValidator, ReviewSchema } from "@/lib/validators/review";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Container from "@/components/Container";

type Props = {
  productId: string;
  initialData: ReviewType[];
  reviewCount: number;
  hasReviewed: boolean;
};

const Reviews = ({
  productId,
  initialData,
  reviewCount,
  hasReviewed,
}: Props) => {
  const router = useRouter();

  const { user } = useCurrentUser();

  const queryClient = useQueryClient();

  const showForm = user && user.role === UserRole.USER && !hasReviewed;

  const form = useForm<ReviewValidator>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      value: 0,
      reason: "",
      comment: "",
    },
  });

  const { mutate: addReview, isPending } = useMutation({
    mutationKey: ["add-review"],
    mutationFn: async (values: ReviewValidator) => {
      await axios.post(`/api/products/${productId}/reviews`, values);
    },
    onSuccess: () => {
      toast.success("Review Added!");

      form.reset();

      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["get-limited-reviews", productId],
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const onSubmit = (values: ReviewValidator) => {
    addReview(values);
  };

  return (
    <div className="w-full bg-white py-14">
      <Container>
        <div className="space-y-5">
          <h1 className="text-2xl md:text-3xl font-bold">
            Reviews ({reviewCount})
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {showForm && (
              <div className="w-full space-y-4">
                <div className="space-y-0.5">
                  <h2 className="font-semibold">Write a Review</h2>

                  <p className="text-sm text-gray-500">
                    Share your thoughts about the product.
                  </p>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rating</FormLabel>

                            <FormControl>
                              <div className="flex items-center gap-1">
                                {new Array(5).fill("").map((_, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => field.onChange(index + 1)}
                                    onMouseEnter={() =>
                                      field.onChange(index + 1)
                                    }
                                  >
                                    {field.value >= index + 1 ? (
                                      <FaStar className="w-5 h-5 text-yellow-500" />
                                    ) : (
                                      <FaRegStar className="w-5 h-5 text-yellow-500" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason</FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Reason for rating..."
                                disabled={isPending}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comment</FormLabel>

                            <FormControl>
                              <Textarea
                                {...field}
                                rows={5}
                                placeholder="Tell us your experience..."
                                disabled={isPending}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" disabled={isPending}>
                      Submit
                    </Button>
                  </form>
                </Form>
              </div>
            )}

            {initialData.length > 0 && (
              <ReviewList
                productId={productId}
                initialData={initialData}
                reviewCount={reviewCount}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Reviews;
