import "./globals.css";
import { auth } from "@/auth";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { constructMetadata } from "@/lib/metadata";
import ModalProvider from "@/providers/modal-provider";
import QueryProvider from "@/providers/query-provider";

const font = Nunito_Sans({ subsets: ["latin"] });

//Customised metadata.
export const metadata: Metadata = constructMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="h-full">
      <body className={cn("h-full antialiased", font.className)}>
        <SessionProvider session={session}>
          <QueryProvider>
            <Toaster
              position="top-center"
              richColors
              data-cy="toast-notification"
            />

            <ModalProvider />

            {children}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
