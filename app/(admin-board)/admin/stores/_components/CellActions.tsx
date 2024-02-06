"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit } from "lucide-react";
import { Store, storeStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { StatusValidator, StatusSchema } from "@/lib/validators/status";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  data: Store;
};

const CellActions = ({ data }: Props) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const form = useForm<StatusValidator>({
    resolver: zodResolver(StatusSchema),
    defaultValues: {
      status: data.status,
      statusFeedback: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-status"],
    mutationFn: async (values: StatusValidator) => {
      await axios.patch(`/api/admin/stores/${data.id}`, values);
    },
    onSuccess: () => {
      toast.success("Status Updated!");

      router.refresh();

      setOpen(false);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const onSubmit = (values: StatusValidator) => {
    mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>

          <MoreVertical className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="py-10">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="w-4 h-4 mr-2" />
            Update Status
          </DialogTitle>

          <DialogDescription>
            Update current status of stores.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value={storeStatus.PENDING}>
                          Pending
                        </SelectItem>

                        <SelectItem value={storeStatus.REVIEWING}>
                          Reviewing
                        </SelectItem>

                        <SelectItem value={storeStatus.APPROVED}>
                          Approved
                        </SelectItem>

                        <SelectItem value={storeStatus.DECLINED}>
                          Declined
                        </SelectItem>

                        <SelectItem value={storeStatus.CLOSED}>
                          Closed
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="statusFeedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Feedback</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Write something..."
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex items-center gap-3 justify-end">
              <Button onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>

              <Button type="submit" variant="outline" disabled={isPending}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CellActions;
