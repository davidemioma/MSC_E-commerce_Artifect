import { currentUser } from "@/lib/auth";

export default async function CreateStorePage() {
  const { user } = await currentUser();

  return <div>CreateStorePage</div>;
}
