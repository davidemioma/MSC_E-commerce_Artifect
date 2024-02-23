"use client";

import { useEffect } from "react";
import { UserRole } from "@prisma/client";
import Container from "@/components/Container";
import useCurrentUser from "@/hooks/use-current-user";
import { redirect, useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  const { user } = useCurrentUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!user || user.role !== UserRole.USER) {
    return redirect("/");
  }

  return (
    <div className="bg-white w-full h-[70vh] flex items-center justify-center">
      <Container>
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <div className="text-7xl">🛍</div>

            <div className="text-4xl font-bold">LocalMart</div>
          </div>

          <h1 className="text-4xl sm:text-6xl text-gray-900 font-bold tracking-tight">
            Thank You for Your <span className="text-violet-500">Purchase</span>
            !
          </h1>

          <p className="max-w-prose text-base sm:text-lg text-gray-500">
            Your order is confirmed! We&apos;re thrilled to have you with us.
            Keep an eye on your inbox for the order details and tracking
            information.
          </p>

          <p className="text-violet-500 text-sm font-semibold">
            Redirecting to Homepage....
          </p>
        </div>
      </Container>
    </div>
  );
}
