import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteShell from "./components/SiteShell";

import { CartProvider } from "./context/CartContext";
import { QuoteProvider } from "./context/QuoteContext";
import { PriceVisibilityProvider } from "./context/PriceVisibilityContext";

import ContactPage from "./pages/ContactPage";
import HelpCentrePage from "./pages/HelpCentrePage";
import QuoteStartPage from "./pages/QuoteStartPage";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import QuoteSummaryPage from "./pages/QuoteSummaryPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";

import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminOrderDetailPage from "./pages/AdminOrderDetailPage";
import AdminRoute from "./admin/AdminRoute";

export default function TradeSteelDoorsStorefront() {
  return (
    <BrowserRouter>
      <CartProvider>
        <QuoteProvider>
          <PriceVisibilityProvider>

            <Routes>

              {/* ✅ PUBLIC ROUTES (wrapped in SiteShell) */}
              <Route element={<SiteShell />}>
                <Route path="/" element={<QuoteStartPage />} />
                <Route path="/help-centre" element={<HelpCentrePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/order-online/configure" element={<ConfiguratorPage />} />
                <Route path="/order-online/summary" element={<QuoteSummaryPage />} />
                <Route path="/order-online/checkout" element={<CheckoutPage />} />
                <Route path="/order-online/thank-you" element={<ThankYouPage />} />
              </Route>

              {/* ✅ ADMIN LOGIN (no layout) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* ✅ ADMIN PROTECTED ROUTES */}
              <Route element={<AdminRoute />}>
                <Route element={<SiteShell />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/orders/:orderNumber" element={<AdminOrderDetailPage />} />
                </Route>
              </Route>

            </Routes>

          </PriceVisibilityProvider>
        </QuoteProvider>
      </CartProvider>
    </BrowserRouter>
  );
}