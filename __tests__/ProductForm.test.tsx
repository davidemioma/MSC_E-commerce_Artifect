import React from "react";
import { useParams } from "next/navigation";
import { ProductStatus } from "@prisma/client";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { useQuery, useMutation } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductForm from "@/app/(store)/dashboard/[storeId]/products/_components/ProductForm";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // You can add more logic here if you want to simulate more of the Image component's behavior
    return <img {...props} fill="true" />;
  },
}));

describe("Add and update product form for sellers", () => {
  beforeEach(() => {
    jest.clearAllMocks();

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
  });

  it("renders without crashing", () => {
    render(<ProductForm />);

    const formElement = screen.getByTestId("product-form");

    expect(formElement).toBeInTheDocument();
  });

  it("initial name state is correct", () => {
    render(<ProductForm />);

    const inputElement = screen.getByPlaceholderText("Name...");

    expect(inputElement).toHaveValue("");
  });

  it("Name state should change", async () => {
    render(<ProductForm />);

    const inputElement = screen.getByPlaceholderText("Name...");

    await userEvent.type(inputElement, "My test product");

    expect(inputElement).toHaveValue("My test product");
  });

  it("Category input exists", () => {
    render(<ProductForm />);

    const categoryElement = screen.getByText("Category");

    expect(categoryElement).toBeInTheDocument();
  });

  it("Description input exists", () => {
    render(<ProductForm />);

    const descElement = screen.getByText("Description");

    expect(descElement).toBeInTheDocument();
  });

  it("Open category form modal when clicked", async () => {
    render(<ProductForm />);

    const addBtnElement = screen.getByTestId("add-new-category");

    expect(addBtnElement).toBeInTheDocument();

    fireEvent.click(addBtnElement);

    waitFor(() => {
      expect(screen.getByTestId("category-form")).toBeInTheDocument();
    });
  });

  it("Create or Save button should exists", () => {
    render(<ProductForm />);

    const btnElement = screen.getByText("Create") || screen.getByText("Save");

    expect(btnElement).toBeInTheDocument();
  });

  it("Renders correctly for editing a product", () => {
    const productData = {
      id: "123",
      userId: "user123",
      storeId: "store123",
      name: "Test Product",
      categoryId: "testing",
      description: "Test Description",
      status: ProductStatus.APPROVED,
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
    };

    render(<ProductForm data={productData} />);

    const inputElement = screen.getByPlaceholderText("Name...");

    expect(inputElement).toHaveValue("Test Product");
  });

  it("Validates required fields before submission", async () => {
    render(<ProductForm />);

    // Simulate form submission without filling out the fields
    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("Name is required.")).toBeInTheDocument();
    });
  });

  it("Adds product items on button click", async () => {
    render(<ProductForm />);

    const addBtnElement = screen.getByTestId("add-product-item");

    expect(addBtnElement).toBeInTheDocument();

    fireEvent.click(addBtnElement);

    expect(screen.getByTestId("product-item-form")).toBeInTheDocument();
  });

  it("Removes product items on button click", async () => {
    render(<ProductForm />);

    const addBtnElement = screen.getByTestId("add-product-item");

    expect(addBtnElement).toBeInTheDocument();

    fireEvent.click(addBtnElement);

    expect(screen.getByTestId("product-item-form")).toBeInTheDocument();

    const removeBtnElement = screen.getByTestId("remove-product-item");

    expect(removeBtnElement).toBeInTheDocument();

    fireEvent.click(removeBtnElement);

    expect(removeBtnElement).not.toBeInTheDocument();
  });
});

it("Open color form modal when clicked", async () => {
  render(<ProductForm />);

  const addBtnElement = screen.getByTestId("add-product-item");

  expect(addBtnElement).toBeInTheDocument();

  fireEvent.click(addBtnElement);

  expect(screen.getByTestId("product-item-form")).toBeInTheDocument();

  const addColorElement = screen.getByTestId("add-color-btn");

  expect(addColorElement).toBeInTheDocument();

  fireEvent.click(addColorElement);

  waitFor(() => {
    expect(screen.getByTestId("color-form")).toBeInTheDocument();
  });
});
