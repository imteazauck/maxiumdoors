import { Link, Navigate } from "react-router-dom";

type StoredSession = {
  role: "client" | "estimator";
  email: string;
  loggedInAt: string;
};

function getSession(): StoredSession | null {
  const raw = localStorage.getItem("portalSession");

  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export default function PortalDashboardPage() {
  const session = getSession();

  if (!session) {
    return <Navigate to="/order-online" replace />;
  }

  const portalTitle =
    session.role === "client" ? "Client Dashboard" : "Estimator Dashboard";

  const portalText =
    session.role === "client"
      ? "Start a new quote, review saved quotes, and continue your online order."
      : "Manage quotes, prepare door configurations, and support client orders.";

  const handleLogout = () => {
    localStorage.removeItem("portalSession");
    window.location.href = "/order-online";
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Portal
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            {portalTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-600">
            {portalText}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/portal/quotes/new"
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            New Quote
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Signed in as</h2>
          <p className="mt-3 text-sm text-zinc-600">{session.email}</p>
          <p className="mt-2 text-sm capitalize text-zinc-600">
            Role: {session.role}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Quotes</h2>
          <p className="mt-3 text-sm text-zinc-600">
            Saved quote management can be added here next.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Next step</h2>
          <p className="mt-3 text-sm text-zinc-600">
            Wire the 4-step quote wizard to <code>/portal/quotes/new</code>.
          </p>
        </div>
      </div>
    </section>
  );
}