import NewPasswordForm from "./_components/NewPasswordForm";

export default function NewPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { token } = searchParams;

  return <NewPasswordForm token={token as string} />;
}
