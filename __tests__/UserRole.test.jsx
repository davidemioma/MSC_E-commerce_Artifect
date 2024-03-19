import React from "react";
import { mocked } from "jest-mock";
import Cart from "../components/cart/Cart";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import UserAccount from "../components/UserAccount";
import NavBar from "../app/(marketing)/_components/NavBar";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

jest.mock("next-auth/react");

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

describe("Checking user roles (USER)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useQuery.mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
    });

    mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: "123",
          name: "John Doe",
          email: "john.doe@example.com",
          emailVerified: new Date(),
          role: "USER",
          isTwoFactorEnabled: false,
          isOAuth: false,
        },
        expires: "1",
      },
      status: "authenticated",
    });
  });

  it('Shows "Become a seller" button when user logged in', async () => {
    render(<UserAccount />);

    expect(screen.getByTestId("user-account-trigger")).toBeInTheDocument();

    await fireEvent.click(screen.getByTestId("user-account-trigger"));

    waitFor(() => {
      expect(screen.getByTestId("become-a-seller")).toBeInTheDocument();
    });
  });

  it('Shows "cart" button when user logged in', async () => {
    render(<Cart />);

    expect(screen.getByTestId("cart-trigger")).toBeInTheDocument();
  });

  it("Open cart when button is clicked", async () => {
    render(<Cart />);

    expect(screen.getByTestId("cart-trigger")).toBeInTheDocument();

    await fireEvent.click(screen.getByTestId("cart-trigger"));

    waitFor(() => {
      expect(screen.getByTestId("cart-content")).toBeInTheDocument();
    });
  });
});

describe("Checking user roles (SELLER)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useQuery.mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
    });

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

  it('Shows "Go to store" button when user logged in', async () => {
    render(<UserAccount />);

    expect(screen.getByTestId("user-account-trigger")).toBeInTheDocument();

    await fireEvent.click(screen.getByTestId("user-account-trigger"));

    waitFor(() => {
      expect(screen.getByTestId("go-to-store")).toBeInTheDocument();
    });
  });

  it('Does not show "cart" button when user logged in', async () => {
    render(<Cart />);

    waitFor(() => {
      expect(screen.getByTestId("cart-trigger")).not.toBeVisible();
    });
  });
});

describe("Checking user roles (ADMIN)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useQuery.mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
    });

    mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: "123",
          name: "John Doe",
          email: "john.doe@example.com",
          emailVerified: new Date(),
          role: "ADMIN",
          isTwoFactorEnabled: false,
          isOAuth: false,
        },
        expires: "1",
      },
      status: "authenticated",
    });
  });

  it('Shows "Go to store" button when user logged in', async () => {
    render(<UserAccount />);

    expect(screen.getByTestId("user-account-trigger")).toBeInTheDocument();

    await fireEvent.click(screen.getByTestId("user-account-trigger"));

    waitFor(() => {
      expect(screen.getByTestId("go-to-dashboard")).toBeInTheDocument();
    });
  });

  it('Does not show "cart" button when user logged in', async () => {
    render(<Cart />);

    waitFor(() => {
      expect(screen.getByTestId("cart-trigger")).not.toBeVisible();
    });
  });
});

describe("Checking user roles (No User)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useQuery.mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
    });

    mocked(useSession).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
  });
  it("User account should not be visible", async () => {
    render(<UserAccount />);

    waitFor(() => {
      expect(screen.getByTestId("user-account-trigger")).not.toBeVisible();
    });
  });

  it("Sign in button should be visible", async () => {
    render(<NavBar />);

    waitFor(() => {
      expect(screen.getByTestId("nav-sign-in-btn")).not.toBeVisible();
    });
  });

  it('Does not show "cart" button when user logged in', async () => {
    render(<Cart />);

    waitFor(() => {
      expect(screen.getByTestId("cart-trigger")).not.toBeVisible();
    });
  });
});
