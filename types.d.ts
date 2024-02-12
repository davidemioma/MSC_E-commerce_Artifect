import { Category, Product, ProductItem } from "@prisma/client";

export type ProductType = Product & {
  category: Category;
  productItems: ProductItem[];
};

type RouteType = {
  href: string;
  label: string;
  active: boolean;
};
