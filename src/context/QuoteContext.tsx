import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type CustomerDetails = {
  customerName: string;
  companyName?: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
};

export type DoorSelectionMap = Record<string, string>;

export type ConfiguredDoor = {
  doorRef: string;
  title: string;
  selections: DoorSelectionMap;
  unitPrice: number;
  quantity: number;
  technicalNotes: string[];
};

type QuoteContextValue = {
  quoteRef: string;
  customerDetails: CustomerDetails | null;
  doors: ConfiguredDoor[];
  startQuote: (details: CustomerDetails) => void;
  addDoor: (door: ConfiguredDoor) => ConfiguredDoor;
  removeDoor: (doorRef: string) => void;
  doorRefExists: (doorRef: string) => boolean;
  resetQuote: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

function buildQuoteRef() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `MAX-${y}${m}${d}-${random}`;
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quoteRef, setQuoteRef] = useState(buildQuoteRef);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [doors, setDoors] = useState<ConfiguredDoor[]>([]);

  function startQuote(details: CustomerDetails) {
    setCustomerDetails(details);
    if (!quoteRef) {
      setQuoteRef(buildQuoteRef());
    }
  }

  function addDoor(door: ConfiguredDoor) {
    setDoors((current) => [...current, door]);
    return door;
  }

  function removeDoor(doorRef: string) {
    setDoors((current) => current.filter((door) => door.doorRef !== doorRef));
  }

  function doorRefExists(doorRef: string) {
    const normalized = doorRef.trim().toLowerCase();
    return doors.some((door) => door.doorRef.trim().toLowerCase() === normalized);
  }

  function resetQuote() {
    setCustomerDetails(null);
    setDoors([]);
    setQuoteRef(buildQuoteRef());
  }

  const value = useMemo(
    () => ({ quoteRef, customerDetails, doors, startQuote, addDoor, removeDoor, doorRefExists, resetQuote }),
    [quoteRef, customerDetails, doors],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuote must be used within a QuoteProvider");
  }
  return context;
}
