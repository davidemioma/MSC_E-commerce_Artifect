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
