import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import DrawingPanel from "../components/DrawingPanel";
import { useCart } from "../context/CartContext";
import { useQuote } from "../context/QuoteContext";

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
  const navigate = useNavigate();
  const [doorRef, setDoorRef] = useState("");
  const [doorRefError, setDoorRefError] = useState("");
  const [selections, setSelections] = useState<ConfigSelections>({});
  const [state, setState] = useState<ConfiguratorResponse>(initialState);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [heightError, setHeightError] = useState("");
  const [widthError, setWidthError] = useState("");
  const trimmedDoorRef = doorRef.trim();
  const isDoorRefValid = trimmedDoorRef.length > 0;
  const RANGE_BY_LEAF = {
  single: {
    height: { min: 1000, max: 2960 },
    width: { min: 900, max: 1460 },
  },
  double: {
    height: { min: 1000, max: 2200 },
    width: { min: 1000, max: 2200 },
  },
} as const;

  const currentLeaf = selections.leafType as keyof typeof RANGE_BY_LEAF | undefined;

  const heightRange = currentLeaf
    ? RANGE_BY_LEAF[currentLeaf].height
    : { min: 0, max: Infinity };

  const widthRange = currentLeaf
    ? RANGE_BY_LEAF[currentLeaf].width
    : { min: 0, max: Infinity };

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
  function validateHeight(value: string) {
    const num = Number(value);

    if (!value) {
      setHeightError("");
      return;
    }

    if (!currentLeaf || !Number.isFinite(num)) {
      setHeightError("");
      return;
    }

    if (num < heightRange.min || num > heightRange.max) {
      setHeightError(
        `Enter a value between ${heightRange.min} and ${heightRange.max} mm.`
      );
      return;
    }

    setHeightError("");
  }

  function validateWidth(value: string) {
    const num = Number(value);

    if (!value) {
      setWidthError("");
      return;
    }

    if (!currentLeaf || !Number.isFinite(num)) {
      setWidthError("");
      return;
    }

    if (num < widthRange.min || num > widthRange.max) {
      setWidthError(
        `Enter a value between ${widthRange.min} and ${widthRange.max} mm.`
      );
      return;
    }

    setWidthError("");
  }

  function handleSelection(key: ConfigFieldKey, value: string) {
        if (key === "leafType") {
      setHeightError("");
      setWidthError("");
    }

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
    if (heightError || widthError) {
      return;
    }

    if (!state.isComplete) return;

    const door = addDoor({
      doorRef: trimmedDoorRef,
      title: humanize(selections.doorType) || "Configured door",
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
      ([key, value]) => `${key.replace(/([A-Z])/g, " $1")}: ${value}`
      ),
    });

    setSelections({});
    setQuantity(1);
    setDoorRef("");
    setDoorRefError("");
    setHeightError("");
    setWidthError("");
    setTimeout(() => {
      navigate("/order-online/summary");
    }, 300);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6B6B6B]">
            Quote reference : {quoteRef}</p>
          <p className="mt-2 text-sm text-[#2A2A2A]">
            Customer: {customerDetails.customerName}
            {trimmedDoorRef ? ` · Door Ref: ${trimmedDoorRef}` : ""}
          </p>
        </div>


      </div>

      <div className="grid gap-8 items-start lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <DrawingPanel selections={selections} drawingLabel={state.drawingLabel} />

        <div className="rounded-[2rem] border border-[#D7D7D7] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6B6B6B]">
                MultiDoor configurator
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
                                if (field.type === "input" && field.key === "structuralHeight") {
                  return (
                    <label key={field.key} className="block">
                      <span className="mb-2 block text-sm font-medium text-[#111111]">
                        {field.label}
                      </span>
                      <input
                        type={field.inputType ?? "text"}
                        inputMode={
                          field.inputType === "number" ? "numeric" : "text"
                        }
                        value={selections[field.key] ?? ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          handleSelection(field.key, value);
                          validateHeight(value);
                        }}
                        min={Number.isFinite(heightRange.min) ? heightRange.min : undefined}
                        max={Number.isFinite(heightRange.max) ? heightRange.max : undefined}
                        className="w-full rounded-[1rem] border border-[#D7D7D7] bg-white px-4 py-3 text-sm text-[#2A2A2A] outline-none transition focus:border-[#F47A20]"
                        placeholder="Enter structural opening height"
                      />
                      {heightError ? (
                        <p className="mt-2 text-sm text-red-600">{heightError}</p>
                      ) : currentLeaf ? (
                        <p className="mt-2 text-xs text-[#8A908C]">
                          Min {heightRange.min} mm — Max {heightRange.max} mm
                        </p>
                      ) : null}
                    </label>
                  );
                }

                if (field.type === "input" && field.key === "structuralWidth") {
                  return (
                    <label key={field.key} className="block">
                      <span className="mb-2 block text-sm font-medium text-[#111111]">
                        {field.label}
                      </span>
                      <input
                        type={field.inputType ?? "text"}
                        inputMode={
                          field.inputType === "number" ? "numeric" : "text"
                        }
                        value={selections[field.key] ?? ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          handleSelection(field.key, value);
                          validateWidth(value);
                        }}
                        min={Number.isFinite(widthRange.min) ? widthRange.min : undefined}
                        max={Number.isFinite(widthRange.max) ? widthRange.max : undefined}
                        className="w-full rounded-[1rem] border border-[#D7D7D7] bg-white px-4 py-3 text-sm text-[#2A2A2A] outline-none transition focus:border-[#F47A20]"
                        placeholder="Enter structural opening width"
                      />
                      {widthError ? (
                        <p className="mt-2 text-sm text-red-600">{widthError}</p>
                      ) : currentLeaf ? (
                        <p className="mt-2 text-xs text-[#8A908C]">
                          Min {widthRange.min} mm — Max {widthRange.max} mm
                        </p>
                      ) : null}
                    </label>
                  );
                }

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

<div className="mt-8 rounded-[1.5rem] border border-[#E7DED5] bg-[#FFF9F4] p-5">
  <h3 className="text-sm font-semibold text-[#111111]">
    Current selections
  </h3>

  {Object.keys(selectionSummary).length === 0 ? (
    <p className="mt-4 text-sm text-[#2A2A2A]">
      Enter a door reference, then complete the configurator step by step.
    </p>
  ) : (
    <ul className="mt-4 divide-y divide-[#E7DED5]">
      {Object.entries(selectionSummary).map(([key, value]) => (
        <li key={key} className="flex items-center justify-between py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A908C]">
            {summaryLabels[key as ConfigFieldKey] ?? key}
          </span>
          <span className="text-sm font-medium text-[#111111] text-right">
            {value}
          </span>
        </li>
      ))}
    </ul>
  )}
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

    </section>
  );
}
