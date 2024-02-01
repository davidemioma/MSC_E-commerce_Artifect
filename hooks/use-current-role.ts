import { useSession } from "next-auth/react";

const useCurrentRole = () => {
  const session = useSession();

  return { role: session?.data?.user?.role };
};

export default useCurrentRole;
