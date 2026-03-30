import {type FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

type PortalRole = "client" | "estimator";

export default function PortalLoginPage() {
  const { role } = useParams<{ role: PortalRole }>();
  const navigate = useNavigate();

  const safeRole = useMemo<PortalRole>(() => {
    return role === "estimator" ? "estimator" : "client";
  }, [role]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const title =
    safeRole === "client" ? "Client Login" : "Estimator Login";

  const subtitle =
    safeRole === "client"
      ? "Sign in to start a quote and review your orders."
      : "Sign in to manage quotes and prepare configurations.";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    localStorage.setItem(
      "portalSession",
      JSON.stringify({
        role: safeRole,
        email,
        loggedInAt: new Date().toISOString(),
      })
    );

    navigate("/portal/dashboard");
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Order Online
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
          {title}
        </h1>

        <p className="mt-4 text-base text-zinc-600">{subtitle}</p>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Continue
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between gap-4 text-sm text-zinc-600">
          <Link to="/order-online" className="hover:text-zinc-900">
            ← Back to role choice
          </Link>

          <span className="text-right">
            Demo flow for now
          </span>
        </div>
      </div>
    </section>
  );
}