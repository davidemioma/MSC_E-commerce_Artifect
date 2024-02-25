import {
  Category,
  Product,
  ProductItem,
  Available,
  Size,
  Color,
  Cart,
  CartItem,
  Review,
  Store,
  Order,
  OrderItem,
  OrderStatus,
} from "@prisma/client";

export type AvailableType = Available & { size: Size };

export type ProductItemType = ProductItem & {
  availableItems: AvailableType[];
};

export type ProductType = Product & {
  category: Category;
  productItems: ProductItemType[];
};

export type ProductDetailType = Product & {
  category: Category;
  store: {
    name: string;
    logo: string | null;
  };
  productItems: ProductItemType[];
  reviews: {
    value: number;
  }[];
};

export type HomeProductType = Product & {
  category: Category;
  productItems: ProductItemType[];
  reviews: {
    value: number;
  }[];
};

export type RouteType = {
  href: string;
  label: string;
  active: boolean;
};

export type CartItemType = CartItem & {
  product: (Product & { category: Category }) | null;
  productItem: ProductItem | null;
  availableItem: AvailableType | null;
};

export type CartType = Cart & {
  cartItems: CartItemType[];
};

export type ReviewType = Review & {
  user: {
    name: string | null;
    image: string | null;
  };
};

export type OrderItemCol = OrderItem & {
  product: {
    name: string;
  };
  productItem: {
    images: string[];
  };
  availableItem: {
    currentPrice: number;
    size: Size;
  };
};

export type OrderCol = Order & {
  orderItems: OrderItemCol[];
};

export type StoreOrderCol = OrderItem & {
  order: {
    status: OrderStatus;
  };
  product: {
    name: string;
  };
  productItem: {
    images: string[];
  };
  availableItem: {
    currentPrice: number;
    size: Size;
  };
};
