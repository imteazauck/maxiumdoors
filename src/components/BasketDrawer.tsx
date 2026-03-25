import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useQuote } from "../context/QuoteContext";

function formatMoney(value: number) {
  return `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function BasketDrawer() {
  const navigate = useNavigate();
  const { items, subtotal, isBasketOpen, closeBasket, removeItem, updateQuantity } = useCart();
  const { removeDoor } = useQuote();
  return (
    <>
      {isBasketOpen && (
        <div className="fixed inset-0 z-40 bg-black/35" onClick={closeBasket} aria-hidden="true" />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ${
          isBasketOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#D7D7D7] px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">Basket</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#111111]">Your order</h2>
            </div>
            <button type="button" onClick={closeBasket} className="rounded-full border border-[#F47A20] px-4 py-2 text-sm font-semibold text-[#F47A20] transition hover:bg-[#FFF1E6]">
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <p className="text-sm leading-7 text-[#2A2A2A]">
                Your basket is empty. Add a product to begin building the enquiry or checkout flow.
              </p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <article key={item.id} className="rounded-[1.5rem] border border-[#D7D7D7] bg-[#FFF9F4] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-[#111111]">{item.name}</h3>
                        <p className="mt-1 text-sm text-[#2A2A2A]">{item.priceLabel}</p>
                        {item.colour && <p className="mt-1 text-sm text-[#2A2A2A]">Colour: {item.colour}</p>}
                        {item.quoteRef && <p className="mt-1 text-sm text-[#2A2A2A]">Quote Ref: {item.quoteRef}</p>}
                        {item.doorRef && <p className="mt-1 text-sm text-[#2A2A2A]">Door Ref: {item.doorRef}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => 
                          { removeItem(item.id)
                            removeDoor(item.doorRef!)
                          }}
                        className="text-sm font-medium text-[#6B6B6B] transition hover:text-[#F47A20]"
                      >
                        Remove
                      </button>
                    </div>

                    {item.details && item.details.length > 0 && (
                      <ul className="mt-3 space-y-1 text-xs leading-5 text-[#2A2A2A]">
                        {item.details.map((detail) => (
                          <li key={detail}>• {detail}</li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-[#D7D7D7] bg-white">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-4 py-2 text-sm font-semibold">−</button>
                        <span className="min-w-[2.5rem] text-center text-sm font-medium">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 py-2 text-sm font-semibold">+</button>
                      </div>
                      <p className="text-sm font-semibold text-[#F47A20]">{formatMoney(item.unitPrice * item.quantity)}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-[#D7D7D7] px-6 py-5">
            <div className="flex items-center justify-between text-sm font-semibold text-[#111111]">
              <span>Subtotal</span>
              <span className="text-[#F47A20]">{formatMoney(subtotal)}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                closeBasket();
                navigate("/order-online/checkout");
              }}
              className="mt-4 w-full rounded-full bg-[#F47A20] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#D96510]"
            >
              Proceed to checkout
            </button>

          </div>
        </div>
      </aside>
    </>
  );
}
