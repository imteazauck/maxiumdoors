import { useMemo, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useQuote } from "../context/QuoteContext";
import { submitOrder, type CardDetailsInput } from "../services/orderApi";

function formatMoney(value: number) {
  return `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function normaliseCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 16);
}

function formatCardNumber(value: string) {
  return normaliseCardNumber(value)
    .match(/.{1,4}/g)
    ?.join(" ") ?? "";
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

const initialCardValues: CardDetailsInput = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { quoteRef, customerDetails, doors, resetQuote } = useQuote();
  const { subtotal, items, clearCart } = useCart();
  const [cardDetails, setCardDetails] = useState<CardDetailsInput>(initialCardValues);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doorCount = useMemo(() => doors.reduce((sum, door) => sum + door.quantity, 0), [doors]);

  if (!customerDetails) {
    return <Navigate to="/" replace />;
  }

  if (doors.length === 0) {
    return <Navigate to="/order-online/summary" replace />;
  }

  const activeCustomerDetails = customerDetails;

  function update<K extends keyof CardDetailsInput>(key: K, value: CardDetailsInput[K]) {
    setCardDetails((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const confirmation = await submitOrder({
        quoteRef,
        customerDetails: activeCustomerDetails,
        doors,
        subtotal,
        payment: {
          ...cardDetails,
          cardNumber: normaliseCardNumber(cardDetails.cardNumber),
          expiry: cardDetails.expiry,
          cvv: cardDetails.cvv.replace(/\D/g, "").slice(0, 4),
        },
      });

      sessionStorage.setItem("lastOrderConfirmation", JSON.stringify(confirmation));
      clearCart();
      resetQuote();
      navigate("/order-online/thank-you");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit your order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6B6B6B]">Checkout</p>
          <h1 className="mt-2 text-4xl font-semibold text-[#111111]">Complete your order</h1>
          <p className="mt-2 text-sm text-[#2A2A2A]">Quote reference: {quoteRef}</p>
        </div>

        <Link
          to="/order-online/summary"
          className="rounded-full border border-[#D7D7D7] px-5 py-3 text-sm font-semibold text-[#111111] transition hover:bg-[#FFF6EE]"
        >
          Back to summary
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#D7D7D7] bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">Customer details</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#111111]">Billing information</h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">Customer name</span>
              <input value={activeCustomerDetails.customerName} readOnly className="w-full rounded-[1rem] border border-[#D7D7D7] bg-[#FAFAFA] px-4 py-3 text-sm text-[#2A2A2A]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">Company name</span>
              <input value={activeCustomerDetails.companyName ?? ""} readOnly className="w-full rounded-[1rem] border border-[#D7D7D7] bg-[#FAFAFA] px-4 py-3 text-sm text-[#2A2A2A]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">Email</span>
              <input value={activeCustomerDetails.email} readOnly className="w-full rounded-[1rem] border border-[#D7D7D7] bg-[#FAFAFA] px-4 py-3 text-sm text-[#2A2A2A]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">Phone</span>
              <input value={activeCustomerDetails.phone} readOnly className="w-full rounded-[1rem] border border-[#D7D7D7] bg-[#FAFAFA] px-4 py-3 text-sm text-[#2A2A2A]" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-[#111111]">Address</span>
              <textarea
                value={[activeCustomerDetails.addressLine1, activeCustomerDetails.addressLine2, `${activeCustomerDetails.city}, ${activeCustomerDetails.postcode}`].filter(Boolean).join("\n")}
                readOnly
                rows={3}
                className="w-full rounded-[1rem] border border-[#D7D7D7] bg-[#FAFAFA] px-4 py-3 text-sm text-[#2A2A2A]"
              />
            </label>
          </div>

          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">Card details</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#111111]">Payment information</h2>
            <p className="mt-2 text-sm text-[#2A2A2A]">
              This demo captures the card form and only stores masked card data on the server.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-[#111111]">Cardholder name</span>
              <input
                required
                value={cardDetails.cardholderName}
                onChange={(event) => update("cardholderName", event.target.value)}
                className="w-full rounded-[1rem] border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
                placeholder="Name on card"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-[#111111]">Card number</span>
              <input
                required
                inputMode="numeric"
                pattern="[0-9 ]{15,19}"
                value={cardDetails.cardNumber}
                onChange={(event) => update("cardNumber", formatCardNumber(event.target.value))}
                className="w-full rounded-[1rem] border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
                placeholder="1234 5678 9012 3456"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">Expiry</span>
              <input
                required
                inputMode="numeric"
                pattern="(0[1-9]|1[0-2])/[0-9]{2}"
                value={cardDetails.expiry}
                onChange={(event) => update("expiry", formatExpiry(event.target.value))}
                className="w-full rounded-[1rem] border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
                placeholder="MM/YY"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">CVV</span>
              <input
                required
                inputMode="numeric"
                pattern="[0-9]{3,4}"
                value={cardDetails.cvv}
                onChange={(event) => update("cvv", event.target.value.replace(/\D/g, "").slice(0, 4))}
                className="w-full rounded-[1rem] border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
                placeholder="123"
              />
            </label>
          </div>

          {error && <p className="mt-4 rounded-[1rem] bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#D7D7D7] pt-6">
            <p className="text-sm text-[#2A2A2A]">{doorCount} configured door{doorCount === 1 ? "" : "s"} ready for checkout</p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#F47A20] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#D96510] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Processing..." : "Place order"}
            </button>
          </div>
        </form>

        <aside className="h-fit rounded-[2rem] border border-[#D7D7D7] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">Order summary</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#111111]">Review before payment</h2>

          <div className="mt-6 space-y-4">
            {doors.map((door) => (
              <article key={door.doorRef} className="rounded-[1.25rem] border border-[#D7D7D7] bg-[#FFF9F4] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#111111]">{door.doorRef}</p>
                    <p className="mt-1 text-sm text-[#2A2A2A]">{door.title}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#F47A20]">{formatMoney(door.unitPrice * door.quantity)}</p>
                </div>
                <ul className="mt-3 space-y-1 text-xs leading-5 text-[#2A2A2A]">
                  {Object.entries(door.selections).map(([key, value]) => (
                    <li key={key}>
                      <span className="font-semibold text-[#6B6B6B]">{key.replace(/([A-Z])/g, " $1")}:</span> {value}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-[#D7D7D7] pt-5">
            <div className="flex items-center justify-between text-sm text-[#2A2A2A]">
              <span>Items in basket</span>
              <span>{items.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[#2A2A2A]">
              <span>Customer</span>
              <span>{activeCustomerDetails.customerName}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-[#111111]">
              <span>Total</span>
              <span className="text-[#F47A20]">{formatMoney(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
