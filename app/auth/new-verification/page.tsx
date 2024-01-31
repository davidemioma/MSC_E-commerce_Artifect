import NewVerificationForm from "./_components/NewVerificationForm";

export default function NewVerificationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { token } = searchParams;

  return <NewVerificationForm token={token as string} />;
}
