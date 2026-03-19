import { Link } from "react-router-dom";
import type { ConfiguredDoor } from "../context/QuoteContext";

function formatMoney(value: number) {
  return `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

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
    <>
      <button className="fixed inset-0 z-40 bg-black/40" aria-label="Close added to basket modal" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8A908C]">Door added to basket</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#40584A]">{door.title}</h2>
              <p className="mt-3 text-sm text-[#4B4F4C]">Quote Ref: <span className="font-semibold">{quoteRef}</span> · Door Ref: <span className="font-semibold">{door.doorRef}</span></p>
            </div>
            <button onClick={onClose} className="rounded-full border border-[#DCE5DD] px-4 py-2 text-sm font-medium text-[#4B4F4C]">
              Close
            </button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.5rem] border border-[#DCE5DD] bg-[#F8FAF8] p-5">
              <h3 className="text-sm font-semibold text-[#40584A]">Configuration summary</h3>
              <div className="mt-4 space-y-2 text-sm text-[#4B4F4C]">
                {Object.entries(door.selections).map(([key, value]) => (
                  <div key={key} className="flex items-start justify-between gap-4 border-b border-[#E8EEE8] pb-2 last:border-b-0">
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="text-right font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-[#4B4F4C]">Line total</span>
                <span className="text-lg font-semibold text-[#40584A]">{formatMoney(door.unitPrice * door.quantity)}</span>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#DCE5DD] bg-white p-5">
              <h3 className="text-sm font-semibold text-[#40584A]">Technical notes</h3>
              <div className="mt-4 space-y-3 text-sm leading-6 text-[#4B4F4C]">
                {door.technicalNotes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onClose} className="rounded-full border border-[#DCE5DD] px-5 py-3 text-sm font-semibold text-[#40584A]">
              Add another door
            </button>
            <Link to="/order-online/summary" className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              View quote
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
