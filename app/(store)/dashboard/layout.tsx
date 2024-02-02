const StoreDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="relative min-h-full w-full bg-gray-100">{children}</div>
  );
};

export default StoreDashboardLayout;
