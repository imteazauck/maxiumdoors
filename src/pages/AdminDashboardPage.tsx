import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchOrders } from "../admin/api";
import type { OrderSummary } from "../admin/types";
import { useAuth } from "../context/AuthContext";


function formatMoney(value?: number | null) {
  const amount = typeof value === "number" ? value : 0;
  return `£${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [status, setStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const results = await fetchOrders({ status, paymentStatus, search: search.trim() || undefined });
      setOrders(results);
    }
    catch (err) {
     const message = err instanceof Error ? err.message : "Unable to load orders.";

      if (message.toLowerCase().includes("unauthorized")) {
        logout();
        navigate("/admin/login", { replace: true });
        return;
      }

      setError(message);

      if (message.includes("sign in again")) {
        navigate("/admin/login", { replace: true });
      }
    } 
    finally {
        setLoading(false);
      }
  };

useEffect(() => {
  if (!isAuthenticated) return;

  void loadOrders();
}, [status, paymentStatus, isAuthenticated]);

  const summary = useMemo(() => {
    const pendingCount = orders.filter((order) => order.orderStatus === "pending").length;
    const paidCount = orders.filter((order) => order.paymentStatus === "paid").length;
    return { pendingCount, paidCount, total: orders.length };
  }, [orders]);

const handleLogout = () => {
  logout();
  navigate("/admin/login", { replace: true });
};

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Admin panel</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">Order control</h1>
          <p className="mt-4 max-w-3xl text-base text-zinc-600">
            Review pending quotes, open an order, record payment, and complete the job from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/resellers"
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Manage resellers
          </Link>
          <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 shadow-sm">
            Signed in as <span className="font-semibold text-zinc-900">{user?.displayName}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Loaded orders</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">{summary.total}</p>
        </div>
        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Pending in view</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">{summary.pendingCount}</p>
        </div>
        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Paid in view</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">{summary.paidCount}</p>
        </div>
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by order, quote, customer, or email"
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="all">All statuses</option>
          </select>

          <select
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value)}
            className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          >
            <option value="all">All payments</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>

          <button
            type="button"
            onClick={() => void loadOrders()}
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Refresh
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
            <thead>
              <tr className="text-zinc-500">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-zinc-500" colSpan={6}>
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-zinc-500" colSpan={6}>
                    No orders match the current filter.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderNumber} className="align-top">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-zinc-900">{order.orderNumber}</div>
                      <div className="mt-1 text-zinc-500">{order.quoteRef || "No quote ref"}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-zinc-900">{order.customerName}</div>
                      <div className="mt-1 text-zinc-500">{order.companyName}</div>
                      <div className="mt-1 text-zinc-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700">
                        {order.orderStatus}
                      </div>
                      <div className="mt-2 text-zinc-500">Payment: {order.paymentStatus || "unpaid"}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-zinc-900">{formatMoney(order.subtotal)}</div>
                      <div className="mt-1 text-zinc-500">{order.doorCount} door(s)</div>
                    </td>
                    <td className="px-4 py-4 text-zinc-600">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/admin/orders/${encodeURIComponent(order.orderNumber)}`}
                        className="inline-flex rounded-full border border-zinc-300 px-4 py-2 font-semibold text-zinc-900 transition hover:bg-zinc-50"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
