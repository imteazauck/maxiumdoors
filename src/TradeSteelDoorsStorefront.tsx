import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteShell from "./components/SiteShell";
import { CartProvider } from "./context/CartContext";
import { QuoteProvider } from "./context/QuoteContext";
import ContactPage from "./pages/ContactPage";
import HelpCentrePage from "./pages/HelpCentrePage";
import HomePage from "./pages/HomePage";
import PortalDashboardPage from "./pages/PortalDashboardPage";
import PortalLoginPage from "./pages/PortalLoginPage";
import ProductPage from "./pages/ProductPage";
import QuoteStartPage from "./pages/QuoteStartPage";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import QuoteSummaryPage from "./pages/QuoteSummaryPage";
import ShopPage from "./pages/ShopPage";

export default function TradeSteelDoorsStorefront() {
  return (
    <BrowserRouter>
      <CartProvider>
        <QuoteProvider>
          <SiteShell>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/doors" element={<ShopPage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/doors/:slug" element={<ProductPage />} />
              <Route path="/help-centre" element={<HelpCentrePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/portal/login" element={<PortalLoginPage />} />
              <Route path="/portal/dashboard" element={<PortalDashboardPage />} />
              <Route path="/order-online" element={<QuoteStartPage />} />
              <Route path="/order-online/configure" element={<ConfiguratorPage />} />
              <Route path="/order-online/summary" element={<QuoteSummaryPage />} />
            </Routes>
          </SiteShell>
        </QuoteProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
