import {
  Category,
  Product,
  ProductItem,
  Available,
  Size,
  Color,
} from "@prisma/client";

export type AvailableType = Available & { size: Size };

export type ProductItemType = ProductItem & {
  color: Color | null;
  availableItems: AvailableType[];
};

export type ProductType = Product & {
  category: Category;
  productItems: ProductItemType[];
};

export type RouteType = {
  href: string;
  label: string;
  active: boolean;
};
