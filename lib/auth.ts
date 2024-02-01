import { auth } from "@/auth";

export const currentUser = async () => {
  const session = await auth();

  return { user: session?.user };
};

export const currentRole = async () => {
  const session = await auth();

  return { role: session?.user?.role };
};
