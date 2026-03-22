import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AddedToBasketModal from "../components/AddedToBasketModal";
import DrawingPanel from "../components/DrawingPanel";
import { useCart } from "../context/CartContext";
import { useQuote, type ConfiguredDoor } from "../context/QuoteContext";
import {
  getConfiguratorState,
  type ConfigSelections,
  type ConfiguratorResponse,
  type ConfigFieldKey,
} from "../services/mockConfiguratorApi";

const initialState: ConfiguratorResponse = {
  visibleFields: [],
  isComplete: false,
  unitPrice: 0,
  drawingLabel: "Enter the door reference, then choose a leaf type to begin the drawing preview.",
  technicalNotes: [],
};

const colourSwatches: Record<string, string> = {
  grey: "#7A7A7A",
  black: "#111111",
  red: "#B64926",
  blue: "#2C5F8A",
  green: "#4C6B43",
};

const summaryLabels: Partial<Record<ConfigFieldKey, string>> = {
  leafType: "Leaf Type",
  handing: "Door Handing",
  structuralHeight: "Structural Opening Height",
  structuralWidth: "Structural Opening Width",
  doorType: "Door Type",
  lockType: "Lock Type",
  colour: "Colour",
};

function formatMoney(value: number) {
  return `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function humanize(value?: string) {
  if (!value) return "";
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ConfiguratorPage() {
  const { customerDetails, quoteRef, addDoor, doorRefExists } = useQuote();
  const { addConfiguredItem } = useCart();

  const [doorRef, setDoorRef] = useState("");
  const [doorRefError, setDoorRefError] = useState("");
  const [selections, setSelections] = useState<ConfigSelections>({});
  const [state, setState] = useState<ConfiguratorResponse>(initialState);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [addedDoor, setAddedDoor] = useState<ConfiguredDoor | null>(null);

  const trimmedDoorRef = doorRef.trim();
  const isDoorRefValid = trimmedDoorRef.length > 0;

  useEffect(() => {
    let isMounted = true;

    if (!isDoorRefValid) {
      setState(initialState);
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);

    getConfiguratorState(selections).then((response) => {
      if (!isMounted) return;
      setState(response);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [selections, isDoorRefValid]);

  const selectionSummary = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(selections).map(([key, value]) => [key, humanize(value)]),
      ),
    [selections],
  );

  if (!customerDetails) {
    return <Navigate to="/order-online" replace />;
  }

  function resetFollowingFields(startKey: ConfigFieldKey, nextValue: string) {
    const order: ConfigFieldKey[] = [
      "leafType",
      "handing",
      "structuralHeight",
      "structuralWidth",
      "doorType",
      "lockType",
      "colour",
    ];

    const keyIndex = order.indexOf(startKey);
    const retainedEntries = Object.entries(selections).filter(
      ([entryKey]) => order.indexOf(entryKey as ConfigFieldKey) < keyIndex,
    );

    setSelections({
      ...Object.fromEntries(retainedEntries),
      [startKey]: nextValue,
    });
  }

  function handleSelection(key: ConfigFieldKey, value: string) {
    resetFollowingFields(key, value);
  }

  function handleDoorRefChange(value: string) {
    setDoorRef(value);
    if (doorRefError) {
      setDoorRefError("");
    }
  }

  function handleAddToBasket() {
    if (!trimmedDoorRef) {
      setDoorRefError("Enter a door reference before adding this door.");
      return;
    }

    if (doorRefExists(trimmedDoorRef)) {
      setDoorRefError("This door reference is already in use for this quote.");
      return;
    }

    if (!state.isComplete) return;

    const door = addDoor({
      doorRef: trimmedDoorRef,
      title: humanize(selections.leafType) || "Configured door",
      selections: selectionSummary,
      unitPrice: state.unitPrice,
      quantity,
      technicalNotes: state.technicalNotes,
    });

    addConfiguredItem({
      quoteRef,
      doorRef: door.doorRef,
      name: door.title,
      unitPrice: door.unitPrice,
      quantity: door.quantity,
      details: Object.entries(door.selections).map(
        ([key, value]) => `${summaryLabels[key as ConfigFieldKey] ?? key}: ${value}`,
      ),
    });

    setAddedDoor(door);
    setSelections({});
    setQuantity(1);
    setDoorRef("");
    setDoorRefError("");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6B6B6B]">
            Quote reference
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#111111]">{quoteRef}</h1>
          <p className="mt-2 text-sm text-[#2A2A2A]">
            Customer: {customerDetails.customerName}
            {trimmedDoorRef ? ` · Door Ref: ${trimmedDoorRef}` : ""}
          </p>
        </div>

        <Link
          to="/order-online/summary"
          className="rounded-full border border-[#D7D7D7] px-5 py-3 text-sm font-semibold text-[#111111] transition hover:bg-[#FFF6EE]"
        >
          View quote summary
        </Link>
      </div>

      <div className="grid gap-8 items-start lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <DrawingPanel selections={selections} drawingLabel={state.drawingLabel} />

        <div className="rounded-[2rem] border border-[#D7D7D7] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6B6B6B]">
                MultiDor configurator
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[#111111]">Build your door</h2>
            </div>

            <div className="rounded-[1.25rem] bg-[#FFF9F4] px-4 py-3 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">
                Live price
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#F47A20]">
                {state.unitPrice > 0 ? formatMoney(state.unitPrice) : "—"}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">Door Reference</span>
              <input
                value={doorRef}
                onChange={(event) => handleDoorRefChange(event.target.value)}
                placeholder="e.g. Front Entrance"
                className="w-full rounded-[1rem] border border-[#D7D7D7] bg-white px-4 py-3 text-sm text-[#2A2A2A] outline-none transition focus:border-[#F47A20]"
              />
              {doorRefError && <p className="mt-2 text-sm text-red-600">{doorRefError}</p>}
            </label>

            {!isDoorRefValid ? (
              <div className="rounded-[1rem] border border-dashed border-[#D7D7D7] bg-[#FFF9F4] px-4 py-4 text-sm text-[#2A2A2A]">
                Enter a door reference to begin the configuration.
              </div>
            ) : (
              state.visibleFields.map((field) => {
                if (field.type === "input") {
                  return (
                    <label key={field.key} className="block">
                      <span className="mb-2 block text-sm font-medium text-[#111111]">{field.label}</span>
                      <input
                        type={field.inputType ?? "text"}
                        inputMode={field.inputType === "number" ? "numeric" : "text"}
                        value={selections[field.key] ?? ""}
                        onChange={(event) => handleSelection(field.key, event.target.value)}
                        className="w-full rounded-[1rem] border border-[#D7D7D7] bg-white px-4 py-3 text-sm text-[#2A2A2A] outline-none transition focus:border-[#F47A20]"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    </label>
                  );
                }

                if (field.type === "colour") {
                  return (
                    <div key={field.key}>
                      <span className="mb-3 block text-sm font-medium text-[#111111]">{field.label}</span>
                      <div className="flex flex-wrap gap-3">
                        {field.options.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelection(field.key, option.value)}
                            className={`h-10 w-10 rounded-full border-2 transition ${
                              selections[field.key] === option.value
                                ? "border-[#F47A20] scale-110 ring-4 ring-[#F47A20]/20"
                                : "border-[#D7D7D7] hover:border-[#F47A20]"
                            }`}
                            style={{ backgroundColor: colourSwatches[option.value] ?? "#9CA3AF" }}
                            title={option.label}
                            aria-label={option.label}
                          />
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <label key={field.key} className="block">
                    <span className="mb-2 block text-sm font-medium text-[#111111]">{field.label}</span>
                    <select
                      value={selections[field.key] ?? ""}
                      onChange={(event) => handleSelection(field.key, event.target.value)}
                      className="w-full rounded-[1rem] border border-[#D7D7D7] bg-white px-4 py-3 text-sm text-[#2A2A2A] outline-none transition focus:border-[#F47A20]"
                    >
                      <option value="">Select {field.label.toLowerCase()}</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              })
            )}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-[#D7D7D7] bg-[#FFF9F4] p-5">
            <h3 className="text-sm font-semibold text-[#111111]">Current selections</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.keys(selectionSummary).length === 0 ? (
                <p className="text-sm text-[#2A2A2A]">
                  Enter a door reference, then complete the configurator step by step.
                </p>
              ) : (
                Object.entries(selectionSummary).map(([key, value]) => (
                  <div key={key} className="rounded-[1rem] bg-white px-4 py-3 text-sm text-[#2A2A2A]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B6B6B]">
                      {summaryLabels[key as ConfigFieldKey] ?? key}
                    </p>
                    <p className="mt-1 font-medium text-[#111111]">{value}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#E8E0D9] pt-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#111111]">Qty</span>
              <div className="flex items-center rounded-full border border-[#D7D7D7] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="px-4 py-2 text-sm font-semibold text-[#111111] transition hover:text-[#F47A20]"
                >
                  −
                </button>
                <span className="min-w-[2.5rem] text-center text-sm font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="px-4 py-2 text-sm font-semibold text-[#111111] transition hover:text-[#F47A20]"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={!isDoorRefValid || !state.isComplete || isLoading}
              onClick={handleAddToBasket}
              className="rounded-full bg-[#F47A20] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#D96510] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Add to basket"}
            </button>
          </div>
        </div>
      </div>

      <AddedToBasketModal isOpen={Boolean(addedDoor)} quoteRef={quoteRef} door={addedDoor} onClose={() => setAddedDoor(null)} />
    </section>
  );
}
