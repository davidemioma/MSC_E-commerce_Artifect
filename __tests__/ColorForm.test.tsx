import React from "react";
import { useParams } from "next/navigation";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { useMutation } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ColorForm from "@/app/(store)/dashboard/[storeId]/colors/_components/ColorForm";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

describe("Add and update color form for sellers", () => {
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
    render(<ColorForm />);

    const formElement = screen.getByTestId("color-form");

    expect(formElement).toBeInTheDocument();
  });

  it("initial size name state is correct", () => {
    render(<ColorForm />);

    const inputElement = screen.getByPlaceholderText("Black");

    expect(inputElement).toHaveValue("");
  });

  it("Name state should change", async () => {
    render(<ColorForm />);

    const inputElement = screen.getByPlaceholderText("Black");

    await userEvent.type(inputElement, "My test color");

    expect(inputElement).toHaveValue("My test color");
  });

  it("Create or Save button should exists", () => {
    render(<ColorForm />);

    const btnElement = screen.getByText("Create") || screen.getByText("Save");

    expect(btnElement).toBeInTheDocument();
  });

  it("Validates required fields before submission", async () => {
    render(<ColorForm />);

    // Simulate form submission without filling out the fields
    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("Name is required.")).toBeInTheDocument();

      expect(screen.getByText("Value is required.")).toBeInTheDocument();
    });
  });

  it("Renders correctly for editing a color", () => {
    const colorData = {
      id: "123",
      storeId: "storeId",
      name: "Black",
      value: "#000000",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<ColorForm data={colorData} />);

    const nameInputElement = screen.getByPlaceholderText("Black");

    expect(nameInputElement).toHaveValue("Black");
  });

  it("Delete button should exist if updating", () => {
    const colorData = {
      id: "123",
      storeId: "storeId",
      name: "Black",
      value: "#000000",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<ColorForm data={colorData} />);

    const btnElement = screen.getByText("Delete");

    expect(btnElement).toBeInTheDocument();
  });
});
