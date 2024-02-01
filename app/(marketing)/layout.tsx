import Footer from "@/components/Footer";
import NavBar from "./_components/NavBar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col min-h-full w-full bg-gray-100">
      <NavBar />

      <main className="flex-1 flex-grow pt-20">{children}</main>

      <Footer />
    </div>
  );
};

export default MarketingLayout;
