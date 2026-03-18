import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteShell from "./components/SiteShell";
import { CartProvider } from "./context/CartContext";
import ContactPage from "./pages/ContactPage";
import HelpCentrePage from "./pages/HelpCentrePage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ShopPage from "./pages/ShopPage";
import RoleChoicePage from "./pages/RoleChoicePage";
import PortalLoginPage from "./pages/PortalLoginPage";
import PortalDashboardPage from "./pages/PortalDashboardPage";

export default function TradeSteelDoorsStorefront() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SiteShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doors" element={<ShopPage />} />
            <Route path="/doors/:slug" element={<ProductPage />} />
            <Route path="/help-centre" element={<HelpCentrePage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="/order-online" element={<RoleChoicePage />} />
            <Route
              path="/portal/login/:role"
              element={<PortalLoginPage />}
            />
            <Route
              path="/portal/dashboard"
              element={<PortalDashboardPage />}
            />
          </Routes>
        </SiteShell>
      </CartProvider>
    </BrowserRouter>
  );
}