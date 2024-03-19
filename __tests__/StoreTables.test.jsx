import React from "react";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/react";
import { DataTable } from "../components/ui/data-table";
import { OrderStatus, ProductStatus } from "@prisma/client";
import { render, screen, waitFor } from "@testing-library/react";
import Header from "../app/(store)/dashboard/_components/header/Header";
import sizeColumn from "../app/(store)/dashboard/[storeId]/sizes/_components/Columns";
import colorColumn from "../app/(store)/dashboard/[storeId]/colors/_components/Columns";
import orderColumn from "../app/(store)/dashboard/[storeId]/orders/_components/Columns";
import bannerColumn from "../app/(store)/dashboard/[storeId]/banners/_components/Columns";
import productColumn from "../app/(store)/dashboard/[storeId]/products/_components/Columns";
import categoryColumn from "../app/(store)/dashboard/[storeId]/categories/_components/Columns";

jest.mock("next-auth/react");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useParams: jest.fn(),
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

describe("Checking all Store tables", () => {
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

  it("Store Nav bar should be visible", async () => {
    render(<Header />);

    waitFor(() => {
      expect(screen.getByTestId("store-nav")).toBeVisible();
    });
  });

  it("Logo should be visible", async () => {
    render(<Header />);

    waitFor(() => {
      expect(screen.getByTestId("logo")).toBeVisible();
    });
  });

  it("Admin Nav bar routes should be visible", async () => {
    render(<Header />);

    waitFor(() => {
      expect(screen.getByText("Overview")).toBeVisible();

      expect(screen.getByText("Banners")).toBeVisible();

      expect(screen.getByText("Categories")).toBeVisible();

      expect(screen.getByText("Sizes")).toBeVisible();

      expect(screen.getByText("Colors")).toBeVisible();

      expect(screen.getByText("Products")).toBeVisible();

      expect(screen.getByText("Orders")).toBeVisible();

      expect(screen.getByText("Booty")).toBeVisible();
    });
  });

  it("Banners table Details", async () => {
    const testBanners = [
      {
        id: "123",
        storeId: "storeId",
        name: "test",
        image: "image",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(
      <DataTable columns={bannerColumn} data={testBanners} searchKey="name" />
    );

    waitFor(() => {
      expect(screen.getByText("Name")).toBeVisible();

      expect(screen.getByText("test")).toBeVisible();
    });
  });

  it("Categories table Details", async () => {
    const testCategories = [
      {
        id: "123",
        name: "test",
        storeId: "123",
        _count: {
          products: 2,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(
      <DataTable
        columns={categoryColumn}
        data={testCategories}
        searchKey="name"
      />
    );

    waitFor(() => {
      expect(screen.getByText("Name")).toBeVisible();

      expect(screen.getByText("test")).toBeVisible();

      expect(screen.getByText("Number of Products")).toBeVisible();

      expect(screen.getByText("2")).toBeVisible();
    });
  });

  it("Sizes table Details", async () => {
    const testSizes = [
      {
        id: "123",
        name: "test",
        storeId: "123",
        value: "test value",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(
      <DataTable columns={sizeColumn} data={testSizes} searchKey="name" />
    );

    waitFor(() => {
      expect(screen.getByText("Name")).toBeVisible();

      expect(screen.getByText("test")).toBeVisible();

      expect(screen.getByText("Value")).toBeVisible();

      expect(screen.getByText("test value")).toBeVisible();
    });
  });

  it("Colors table Details", async () => {
    const testColors = [
      {
        id: "123",
        name: "test",
        storeId: "123",
        value: "test value",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(
      <DataTable columns={colorColumn} data={testColors} searchKey="name" />
    );

    waitFor(() => {
      expect(screen.getByText("Name")).toBeVisible();

      expect(screen.getByText("test")).toBeVisible();

      expect(screen.getByText("Value")).toBeVisible();

      expect(screen.getByText("test value")).toBeVisible();
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
        id: "456",
        orderId: "orderId",
        storeId: "storeId",
        productId: "productId",
        productItemId: "productItemId",
        availableItemId: "availableItemId",
        quantity: 2,
        readyToBeShipped: true,
        order: {
          status: OrderStatus.APPROVED,
          user: {
            name: "test",
            email: "test@mail.com",
          },
        },
        product: {
          name: "product name",
        },
        productItem: {
          images: ["image"],
        },
        availableItem: {
          currentPrice: 50,
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
    ];

    render(<DataTable columns={orderColumn} data={testOrders} />);

    waitFor(() => {
      expect(screen.getByText("Ordered By")).toBeVisible();

      expect(screen.getByText("test")).toBeVisible();

      expect(screen.getByText("Quantity")).toBeVisible();

      expect(screen.getByText("2")).toBeVisible();

      expect(screen.getByText("Price")).toBeVisible();

      expect(screen.getByText("£50.00")).toBeVisible();

      expect(screen.getByText("Status")).toBeVisible();

      expect(screen.getByText("APPROVED")).toBeVisible();
    });
  });
});
