import Footer from "./Footer";
import Header from "./Header";
const Layout = () => {
  return (
    <div>
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
