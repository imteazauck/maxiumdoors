import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteShell from "./components/SiteShell";
import { CartProvider } from "./context/CartContext";
import { QuoteProvider } from "./context/QuoteContext";
import { PriceVisibilityProvider } from "./context/PriceVisibilityContext";
import { AuthProvider } from "./context/AuthContext";

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
import AdminResellersPage from "./pages/AdminResellersPage";
import AdminResellerFormPage from "./pages/AdminResellerFormPage";
import AdminResellerPricingPage from "./pages/AdminResellerPricingPage";
import AdminRoute from "./admin/AdminRoute";

import ResellerLoginPage from "./pages/ResellerLoginPage";
import ResellerRoute from "./reseller/ResellerRoute";

export default function TradeSteelDoorsStorefront() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <QuoteProvider>
            <PriceVisibilityProvider>
              <Routes>
                <Route element={<SiteShell />}>
                  <Route path="/" element={<QuoteStartPage />} />
                  <Route path="/help-centre" element={<HelpCentrePage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/order-online/configure" element={<ConfiguratorPage />} />
                  <Route path="/order-online/summary" element={<QuoteSummaryPage />} />
                  <Route path="/order-online/checkout" element={<CheckoutPage />} />
                  <Route path="/order-online/thank-you" element={<ThankYouPage />} />
                </Route>

                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route element={<AdminRoute />}>
                  <Route element={<SiteShell />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/orders/:orderNumber" element={<AdminOrderDetailPage />} />
                    <Route path="/admin/resellers" element={<AdminResellersPage />} />
                    <Route path="/admin/resellers/new" element={<AdminResellerFormPage />} />
                    <Route path="/admin/resellers/:resellerId/edit" element={<AdminResellerFormPage />} />
                    <Route path="/admin/resellers/:resellerId/pricing" element={<AdminResellerPricingPage />} />
                  </Route>
                </Route>

                <Route path="/resell/login" element={<ResellerLoginPage />} />
                <Route element={<ResellerRoute />}>
                  <Route element={<SiteShell />}>
                    <Route path="/resell" element={<AdminDashboardPage />} />
                    <Route path="/resell/orders/:orderNumber" element={<AdminOrderDetailPage />} />
                  </Route>
                </Route>
              </Routes>
            </PriceVisibilityProvider>
          </QuoteProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
