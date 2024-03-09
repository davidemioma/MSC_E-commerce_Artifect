import React from "react";
import { mocked } from "jest-mock";
import { ProductDetailType } from "@/types";
import { useSession } from "next-auth/react";
import "@testing-library/jest-dom/extend-expect";
import { useParams, useRouter } from "next/navigation";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import Reviews from "@/app/(marketing)/products/[productId]/_components/reviews/Reviews";
import ProductContent from "@/app/(marketing)/products/[productId]/_components/ProductContent";

jest.mock("next-auth/react");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
  useInfiniteQuery: jest.fn(),
}));

jest.mock("../hooks/use-unlimited-scrolling", () => jest.fn());

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} fill="true" />;
  },
}));

const product = {
  id: "123",
  userId: "user123",
  storeId: "store123",
  name: "Test Product",
  categoryId: "testing",
  description: "Test Description",
  status: "APPROVED",
  statusFeedback: "testing",
  createdAt: new Date(),
  updatedAt: new Date(),
  category: {
    name: "category",
  },
  productItems: [
    {
      id: "456",
      productId: "test",
      colorIds: ["color"],
      images: ["image1.jpg", "image2.jpg"],
      discount: 5,
      availableItems: [
        {
          id: "789",
          productId: "test",
          productItemId: "test",
          numInStocks: 2,
          sizeId: "size",
          currentPrice: 45,
          originalPrice: 60,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

const initialReviews = [
  {
    id: "123",
    userId: "456",
    storeId: "storeId",
    productId: "productId",
    user: { name: "Test User", image: "test-image.jpg" },
    value: 4,
    reason: "Great product!",
    comment: "This is a test review comment.",
    helpful: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("Reviews and cart features for product (online users)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    //@ts-ignore
    mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: "123",
          name: "John Doe",
          email: "john.doe@example.com",
          role: "USER",
          isTwoFactorEnabled: false,
          isOAuth: false,
        },
        expires: "1",
      },
      status: "authenticated",
    });

    //@ts-ignore
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    //@ts-ignore
    useParams.mockImplementation(() => ({
      params: { storeId: "mockStoreId" },
    }));

    //@ts-ignore
    useQuery.mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
    });

    //@ts-ignore
    useMutation.mockReturnValue({
      mutate: () => {},
      isPending: false,
    });

    //@ts-ignore
    useInfiniteQuery.mockImplementation(() => ({
      data: initialReviews,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
    }));
  });

  it('shows "Add to Cart" button when user logged in', async () => {
    render(<ProductContent product={product as ProductDetailType} />);

    expect(
      screen.queryByRole("button", { name: /Add To Cart/i })
    ).toBeInTheDocument();
  });

  it("Shows review form when user is logged in", async () => {
    render(
      <Reviews
        productId="test-id"
        initialData={[]}
        reviewCount={0}
        hasReviewed={true}
      />
    );

    expect(
      screen.queryByRole("form", { name: /Write a Review/i })
    ).not.toBeInTheDocument();
  });
});

describe("Reviews and cart features for product (offline users)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    //@ts-ignore
    mocked(useSession).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    //@ts-ignore
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    //@ts-ignore
    useParams.mockImplementation(() => ({
      params: { storeId: "mockStoreId" },
    }));

    //@ts-ignore
    useQuery.mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
    });

    //@ts-ignore
    useMutation.mockReturnValue({
      mutate: () => {},
      isPending: false,
    });

    //@ts-ignore
    useInfiniteQuery.mockImplementation(() => ({
      data: initialReviews,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
    }));
  });

  it('hides "Add to Cart" button when user is not logged in or not a user', async () => {
    render(<ProductContent product={product as ProductDetailType} />);

    expect(
      screen.queryByRole("button", { name: /Add To Cart/i })
    ).not.toBeInTheDocument();
  });

  it("hides review form when user is not logged in, not a user, or has already reviewed", async () => {
    render(
      <Reviews
        productId="test-id"
        initialData={[]}
        reviewCount={0}
        hasReviewed={true}
      />
    );

    expect(
      screen.queryByRole("form", { name: /Write a Review/i })
    ).not.toBeInTheDocument();
  });
});
