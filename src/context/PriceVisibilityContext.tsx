import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

type PriceVisibilityContextValue = {
  showPrices: boolean;
  setShowPrices: (value: boolean) => void;
  toggleShowPrices: () => void;
};

const PriceVisibilityContext = createContext<PriceVisibilityContextValue | undefined>(undefined);

function PriceVisibilityStateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [manualOverride, setManualOverride] = useState(false);

  const roleAllowsPrices = user?.role === "admin" || user?.role === "reseller";
  const showPrices = roleAllowsPrices;

  function setShowPrices(value: boolean) {
    setManualOverride(value);
  }

  function toggleShowPrices() {
    setManualOverride((current) => !current);
  }

  void manualOverride;

  const value = useMemo(() => ({ showPrices, setShowPrices, toggleShowPrices }), [showPrices]);
  return <PriceVisibilityContext.Provider value={value}>{children}</PriceVisibilityContext.Provider>;
}

export function PriceVisibilityProvider({ children }: { children: ReactNode }) {
  return <PriceVisibilityStateProvider>{children}</PriceVisibilityStateProvider>;
}

export function usePriceVisibility() {
  const context = useContext(PriceVisibilityContext);
  if (!context) throw new Error("usePriceVisibility must be used within a PriceVisibilityProvider");
  return context;
}
