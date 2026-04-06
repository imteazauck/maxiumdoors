import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SiteShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">

      {/* ✅ Remove header completely in admin */}
      {!isAdmin && <Header />}

      <main className="flex-1">
        <Outlet />
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}