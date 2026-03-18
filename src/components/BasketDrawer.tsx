import { useCart } from "../context/CartContext";

function formatMoney(value: number) {
  return `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function BasketDrawer() {
  const {
    items,
    subtotal,
    isBasketOpen,
    closeBasket,
    removeItem,
    updateQuantity,
  } = useCart();

  return (
    <>
      {isBasketOpen && (
        <button
          aria-label="Close basket overlay"
          onClick={closeBasket}
          className="fixed inset-0 z-40 bg-black/35"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl transition-transform duration-300 ${
          isBasketOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Basket</p>
            <h2 className="mt-1 text-2xl font-semibold">Your order</h2>
          </div>
          <button
            onClick={closeBasket}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="rounded-[1.5rem] border border-zinc-200 bg-[#fafaf8] p-5 text-sm leading-6 text-zinc-600">
              Your basket is empty. Add a product to begin building the enquiry or checkout flow.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-zinc-200 bg-[#fafaf8] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-zinc-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-zinc-600">{item.priceLabel}</p>
                      {item.colour && (
                        <p className="mt-1 text-sm text-zinc-600">Colour: {item.colour}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm font-medium text-zinc-500 hover:text-black"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center rounded-full border border-zinc-300 bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-4 py-2 text-sm font-semibold"
                      >
                        −
                      </button>
                      <span className="min-w-[2.5rem] text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-4 py-2 text-sm font-semibold"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm font-semibold text-zinc-900">
                      {formatMoney(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 px-6 py-5">
          <div className="flex items-center justify-between text-sm text-zinc-600">
            <span>Subtotal</span>
            <span className="text-lg font-semibold text-zinc-900">{formatMoney(subtotal)}</span>
          </div>

          <button className="mt-4 w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
            Proceed to checkout
          </button>
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            This basket is ready for a later database-backed checkout and order flow.
          </p>
        </div>
      </aside>
    </>
  );
}