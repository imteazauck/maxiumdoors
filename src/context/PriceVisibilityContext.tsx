import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type PriceVisibilityContextValue = {
  showPrices: boolean;
  setShowPrices: (value: boolean) => void;
  toggleShowPrices: () => void;
};

const PriceVisibilityContext = createContext<PriceVisibilityContextValue | undefined>(undefined);

export function PriceVisibilityProvider({ children }: { children: ReactNode }) {
  const [showPrices, setShowPrices] = useState(false);

  function toggleShowPrices() {
    setShowPrices((current) => !current);
  }

  const value = useMemo(
    () => ({
      showPrices,
      setShowPrices,
      toggleShowPrices,
    }),
    [showPrices],
  );

  return <PriceVisibilityContext.Provider value={value}>{children}</PriceVisibilityContext.Provider>;
}

export function usePriceVisibility() {
  const context = useContext(PriceVisibilityContext);

  if (!context) {
    throw new Error("usePriceVisibility must be used within a PriceVisibilityProvider");
  }

  return context;
}
