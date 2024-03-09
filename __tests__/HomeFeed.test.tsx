import React from "react";
import { HomeProductType } from "@/types";
import "@testing-library/jest-dom/extend-expect";
import Feed from "@/app/(marketing)/_components/Feed";
import { useParams, usePathname, useRouter } from "next/navigation";
import useUnlimitedScrolling from "../hooks/use-unlimited-scrolling";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("../hooks/use-unlimited-scrolling", () => jest.fn());

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // You can add more logic here if you want to simulate more of the Image component's behavior
    return <img {...props} fill="true" />;
  },
}));

const initialData = [
  {
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
    productItems: [
      {
        id: "456",
        productId: "test",
        colorIds: ["color"],
        images: ["test"],
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
  },
];

describe("Home feed page", () => {
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
    usePathname.mockImplementation(() => "/products/123");

    //@ts-ignore
    useUnlimitedScrolling.mockImplementation(() => ({
      ref: jest.fn(),
      entry: { isIntersecting: false },
      data: { pages: [initialData] },
      error: null,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
    }));
  });

  it("Renders initial data without crashing", () => {
    render(<Feed initialData={initialData as HomeProductType[]} />);

    const feedElement = screen.getByTestId("product-feed");

    expect(feedElement).toBeInTheDocument();
  });

  it("Renders initial data", () => {
    render(<Feed initialData={initialData as HomeProductType[]} />);

    const feedElement = screen.getByTestId("product-feed");

    expect(feedElement).toBeInTheDocument();

    expect(screen.getAllByRole("article").length).toBe(initialData.length);
  });

  it("Expect Test Product to be on screen", () => {
    render(<Feed initialData={initialData as HomeProductType[]} />);

    const element = screen.getByText("Test Product");

    expect(element).toBeInTheDocument();
  });

  it("fetches next page when scrolled to bottom", async () => {
    const fetchNextPage = jest.fn();

    //@ts-ignore
    useUnlimitedScrolling.mockImplementationOnce(() => ({
      //@ts-ignore
      ...useUnlimitedScrolling(),
      entry: { isIntersecting: true },
      fetchNextPage,
    }));

    render(<Feed initialData={initialData as HomeProductType[]} />);

    await waitFor(() => {
      expect(fetchNextPage).toHaveBeenCalledTimes(1);
    });
  });

  it("displays an error message when there is an error", () => {
    //@ts-ignore
    useUnlimitedScrolling.mockImplementationOnce(() => ({
      //@ts-ignore
      ...useUnlimitedScrolling(),
      error: "Error fetching data",
    }));

    render(<Feed initialData={initialData as HomeProductType[]} />);

    expect(
      screen.getByText("Could not get products! Try refreshing the page.")
    ).toBeInTheDocument();
  });

  it("Change route when product is clicked", async () => {
    render(<Feed initialData={initialData as HomeProductType[]} />);

    const feedElement = screen.getByTestId("product-item");

    expect(feedElement).toBeInTheDocument();

    fireEvent.click(feedElement);

    await waitFor(() => {
      expect(usePathname()).toEqual("/products/123");
    });
  });
});
