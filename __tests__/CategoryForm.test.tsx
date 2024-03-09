import React from "react";
import { useParams } from "next/navigation";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { useMutation } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CategoryForm from "@/app/(store)/dashboard/[storeId]/categories/_components/CategoryForm";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

describe("Add and update category form for sellers", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    //@ts-ignore
    useParams.mockImplementation(() => ({
      params: { storeId: "mockStoreId" },
    }));

    //@ts-ignore
    useMutation.mockReturnValue({
      mutate: () => {},
      isPending: false,
    });
  });

  it("renders without crashing", () => {
    render(<CategoryForm />);

    const formElement = screen.getByTestId("category-form");

    expect(formElement).toBeInTheDocument();
  });

  it("initial category name state is correct", () => {
    render(<CategoryForm />);

    const inputElement = screen.getByPlaceholderText("Shoes...");

    expect(inputElement).toHaveValue("");
  });

  it("Name state should change", async () => {
    render(<CategoryForm />);

    const inputElement = screen.getByPlaceholderText("Shoes...");

    await userEvent.type(inputElement, "My test category");

    expect(inputElement).toHaveValue("My test category");
  });

  it("Create or Save button should exists", () => {
    render(<CategoryForm />);

    const btnElement = screen.getByText("Create") || screen.getByText("Save");

    expect(btnElement).toBeInTheDocument();
  });

  it("Validates required fields before submission", async () => {
    render(<CategoryForm />);

    // Simulate form submission without filling out the fields
    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("Name is required.")).toBeInTheDocument();
    });
  });

  it("Renders correctly for editing a category", () => {
    const categoryData = {
      id: "123",
      storeId: "storeId",
      name: "Shoe",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<CategoryForm data={categoryData} />);

    const inputElement = screen.getByPlaceholderText("Shoes...");

    expect(inputElement).toHaveValue("Shoe");
  });

  it("Delete button should exist if updating", () => {
    const categoryData = {
      id: "123",
      storeId: "storeId",
      name: "Shoe",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<CategoryForm data={categoryData} />);

    const btnElement = screen.getByText("Delete");

    expect(btnElement).toBeInTheDocument();
  });
});
