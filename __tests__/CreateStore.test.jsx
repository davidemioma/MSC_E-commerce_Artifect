import React from "react";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import * as StoreModalHook from "../hooks/use-store-modal";
import { render, screen, fireEvent } from "@testing-library/react";
import StoreSwitcher from "@/app/(store)/dashboard/_components/StoreSwitcher";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock("../hooks/use-store-modal");

const customStores = [
  {
    id: "123",
    userId: "user123",
    name: "test123",
    email: "test123@mail.com",
    emailVerified: new Date(),
    country: "USA",
    postcode: "123456",
    logo: "logo",
    description: "description",
    status: "APPROVED",
    statusFeedback: "Approved",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("Create store form for sellers", () => {
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

  it("Check if store popover button exists", () => {
    render(<StoreSwitcher stores={customStores} />);

    const btnElement = screen.getByTestId("store-popover-btn");

    expect(btnElement).toBeInTheDocument();
  });

  it("Check if create store button exists", () => {
    render(<StoreSwitcher stores={customStores} />);

    const btnElement = screen.getByTestId("store-popover-btn");

    expect(btnElement).toBeInTheDocument();

    fireEvent.click(btnElement);

    const createBtnElement = screen.getByTestId("create-store-btn");

    expect(createBtnElement).toBeInTheDocument();
  });

  it("StoreModal should open on create store button clicked", async () => {
    render(<StoreSwitcher stores={customStores} />);

    const mockOnOpen = jest.fn();

    //@ts-ignore
    StoreModalHook.default.mockImplementation(() => ({ onOpen: mockOnOpen }));

    const btnElement = screen.getByTestId("store-popover-btn");

    expect(btnElement).toBeInTheDocument();

    fireEvent.click(btnElement);

    const createBtnElement = screen.getByTestId("create-store-btn");

    expect(createBtnElement).toBeInTheDocument();

    fireEvent.click(createBtnElement);

    expect(mockOnOpen).toHaveBeenCalled();
  });
});
