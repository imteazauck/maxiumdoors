import { Link, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useQuote } from "../context/QuoteContext";

function formatMoney(value: number) {
  return `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function QuoteSummaryPage() {
  const { quoteRef, customerDetails, doors, removeDoor } = useQuote();
  const { items, subtotal } = useCart();

  if (!customerDetails) {
    return <Navigate to="/order-online" replace />;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6B6B6B]">Quote summary</p>
          <h1 className="mt-2 text-4xl font-semibold text-[#111111]">{quoteRef}</h1>
          <p className="mt-2 text-sm text-[#2A2A2A]">
            {customerDetails.customerName} · {customerDetails.addressLine1}, {customerDetails.city}
          </p>
        </div>

        <Link to="/order-online/configure" className="rounded-full  border border-[#D7D7D7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#FFF6EE]">
          Add another door
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          {doors.length === 0 ? (
            <div className="rounded-[2rem] border border-[#D7D7D7] bg-white p-8 shadow-sm">
              <p className="text-lg font-semibold text-[#111111]">No doors added yet</p>
              <p className="mt-2 text-sm text-[#2A2A2A]">Build your first door configuration to start the quote.</p>
            </div>
          ) : (
            doors.map((door) => (
              <article key={door.doorRef} className="rounded-[2rem] border border-[#D7D7D7] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">Door reference</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#111111]">{door.doorRef}</h2>
                    <p className="mt-1 text-sm text-[#2A2A2A]">{door.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#F47A20]">{formatMoney(door.unitPrice * door.quantity)}</p>
                    <button type="button" onClick={() => removeDoor(door.doorRef)} className="mt-3 text-sm font-medium text-[#6B6B6B] transition hover:text-[#F47A20]">
                      Remove
                    </button>
                  </div>
                </div>

                <ul className="mt-4 divide-y divide-[#E7DED5]">
                  {Object.entries(door.selections).map(([key, value]) => (
                    <li key={key} className="flex items-center justify-between py-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A908C]">
                      {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="text-sm font-medium text-[#111111]">
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))
          )}
        </div>

        <aside className="rounded-[2rem] border border-[#D7D7D7] bg-white p-6 shadow-sm h-fit">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">Basket summary</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#111111]">Current quote</h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-[1rem] border border-[#D7D7D7] bg-[#FFF9F4] px-4 py-3">
                <p className="font-medium text-[#111111]">{item.name}</p>
                {item.doorRef && <p className="mt-1 text-sm text-[#2A2A2A]">Door Ref: {item.doorRef}</p>}
                <p className="mt-2 text-sm text-[#2A2A2A]">{formatMoney(item.unitPrice * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-[#D7D7D7] pt-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#111111]">Subtotal</span>
            <span className="text-xl font-semibold text-[#F47A20]">{formatMoney(subtotal)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
