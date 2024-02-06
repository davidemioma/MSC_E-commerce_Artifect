import { storeStatus } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const storeCategories = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "reviewing",
    label: "Reviewing",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "declined",
    label: "Declined",
  },
  {
    value: "closed",
    label: "Closed",
  },
];

export const getStoreStatusValue = (status: string) => {
  let statusValue: storeStatus;

  switch (status) {
    case "pending":
      statusValue = "PENDING";
      break;
    case "reviewing":
      statusValue = "REVIEWING";
      break;
    case "approved":
      statusValue = "APPROVED";
      break;
    case "declined":
      statusValue = "DECLINED";
      break;
    case "closed":
      statusValue = "CLOSED";
      break;
    default:
      statusValue = "PENDING";
      break;
  }

  return statusValue;
};

export const getStatusColor = (status: storeStatus) => {
  let color;

  switch (status) {
    case "PENDING":
      color = "text-gray-500";
      break;
    case "REVIEWING":
      color = "text-orange-500";
      break;
    case "APPROVED":
      color = "text-green-500";
      break;
    case "DECLINED":
      color = "text-red-500";
      break;
    case "CLOSED":
      color = "text-gray-600";
      break;
    default:
      color = "text-black";
      break;
  }

  return color;
};
