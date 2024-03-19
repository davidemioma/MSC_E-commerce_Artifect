import React from "react";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/react";
import { DataTable } from "../components/ui/data-table";
import { render, screen, waitFor } from "@testing-library/react";
import AdminNav from "../app/(admin-board)/_components/nav/AdminNav";
import userColumn from "../app/(admin-board)/admin/users/_components/Columns";
import storeColumn from "../app/(admin-board)/admin/stores/_components/Columns";
import orderColumn from "../app/(admin-board)/admin/orders/_components/Columns";
import productColumn from "../app/(admin-board)/admin/products/_components/Columns";
import {
  OrderStatus,
  ProductStatus,
  UserRole,
  storeStatus,
} from "@prisma/client";

jest.mock("next-auth/react");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("query-string", () => ({
  stringify: jest.fn((obj) => "inlineMockedQueryString"),
  parse: jest.fn((str) => ({ inlineMocked: "parsedObject" })),
}));

jest.mock("@tanstack/react-table", () => ({
  ...jest.requireActual("@tanstack/react-table"),
  useReactTable: jest.fn().mockImplementation(() => ({
    getColumn: jest.fn().mockReturnValue({
      getFilterValue: jest.fn().mockReturnValue("mockedFilterValue"),
    }),
    getHeaderGroups: jest.fn().mockReturnValue([
      {
        id: "mockHeaderGroup1",
        headers: [
          {
            id: "mockHeader1",
            column: {
              id: "mockColumn1",
              columnDef: {
                id: "mockColumnDef1",
                header: "Mock Header 1",
              },
            },
            getContext: jest.fn(),
          },
        ],
      },
    ]),
    getRowModel: jest.fn().mockReturnValue({
      rows: [
        {
          id: "mockRow1",
          getIsSelected: jest.fn(),
          getVisibleCells: jest.fn().mockReturnValue([
            {
              id: "mockCell1",
              column: {
                columnDef: {
                  cell: "Mock Cell Content",
                },
              },
              getContext: jest.fn(),
            },
          ]),
        },
      ],
    }),
    getCanPreviousPage: jest.fn().mockReturnValue(true),
    getCanNextPage: jest.fn().mockReturnValue(true),
  })),
}));

describe("Checking all ADMIN tables", () => {
  beforeEach(() => {
    jest.clearAllMocks();

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

  it("Admin Nav bar should be visible", async () => {
    render(<AdminNav />);

    waitFor(() => {
      expect(screen.getByTestId("admin-nav")).toBeVisible();
    });
  });

  it("Logo should be visible", async () => {
    render(<AdminNav />);

    waitFor(() => {
      expect(screen.getByTestId("logo")).toBeVisible();
    });
  });

  it("Admin Nav bar routes should be visible", async () => {
    render(<AdminNav />);

    waitFor(() => {
      expect(screen.getByText("Overview")).toBeVisible();

      expect(screen.getByText("Users")).toBeVisible();

      expect(screen.getByText("Stores")).toBeVisible();

      expect(screen.getByText("Products")).toBeVisible();

      expect(screen.getByText("Orders")).toBeVisible();
    });
  });

  it("Users table Details", async () => {
    const testUsers = [
      {
        id: "123",
        name: "test",
        email: "test@mail.com",
        emailVerified: new Date(),
        image: "image",
        hashedPassword: "123456",
        role: UserRole.USER,
        isTwoFactorEnabled: true,
      },
    ];

    render(
      <DataTable columns={userColumn} data={testUsers} searchKey="name" />
    );

    waitFor(() => {
      expect(screen.getByText("Name")).toBeVisible();

      expect(screen.getByText("test")).toBeVisible();

      expect(screen.getByText("Email")).toBeVisible();

      expect(screen.getByText("test@mail.com")).toBeVisible();

      expect(screen.getByText("Role")).toBeVisible();

      expect(screen.getByText("USER")).toBeVisible();

      expect(screen.getByText("Is Two Factor Enabled")).toBeVisible();

      expect(screen.getByText("true")).toBeVisible();
    });
  });

  it("Stores table Details", async () => {
    const testStores = [
      {
        id: "123",
        name: "test",
        userId: "123",
        email: "test@mail.com",
        emailVerified: new Date(),
        country: "country",
        postcode: "123456",
        logo: "image",
        description: "descriptionb",
        status: storeStatus.APPROVED,
        statusFeedback: "hhhhh",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(
      <DataTable columns={storeColumn} data={testStores} searchKey="name" />
    );

    waitFor(() => {
      expect(screen.getByText("Name")).toBeVisible();

      expect(screen.getByText("test")).toBeVisible();

      expect(screen.getByText("Email")).toBeVisible();

      expect(screen.getByText("test@mail.com")).toBeVisible();

      expect(screen.getByText("Country")).toBeVisible();

      expect(screen.getByText("country")).toBeVisible();

      expect(screen.getByText("Postcode")).toBeVisible();

      expect(screen.getByText("123456")).toBeVisible();

      expect(screen.getByText("Status")).toBeVisible();

      expect(screen.getByText("APPROVED")).toBeVisible();
    });
  });

  it("Products table Details", async () => {
    const testProducts = [
      {
        id: "123",
        storeId: "123",
        userId: "123",
        name: "test",
        categoryId: "category",
        description: "description",
        status: ProductStatus.APPROVED,
        statusFeedback: "hhhhh",
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          name: "category name",
        },
        _count: {
          productItems: 3,
        },
      },
    ];

    render(
      <DataTable columns={productColumn} data={testProducts} searchKey="name" />
    );

    waitFor(() => {
      expect(screen.getByText("Name")).toBeVisible();

      expect(screen.getByText("test")).toBeVisible();

      expect(screen.getByText("Category")).toBeVisible();

      expect(screen.getByText("category name")).toBeVisible();

      expect(screen.getByText("Product Items")).toBeVisible();

      expect(screen.getByText("3")).toBeVisible();

      expect(screen.getByText("Status")).toBeVisible();

      expect(screen.getByText("APPROVED")).toBeVisible();
    });
  });

  it("Orders table Details", async () => {
    const testOrders = [
      {
        id: "123",
        userId: "123",
        address: "address",
        trackingId: "trackingId",
        paymentIntentId: "paymentIntentId",
        status: OrderStatus.APPROVED,
        orderItems: [
          {
            id: "456",
            orderId: "orderId",
            storeId: "storeId",
            productId: "productId",
            productItemId: "productItemId",
            availableItemId: "availableItemId",
            quantity: 2,
            readyToBeShipped: true,
            product: {
              name: "product name",
            },
            productItem: {
              images: ["image"],
            },
            availableItem: {
              currentPrice: 40,
              size: {
                id: "4564",
                storeId: "storeId12",
                name: "size name",
                value: "size value",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(<DataTable columns={orderColumn} data={testOrders} />);

    waitFor(() => {
      expect(screen.getByText("TrackingId")).toBeVisible();

      expect(screen.getByText("trackingId")).toBeVisible();

      expect(screen.getByText("Status")).toBeVisible();

      expect(screen.getByText("APPROVED")).toBeVisible();
    });
  });
});
