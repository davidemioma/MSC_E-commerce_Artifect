import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus, ProductStatus, storeStatus } from "@prisma/client";

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

export const orderCategories = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "processing",
    label: "Processing",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "readyforshipping",
    label: "Ready For Shipping",
  },
  {
    value: "shipped",
    label: "Shipped",
  },
  {
    value: "outfordelivery",
    label: "Out For Delivery",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
  {
    value: "returned",
    label: "Returned",
  },
  {
    value: "refunded",
    label: "Refunded",
  },
  {
    value: "failed",
    label: "Failed",
  },
];

export const getOrderStatusValue = (status: string) => {
  let statusValue: OrderStatus;

  switch (status) {
    case "processing":
      statusValue = OrderStatus.PROCESSING;
      break;
    case "confirmed":
      statusValue = OrderStatus.CONFIRMED;
      break;
    case "readyforshipping":
      statusValue = OrderStatus.READYFORSHIPPING;
      break;
    case "shipped":
      statusValue = OrderStatus.SHIPPED;
      break;
    case "outfordelivery":
      statusValue = OrderStatus.OUTFORDELIVERY;
      break;
    case "delivered":
      statusValue = OrderStatus.DELIVERED;
      break;
    case "cancelled":
      statusValue = OrderStatus.CANCELLED;
      break;
    case "returned":
      statusValue = OrderStatus.RETURNED;
      break;
    case "refunded":
      statusValue = OrderStatus.REFUNDED;
      break;
    case "failed":
      statusValue = OrderStatus.FAILED;
      break;
    default:
      statusValue = OrderStatus.PROCESSING;
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

export const canCancel = (status: OrderStatus) => {
  let cancel = false;

  switch (status) {
    case "PROCESSING":
      cancel = true;
      break;
    case "CONFIRMED":
      cancel = true;
      break;
    case "CANCELLED":
      cancel = false;
      break;
    case "READYFORSHIPPING":
      cancel = false;
      break;
    case "SHIPPED":
      cancel = false;
      break;
    case "OUTFORDELIVERY":
      cancel = false;
      break;
    case "DELIVERED":
      cancel = false;
      break;
    case "FAILED":
      cancel = false;
      break;
    case "RETURNREQUESTED":
      cancel = false;
      break;
    case "RETURNING":
      cancel = false;
      break;
    case "REFUNDED":
      cancel = false;
      break;
    case "RETURNED":
      cancel = false;
      break;
    default:
      cancel = false;
      break;
  }

  return cancel;
};
