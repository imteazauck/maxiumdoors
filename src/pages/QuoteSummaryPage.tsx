import { Link } from "react-router-dom";
import { useQuote } from "../context/QuoteContext";

function formatMoney(value: number) {
  return `£${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function QuoteSummaryPage() {
  const { quoteRef, customerDetails, doors, removeDoor } = useQuote();

  const total = doors.reduce((sum, door) => sum + door.unitPrice * door.quantity, 0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8A908C]">Quote summary</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#40584A]">{quoteRef}</h1>
          {customerDetails && (
            <p className="mt-3 text-sm text-[#4B4F4C]">
              {customerDetails.customerName} · {customerDetails.addressLine1}, {customerDetails.city}, {customerDetails.postcode}
            </p>
          )}
        </div>
        <Link to="/order-online/configure" className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
          Add another door
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {doors.length === 0 ? (
            <div className="rounded-[2rem] border border-[#DCE5DD] bg-[#F8FAF8] p-8 text-sm text-[#4B4F4C]">
              No configured doors have been added yet.
            </div>
          ) : (
            doors.map((door) => (
              <article key={door.doorRef} className="rounded-[2rem] border border-[#DCE5DD] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8A908C]">{door.doorRef}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#40584A]">{door.title}</h2>
                  </div>
                  <button onClick={() => removeDoor(door.doorRef)} className="text-sm font-medium text-[#8A908C] transition hover:text-[#40584A]">
                    Remove
                  </button>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {Object.entries(door.selections).map(([key, value]) => (
                    <div key={key} className="rounded-[1rem] bg-[#F8FAF8] px-4 py-3 text-sm text-[#4B4F4C]">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A908C]">{key.replace(/([A-Z])/g, " $1")}</p>
                      <p className="mt-1 font-medium text-[#40584A]">{value}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>

        <aside className="rounded-[2rem] border border-[#DCE5DD] bg-[#F8FAF8] p-6">
          <h2 className="text-xl font-semibold text-[#40584A]">Quote totals</h2>
          <div className="mt-6 flex items-center justify-between text-sm text-[#4B4F4C]">
            <span>Configured doors</span>
            <span>{doors.length}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-[#4B4F4C]">
            <span>Total quantity</span>
            <span>{doors.reduce((sum, door) => sum + door.quantity, 0)}</span>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#DCE5DD] pt-6">
            <span className="text-sm font-medium text-[#4B4F4C]">Subtotal</span>
            <span className="text-2xl font-semibold text-[#40584A]">{formatMoney(total)}</span>
          </div>
          <p className="mt-4 text-xs leading-6 text-[#8A908C]">Delivery, payment and PDF confirmation can be added after the configurator flow is approved.</p>
        </aside>
      </div>
    </section>
  );
}
