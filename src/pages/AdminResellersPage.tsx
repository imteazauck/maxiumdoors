import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ensureResellerStore, deleteReseller, listResellers } from "../resellers/storage";
import type { Reseller } from "../resellers/types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    dateStyle: "medium",
  });
}

export default function AdminResellersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [resellers, setResellers] = useState<Reseller[]>([]);

  const load = () => {
    ensureResellerStore();
    setResellers(listResellers());
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return resellers;
    }

    return resellers.filter((item) => [
      item.companyName,
      item.firstName,
      item.lastName,
      item.email,
      item.tel,
      item.mobile,
    ].join(" ").toLowerCase().includes(term));
  }, [resellers, search]);

  const handleDelete = (resellerId: string) => {
    const reseller = resellers.find((item) => item.id === resellerId);
    if (!reseller) return;

    const confirmed = window.confirm(`Delete ${reseller.companyName} and all of its reseller pricing?`);
    if (!confirmed) return;

    deleteReseller(resellerId);
    load();
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Admin panel</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">Reseller management</h1>
          <p className="mt-4 max-w-3xl text-base text-zinc-600">
            Add resellers, clone the default price template, and then fine-tune each reseller's own matrix.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
          >
            Back to dashboard
          </button>
          <Link
            to="/admin/resellers/new"
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Add reseller
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by company, contact, email, or phone"
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          />
          <button
            type="button"
            onClick={load}
            className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
          >
            Refresh
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
            <thead>
              <tr className="text-zinc-500">
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Primary contact</th>
                <th className="px-4 py-3 font-medium">Contact details</th>
                <th className="px-4 py-3 font-medium">Template</th>
                <th className="px-4 py-3 font-medium">Login</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-zinc-500" colSpan={7}>
                    No resellers match the current search.
                  </td>
                </tr>
              ) : (
                filtered.map((reseller) => (
                  <tr key={reseller.id} className="align-top">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-zinc-900">{reseller.companyName}</div>
                      <div className="mt-1 text-zinc-500">{reseller.businessAddress || "No address added"}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-zinc-900">{[reseller.firstName, reseller.lastName].filter(Boolean).join(" ") || "No contact"}</div>
                      <div className="mt-1 text-zinc-500">{reseller.notes || "No notes"}</div>
                    </td>
                    <td className="px-4 py-4 text-zinc-600">
                      <div>{reseller.email || "No email"}</div>
                      <div className="mt-1">Tel: {reseller.tel || "—"}</div>
                      <div className="mt-1">Mobile: {reseller.mobile || "—"}</div>
                    </td>
                    <td className="px-4 py-4 text-zinc-600">
                      <div>{reseller.sourceTemplateId}</div>
                      <div className="mt-1">Pricing cloned: {reseller.pricingInitialized ? "Yes" : "No"}</div>
                    </td>
                    <td className="px-4 py-4 text-zinc-600">
                      <div>{reseller.credentials.loginEnabled ? "Enabled" : "Disabled"}</div>
                      <div className="mt-1">{reseller.credentials.loginEmail || "No login email"}</div>
                    </td>
                    <td className="px-4 py-4 text-zinc-600">{formatDate(reseller.createdAt)}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/admin/resellers/${encodeURIComponent(reseller.id)}/edit`}
                          className="inline-flex rounded-full border border-zinc-300 px-4 py-2 font-semibold text-zinc-900 transition hover:bg-zinc-50"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/admin/resellers/${encodeURIComponent(reseller.id)}/pricing`}
                          className="inline-flex rounded-full bg-black px-4 py-2 font-semibold text-white transition hover:opacity-90"
                        >
                          Price matrix
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(reseller.id)}
                          className="inline-flex rounded-full border border-red-200 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
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
