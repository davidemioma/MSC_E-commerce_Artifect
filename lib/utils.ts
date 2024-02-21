import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProductStatus, QueryStatus, storeStatus } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TRANSACTION_FEE = 1;

export const SHIPPING_FEE = 0;

export const INFINITE_SCROLL_PAGINATION_RESULTS = 20;

export const INFINITE_SCROLL_REVIEWS_RESULT = 2;

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

export const queryCategories = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "user",
    label: "User",
  },
  {
    value: "seller",
    label: "Seller",
  },
  {
    value: "new",
    label: "New",
  },
  {
    value: "awaitingresponse",
    label: "Awaiting Response",
  },
  {
    value: "processing",
    label: "Processing",
  },
  {
    value: "resolved",
    label: "Resolved",
  },
  {
    value: "notresolved",
    label: "Not Resolved",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
  {
    value: "closed",
    label: "Closed",
  },
  {
    value: "refundissued",
    label: "Refund Issued",
  },
  {
    value: "returninitiated",
    label: "Return Initiated",
  },
];

export const getQueryStatusValue = (status: string) => {
  let statusValue: QueryStatus;

  switch (status) {
    case "new":
      statusValue = QueryStatus.NEW;
      break;
    case "awaitingresponse":
      statusValue = QueryStatus.AWAITINGRESPONSE;
      break;
    case "processing":
      statusValue = QueryStatus.PROCESSING;
      break;
    case "resolved":
      statusValue = QueryStatus.RESOLVED;
      break;
    case "notresolved":
      statusValue = QueryStatus.NOTRESOLVED;
      break;
    case "cancelled":
      statusValue = QueryStatus.CANCELLED;
      break;
    case "closed":
      statusValue = QueryStatus.CLOSED;
      break;
    case "refundissued":
      statusValue = QueryStatus.REFUNDISSUED;
      break;
    case "returninitiated":
      statusValue = QueryStatus.RETURNINITIAED;
      break;
    default:
      statusValue = QueryStatus.NEW;
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
