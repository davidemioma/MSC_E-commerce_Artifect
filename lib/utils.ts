import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProductStatus, storeStatus } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) => {
  const { currency = "USD", notation = "compact" } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

export const getCurrentPrice = ({
  price,
  discount,
}: {
  price: number;
  discount: number;
}) => {
  const discountRate = discount / 100;

  const discountAmount = discountRate * price;

  const currentPrice = price - discountAmount;

  return currentPrice;
};

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

export const productCategories = [
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
    value: "archived",
    label: "Archived",
  },
];

export const getProductStatusValue = (status: string) => {
  let statusValue: ProductStatus;

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
    case "archived":
      statusValue = "ARCHIVED";
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

export const getProductColor = (status: ProductStatus) => {
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
    case "ARCHIVED":
      color = "text-gray-600";
      break;
    default:
      color = "text-black";
      break;
  }

  return color;
};
