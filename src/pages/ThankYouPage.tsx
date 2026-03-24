import { CheckCircle2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import type { OrderConfirmation } from "../services/orderApi";

function formatMoney(value: number) {
  return `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ThankYouPage() {
  const rawConfirmation = sessionStorage.getItem("lastOrderConfirmation");

  if (!rawConfirmation) {
    return <Navigate to="/" replace />;
  }

  const confirmation = JSON.parse(rawConfirmation) as OrderConfirmation;

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-[#D7D7D7] bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1E6] text-[#F47A20]">
          <CheckCircle2 size={34} strokeWidth={1.8} />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#6B6B6B]">Thank you</p>
        <h1 className="mt-2 text-4xl font-semibold text-[#111111]">Your order has been received</h1>
        <p className="mt-4 text-sm leading-7 text-[#2A2A2A]">
          We have saved your order for <span className="font-semibold">{confirmation.customerName}</span>. A confirmation can be sent to <span className="font-semibold">{confirmation.email}</span> when the live backend and payment flow are connected.
        </p>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[#D7D7D7] bg-[#FFF9F4] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">Order number</p>
            <p className="mt-2 text-2xl font-semibold text-[#111111]">{confirmation.orderId}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[#D7D7D7] bg-[#FFF9F4] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">Quote reference</p>
            <p className="mt-2 text-2xl font-semibold text-[#111111]">{confirmation.quoteRef}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[#D7D7D7] bg-[#FFF9F4] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">Doors ordered</p>
            <p className="mt-2 text-2xl font-semibold text-[#111111]">{confirmation.doorCount}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[#D7D7D7] bg-[#FFF9F4] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">Amount saved</p>
            <p className="mt-2 text-2xl font-semibold text-[#F47A20]">{formatMoney(confirmation.subtotal)}</p>
          </div>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-[#D7D7D7] bg-[#FAFAFA] p-5 text-left">
          <p className="text-sm font-semibold text-[#111111]">Payment summary</p>
          <p className="mt-2 text-sm text-[#2A2A2A]">Card ending in {confirmation.paymentLast4}</p>
          <p className="mt-1 text-sm text-[#2A2A2A]">Saved on {new Date(confirmation.createdAt).toLocaleString()}</p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/" className="rounded-full bg-[#F47A20] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#D96510]">
            Start a new quote
          </Link>
          <Link to="/order-online/summary" className="rounded-full border border-[#D7D7D7] px-6 py-3 text-sm font-semibold text-[#111111] transition hover:bg-[#FFF6EE]">
            View summary page
          </Link>
        </div>
      </div>
    </section>
  );
}
