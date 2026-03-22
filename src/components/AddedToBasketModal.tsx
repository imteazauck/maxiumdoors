import type { ConfiguredDoor } from "../context/QuoteContext";

function formatMoney(value: number) {
  return `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const summaryLabels: Record<string, string> = {
  leafType: "Leaf Type",
  handing: "Handing",
  structuralHeight: "Structural Height",
  structuralWidth: "Structural Width",
  doorType: "Door Type",
  lockType: "Lock Type",
  colour: "Colour",
};

export default function AddedToBasketModal({
  isOpen,
  quoteRef,
  door,
  onClose,
}: {
  isOpen: boolean;
  quoteRef: string;
  door: ConfiguredDoor | null;
  onClose: () => void;
}) {
  if (!isOpen || !door) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 sm:p-6">
      <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6B6B6B]">
              Door added to quote
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[#111111] sm:text-3xl">
              {door.title}
            </h2>
            <p className="mt-2 text-sm text-[#2A2A2A]">
              Quote Ref: {quoteRef} · Door Ref: {door.doorRef}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-[#F47A20] px-4 py-2 text-sm font-semibold text-[#F47A20] transition hover:bg-[#FFF1E6]"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {Object.entries(door.selections).map(([key, value]) => (
            <div
              key={key}
              className="rounded-[1rem] border border-[#D7D7D7] bg-[#FFF9F4] px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B6B6B]">
                {summaryLabels[key] ?? key.replace(/([A-Z])/g, " $1")}
              </p>
              <p className="mt-1 text-sm font-medium text-[#111111]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[1.25rem] border border-[#D7D7D7] bg-[#FFF9F4] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-[#111111]">Door total</p>
            <p className="text-xl font-semibold text-[#F47A20]">
              {formatMoney(door.unitPrice * door.quantity)}
            </p>
          </div>

          <ul className="mt-4 space-y-2 text-sm leading-6 text-[#2A2A2A]">
            {door.technicalNotes.map((note) => (
              <li key={note}>• {note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}