import {
  Category,
  Product,
  ProductItem,
  Available,
  Size,
  Color,
  Cart,
  CartItem,
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

export type CartItemType = CartItem & {
  product: Product | null;
  productItem: ProductItem | null;
  availableItem: AvailableType | null;
};

export type CartType = Cart & {
  cartItems: CartItemType[];
};
