import React from "react";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/react";
import { render, screen, waitFor } from "@testing-library/react";
import Options from "../app/(store)/dashboard/[storeId]/settings/_components/Options";
import SettingsForm from "../app/(store)/dashboard/[storeId]/settings/_components/SettingsForm";

jest.mock("next-auth/react");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    isPending: true,
  }),
}));

describe("Checking store settings", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: "123",
          name: "John Doe",
          email: "john.doe@example.com",
          emailVerified: new Date(),
          role: "SELLER",
          isTwoFactorEnabled: false,
          isOAuth: false,
        },
        expires: "1",
      },
      status: "authenticated",
    });
  });

  it("Store details should be visible", async () => {
    render(<SettingsForm />);

    waitFor(() => {
      expect(screen.getByTestId("store-image-upload-parent")).toBeVisible();

      expect(screen.getByTestId("store-image-upload")).toBeVisible();

      expect(screen.getByTestId("store-name-input")).toBeVisible();

      expect(screen.getByTestId("store-country-select-trigger")).toBeVisible();

      expect(screen.getByTestId("store-postcode-input")).toBeVisible();

      expect(screen.getByTestId("store-description-input")).toBeVisible();
    });
  });

  it("Save button should exists", async () => {
    render(<SettingsForm />);

    waitFor(() => {
      expect(screen.getByTestId("save-store-details")).toBeVisible();
    });
  });

  it("Close and delete button should exists", async () => {
    render(<Options />);

    waitFor(() => {
      expect(screen.getByTestId("close-store-btn")).toBeVisible();

      expect(screen.getByTestId("open-store-btn")).not.toBeVisible();

      expect(screen.getByTestId("delete-store-btn")).toBeVisible();
    });
  });
});
