import { useEffect, useRef } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useQuote } from "../context/QuoteContext";
import type { OrderConfirmation } from "../services/orderApi";

type LocationState = {
  confirmation?: OrderConfirmation;
};

export default function ThankYouPage() {
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const confirmation = state?.confirmation;

  const { clearCart, closeBasket } = useCart();
  const { resetQuote } = useQuote();

  const hasClearedRef = useRef(false);

  useEffect(() => {
    if (!confirmation || hasClearedRef.current) return;

    hasClearedRef.current = true;
    closeBasket();
    clearCart();
    resetQuote();
  }, [confirmation, closeBasket, clearCart, resetQuote]);

  if (!confirmation) {
    return <Navigate to="/order-online" replace />;
  }

  const createdAtText =
    confirmation.createdAt &&
    !Number.isNaN(new Date(confirmation.createdAt).getTime())
      ? new Date(confirmation.createdAt).toLocaleString()
      : "-";

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#F47A20]">
            Thank you
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#111111]">
            Your order has been placed
          </h1>
          <p className="mt-3 text-base text-neutral-600">
            {confirmation.message}
          </p>
        </div>

        <div className="grid gap-4 rounded-xl bg-neutral-50 p-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-neutral-500">Order number</p>
            <p className="text-base font-semibold text-[#111111]">
              {confirmation.orderNumber}
            </p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Quote reference</p>
            <p className="text-base font-semibold text-[#111111]">
              {confirmation.quoteRef}
            </p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Status</p>
            <p className="text-base font-semibold capitalize text-[#111111]">
              {confirmation.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Created at</p>
            <p className="text-base font-semibold text-[#111111]">
              {createdAtText}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/order-online/configure"
            className="inline-flex items-center rounded-full bg-[#F47A20] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Add another door
          </Link>

          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-[#111111] transition hover:bg-neutral-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}