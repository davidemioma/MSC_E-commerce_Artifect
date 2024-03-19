import React from "react";
import { useParams, useRouter } from "next/navigation";
import { render, screen } from "@testing-library/react";
import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import ProductContent from "@/app/(marketing)/products/[productId]/_components/ProductContent";
import ReviewList from "@/app/(marketing)/products/[productId]/_components/reviews/ReviewList";

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
  default: (props) => {
    // You can add more logic here if you want to simulate more of the Image component's behavior
    return <img {...props} fill="true" alt="mock-image" />;
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

describe("Product details page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

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

  it("Renders product details", () => {
    render(<ProductContent product={product} />);

    expect(screen.getByTestId("product-content")).toBeInTheDocument();

    expect(screen.getByText("Test Product")).toBeInTheDocument();

    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("shows discounted price and original price when discount is available", async () => {
    render(<ProductContent product={product} />);

    expect(screen.getByText("£60.00")).toBeInTheDocument();

    expect(screen.getByText("£45.00")).toBeInTheDocument();
  });

  it("renders existing reviews with user information, rating, and comment", async () => {
    render(
      <ReviewList
        productId="test-id"
        initialData={initialReviews}
        reviewCount={1}
      />
    );

    expect(screen.getByText("Test User")).toBeInTheDocument();

    expect(screen.getByText("Great product!")).toBeInTheDocument();

    expect(
      screen.getByText("This is a test review comment.")
    ).toBeInTheDocument();
  });
});
