import React from "react";
import { useParams } from "next/navigation";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { useMutation } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SizeForm from "@/app/(store)/dashboard/[storeId]/sizes/_components/SizeForm";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

describe("Add and update size form for sellers", () => {
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
    render(<SizeForm />);

    const formElement = screen.getByTestId("size-form");

    expect(formElement).toBeInTheDocument();
  });

  it("initial size name state is correct", () => {
    render(<SizeForm />);

    const inputElement = screen.getByPlaceholderText("Large");

    expect(inputElement).toHaveValue("");
  });

  it("Name state should change", async () => {
    render(<SizeForm />);

    const inputElement = screen.getByPlaceholderText("Large");

    await userEvent.type(inputElement, "My test size");

    expect(inputElement).toHaveValue("My test size");
  });

  it("initial size value state is correct", () => {
    render(<SizeForm />);

    const inputElement = screen.getByPlaceholderText("lg");

    expect(inputElement).toHaveValue("");
  });

  it("Value state should change", async () => {
    render(<SizeForm />);

    const inputElement = screen.getByPlaceholderText("lg");

    await userEvent.type(inputElement, "My test size value");

    expect(inputElement).toHaveValue("My test size value");
  });

  it("Create or Save button should exists", () => {
    render(<SizeForm />);

    const btnElement = screen.getByText("Create") || screen.getByText("Save");

    expect(btnElement).toBeInTheDocument();
  });

  it("Validates required fields before submission", async () => {
    render(<SizeForm />);

    // Simulate form submission without filling out the fields
    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("Name is required.")).toBeInTheDocument();

      expect(screen.getByText("Value is required.")).toBeInTheDocument();
    });
  });

  it("Renders correctly for editing a size", () => {
    const categoryData = {
      id: "123",
      storeId: "storeId",
      name: "Large",
      value: "lg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<SizeForm data={categoryData} />);

    const nameInputElement = screen.getByPlaceholderText("Large");

    const valueInputElement = screen.getByPlaceholderText("lg");

    expect(nameInputElement).toHaveValue("Large");

    expect(valueInputElement).toHaveValue("lg");
  });

  it("Delete button should exist if updating", () => {
    const categoryData = {
      id: "123",
      storeId: "storeId",
      name: "Large",
      value: "lg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<SizeForm data={categoryData} />);

    const btnElement = screen.getByText("Delete");

    expect(btnElement).toBeInTheDocument();
  });
});
