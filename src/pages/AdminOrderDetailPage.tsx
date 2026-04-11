import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchOrder, takePayment } from "../admin/api";
import { clearAuthSession } from "../admin/session";
import { useAuth } from "../context/AuthContext";
import type { AdminOrder } from "../admin/types";

function formatMoney(value?: number) {
  return `£${(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminOrderDetailPage() {
  const { orderNumber = "" } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const loginPath = user?.role === "reseller" ? "/resell/login" : "/admin/login";
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentReference, setPaymentReference] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [notes, setNotes] = useState("");
  const [completeOrder, setCompleteOrder] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await fetchOrder(orderNumber);
        setOrder(result);
        setAmountPaid(String(result.subtotal ?? 0));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load order.";
        setError(message);
        if (message.includes("sign in again")) {
          clearAuthSession();
          navigate(loginPath, { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    void loadOrder();
  }, [navigate, orderNumber]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!order) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const updated = await takePayment(order.orderNumber, {
        paymentMethod,
        paymentReference,
        amountPaid: Number(amountPaid),
        notes,
        completeOrder,
      });

      setOrder(updated);
      setNotes("");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Unable to update payment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 text-zinc-500 shadow-sm">
          Loading order...
        </div>
      </section>
    );
  }

  if (error && !order) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 text-zinc-500 shadow-sm">
          Order not found.
        </div>
      </section>
    );
  }

  const customerDetails = order.customerDetails ?? {};
  const deliveryDetails = order.deliveryDetails ?? {};
  const doors = Array.isArray(order.doors) ? order.doors : [];

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to={user?.role === "reseller" ? "/resell" : "/admin"}
            className="text-sm font-semibold text-zinc-500 hover:text-zinc-900"
          >
            ← Back to admin list
          </Link>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            {order.orderNumber || orderNumber}
          </h1>
          <p className="mt-3 text-base text-zinc-600">
            Open the quote, review the configuration, and record payment.
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-sm text-zinc-500">Quote ref</p>
                <p className="mt-2 font-semibold text-zinc-900">
                  {order.quoteRef || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Order status</p>
                <p className="mt-2 font-semibold capitalize text-zinc-900">
                  {order.orderStatus}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Payment status</p>
                <p className="mt-2 font-semibold capitalize text-zinc-900">
                  {order.paymentStatus || "unpaid"}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Subtotal</p>
                <p className="mt-2 font-semibold text-zinc-900">
                  {formatMoney(order.subtotal)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              Customer details
            </h2>
            {Object.keys(customerDetails).length > 0 ? (
              <dl className="mt-4 grid gap-4 md:grid-cols-2">
                {Object.entries(customerDetails).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm text-zinc-500">{key}</dt>
                    <dd className="mt-1 text-sm font-medium text-zinc-900">
                      {value || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">
                No customer details stored for this order.
              </p>
            )}
          </div>

          <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Doors</h2>
            <div className="mt-4 space-y-4">
              {doors.map((door, index) => (
                <div
                  key={`${door.DoorRef}-${index}`}
                  className="rounded-2xl border border-zinc-200 p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-semibold text-zinc-900">
                        {door.Title}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        Ref: {door.DoorRef}
                      </p>
                    </div>
                    <div className="text-sm text-zinc-600">
                      Qty {door.Quantity} · Unit price{" "}
                      {formatMoney(door.UnitPrice)}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {Object.entries(door.Selections ?? {}).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="rounded-xl bg-zinc-50 px-3 py-2 text-sm"
                        >
                          <span className="text-zinc-500">{key}: </span>
                          <span className="font-medium text-zinc-900">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  {door.TechnicalNotes?.length ? (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-zinc-900">
                        Technical notes
                      </p>
                      <ul className="mt-2 space-y-2 text-sm text-zinc-600">
                        {door.TechnicalNotes.map((note) => (
                          <li key={note}>• {note}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              Delivery details
            </h2>
            {Object.keys(deliveryDetails).length > 0 ? (
              <dl className="mt-4 grid gap-4 md:grid-cols-2">
                {Object.entries(deliveryDetails).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm text-zinc-500">{key}</dt>
                    <dd className="mt-1 text-sm font-medium text-zinc-900">
                      {typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : value || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">
                No delivery details stored for this order.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              Stored payment snapshot
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500">Cardholder</dt>
                <dd className="font-medium text-zinc-900">
                  {order.payment?.cardholderName || "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500">Card</dt>
                <dd className="font-medium text-zinc-900">
                  {order.payment?.cardNumber || "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500">Expiry</dt>
                <dd className="font-medium text-zinc-900">
                  {order.payment?.expiry || "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500">Paid at</dt>
                <dd className="font-medium text-zinc-900">
                  {formatDate(order.paidAt)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500">Completed at</dt>
                <dd className="font-medium text-zinc-900">
                  {formatDate(order.completedAt)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              Take payment
            </h2>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800">
                  Payment method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                >
                  <option value="card">Card</option>
                  <option value="bank-transfer">Bank transfer</option>
                  <option value="phone-payment">Phone payment</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800">
                  Reference
                </label>
                <input
                  value={paymentReference}
                  onChange={(event) => setPaymentReference(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                  placeholder="Transaction reference or receipt number"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800">
                  Amount paid
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountPaid}
                  onChange={(event) => setAmountPaid(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800">
                  Admin note
                </label>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                  placeholder="Add a note about how payment was taken or any internal comment"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={completeOrder}
                  onChange={(event) => setCompleteOrder(event.target.checked)}
                />
                Mark order as completed
              </label>

              {submitError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Record payment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}