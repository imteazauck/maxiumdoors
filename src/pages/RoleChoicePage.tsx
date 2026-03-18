import { Link } from "react-router-dom";

export default function RoleChoicePage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Order Online
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
          How would you like to continue?
        </h1>
        <p className="mt-4 text-base text-zinc-600">
          Choose whether you are ordering as a client or working as an estimator.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Link
          to="/portal/login/client"
          className="rounded-[1.5rem] border border-zinc-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <h2 className="text-2xl font-semibold text-zinc-900">Client</h2>
          <p className="mt-3 text-zinc-600">
            Start a new quote, enter project details, and review your order.
          </p>
          <span className="mt-6 inline-flex text-sm font-semibold text-zinc-900">
            Continue as client →
          </span>
        </Link>

        <Link
          to="/portal/login/estimator"
          className="rounded-[1.5rem] border border-zinc-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <h2 className="text-2xl font-semibold text-zinc-900">Estimator</h2>
          <p className="mt-3 text-zinc-600">
            Access the estimator workflow, manage quotes, and prepare configurations.
          </p>
          <span className="mt-6 inline-flex text-sm font-semibold text-zinc-900">
            Continue as estimator →
          </span>
        </Link>
      </div>
    </section>
  );
}