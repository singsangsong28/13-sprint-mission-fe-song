import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-1 mt-[64px] bg-white">{children}</main>
      <Footer />
    </>
  );
}
