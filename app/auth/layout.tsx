const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
