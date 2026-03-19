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
  unitPrice: 695,
  drawingLabel: "Choose a door type to begin the drawing preview.",
  technicalNotes: [],
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
  const [isLoading, setIsLoading] = useState(true);
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
        Object.entries(selections).map(([key, value]) => [key, humanize(value)])
      ),
    [selections]
  );

  if (!customerDetails) {
    return <Navigate to="/order-online" replace />;
  }

  function handleSelection(key: ConfigFieldKey, value: string) {
    const order: ConfigFieldKey[] = [
      "doorType",
      "handing",
      "height",
      "widthBand",
      "exactWidth",
      "lockType",
      "colour",
    ];

    const keyIndex = order.indexOf(key);
    const nextEntries = Object.entries(selections).filter(
      ([entryKey]) => order.indexOf(entryKey as ConfigFieldKey) < keyIndex
    );

    setSelections({
      ...Object.fromEntries(nextEntries),
      [key]: value,
    });
  }

  function handleDoorRefChange(value: string) {
    setDoorRef(value);
    if (doorRefError) {
      setDoorRefError("");
    }
    if (Object.keys(selections).length > 0) {
      setSelections({});
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
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8A908C]">
            Quote reference
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#40584A]">
            {quoteRef}
          </h1>
          <p className="mt-2 text-sm text-[#4B4F4C]">
            Customer: {customerDetails.customerName}
            {trimmedDoorRef ? ` · Door Ref: ${trimmedDoorRef}` : ""}
          </p>
        </div>

        <Link
          to="/order-online/summary"
          className="rounded-full border border-[#DCE5DD] px-5 py-3 text-sm font-semibold text-[#40584A] transition hover:bg-[#F5F7F5]"
        >
          View quote summary
        </Link>
      </div>

      <div className="grid gap-8 items-start lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <DrawingPanel
          selections={selections}
          drawingLabel={state.drawingLabel}
        />

        <div className="rounded-[2rem] border border-[#DCE5DD] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8A908C]">
                MultiDor configurator
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[#40584A]">
                Build your door
              </h2>
            </div>

            <div className="rounded-[1.25rem] bg-[#F8FAF8] px-4 py-3 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8A908C]">
                Live price
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#40584A]">
                {formatMoney(state.unitPrice)}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#40584A]">
                Door Reference
              </span>
              <input
                value={doorRef}
                onChange={(event) => handleDoorRefChange(event.target.value)}
                placeholder="e.g. Front Entrance"
                className="w-full rounded-[1rem] border border-[#DCE5DD] bg-white px-4 py-3 text-sm text-[#4B4F4C] outline-none transition focus:border-[#40584A]"
              />
              {doorRefError && (
                <p className="mt-2 text-sm text-red-600">{doorRefError}</p>
              )}
            </label>

            {!isDoorRefValid ? (
              <div className="rounded-[1rem] border border-dashed border-[#DCE5DD] bg-[#F8FAF8] px-4 py-4 text-sm text-[#4B4F4C]">
                Enter a door reference to begin the configuration.
              </div>
            ) : (
              state.visibleFields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-2 block text-sm font-medium text-[#40584A]">
                    {field.label}
                  </span>
                  <select
                    value={selections[field.key] ?? ""}
                    onChange={(event) =>
                      handleSelection(field.key, event.target.value)
                    }
                    className="w-full rounded-[1rem] border border-[#DCE5DD] bg-white px-4 py-3 text-sm text-[#4B4F4C] outline-none transition focus:border-[#40584A]"
                  >
                    <option value="">
                      Select {field.label.toLowerCase()}
                    </option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ))
            )}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-[#DCE5DD] bg-[#F8FAF8] p-5">
            <h3 className="text-sm font-semibold text-[#40584A]">
              Current selections
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.keys(selectionSummary).length === 0 ? (
                <p className="text-sm text-[#4B4F4C]">
                  Enter a door reference, then choose the door type to reveal
                  the next dropdown and drawing state.
                </p>
              ) : (
                Object.entries(selectionSummary).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-[1rem] bg-white px-4 py-3 text-sm text-[#4B4F4C]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A908C]">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="mt-1 font-medium text-[#40584A]">{value}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#E7EEE7] pt-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#40584A]">Qty</span>
              <div className="flex items-center rounded-full border border-[#DCE5DD] bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="px-4 py-2 text-sm font-semibold"
                >
                  −
                </button>
                <span className="min-w-[2.5rem] text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="px-4 py-2 text-sm font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={!isDoorRefValid || !state.isComplete || isLoading}
              onClick={handleAddToBasket}
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Add to basket"}
            </button>
          </div>
        </div>
      </div>

      <AddedToBasketModal
        isOpen={Boolean(addedDoor)}
        quoteRef={quoteRef}
        door={addedDoor}
        onClose={() => setAddedDoor(null)}
      />
    </section>
  );
}