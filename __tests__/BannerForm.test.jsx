import React from "react";
import { useParams } from "next/navigation";
import userEvent from "@testing-library/user-event";
import { useMutation } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BannerForm from "@/app/(store)/dashboard/[storeId]/banners/_components/BannerForm";
import BannerUpload from "@/app/(store)/dashboard/[storeId]/banners/_components/BannerUpload";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

describe("Add and update banner form for sellers", () => {
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

  it("Renders without crashing", () => {
    render(<BannerForm />);

    const formElement = screen.getByTestId("banner-form");

    expect(formElement).toBeInTheDocument();
  });

  it("Renders banner image upload without crashing", () => {
    render(<BannerUpload onChange={() => {}} />);

    const element = screen.getByTestId("banner-upload");

    expect(element).toBeInTheDocument();
  });

  it("initial banner name state is correct", () => {
    render(<BannerForm />);

    const inputElement = screen.getByPlaceholderText("Name...");

    expect(inputElement).toHaveValue("");
  });

  it("Name state should change", async () => {
    render(<BannerForm />);

    const inputElement = screen.getByPlaceholderText("Name...");

    await userEvent.type(inputElement, "My test banner");

    expect(inputElement).toHaveValue("My test banner");
  });

  it("Create or Save button should exists", () => {
    render(<BannerForm />);

    const btnElement = screen.getByText("Create") || screen.getByText("Save");

    expect(btnElement).toBeInTheDocument();
  });

  it("Validates required fields before submission", async () => {
    render(<BannerForm />);

    // Simulate form submission without filling out the fields
    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("Name is required.")).toBeInTheDocument();

      expect(screen.getByText("Image is required.")).toBeInTheDocument();
    });
  });
});
