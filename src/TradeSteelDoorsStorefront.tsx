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

export default function TradeSteelDoorsStorefront() {
  return (
    <BrowserRouter>
      <CartProvider>
        <QuoteProvider>
          <PriceVisibilityProvider>
          <SiteShell>
            <Routes>
              <Route path="/" element={<QuoteStartPage />} />
              <Route path="/help-centre" element={<HelpCentrePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/order-online/configure" element={<ConfiguratorPage />} />
              <Route path="/order-online/summary" element={<QuoteSummaryPage />} />
              <Route path="/order-online/checkout" element={<CheckoutPage />} />
              <Route path="/order-online/thank-you" element={<ThankYouPage />} />
            </Routes>
          </SiteShell>
          </PriceVisibilityProvider>
        </QuoteProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
