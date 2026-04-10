import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getReseller, getResellerPricing, updatePricingItem } from "../resellers/storage";
import type { MatrixPricingRow, OptionPricingRow, ResellerPricingItem } from "../resellers/types";

function formatMoney(value: number) {
  return `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function widthLabel(item: OptionPricingRow) {
  if (!item.widthMin || !item.widthMax) {
    return "All widths";
  }

  return `${item.widthMin}-${item.widthMax} mm`;
}

function PriceInput({ item }: { item: ResellerPricingItem }) {
  const [value, setValue] = useState(item.price.toFixed(2));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const nextPrice = Number.parseFloat(value);
    if (!Number.isFinite(nextPrice) || nextPrice < 0) {
      return;
    }

    updatePricingItem(item.resellerId, item.id, Number(nextPrice.toFixed(2)));
    setValue(nextPrice.toFixed(2));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-28 rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-zinc-400"
        inputMode="decimal"
      />
      <button
        type="button"
        onClick={handleSave}
        className="rounded-full border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-50"
      >
        Save
      </button>
      {saved ? <span className="text-xs text-emerald-600">Saved</span> : null}
    </div>
  );
}

export default function AdminResellerPricingPage() {
  const params = useParams<{ resellerId: string }>();
  const reseller = useMemo(() => (params.resellerId ? getReseller(params.resellerId) : null), [params.resellerId]);
  const pricing = useMemo(() => (params.resellerId ? getResellerPricing(params.resellerId) : []), [params.resellerId]);
  const [configurationFilter, setConfigurationFilter] = useState<"all" | "single" | "double">("all");

  if (!params.resellerId || !reseller) {
    return <Navigate to="/admin/resellers" replace />;
  }

  const matrixRows = pricing.filter((item): item is MatrixPricingRow => item.type === "matrixRow" && (configurationFilter === "all" || item.configuration === configurationFilter));
  const optionRows = pricing.filter((item): item is OptionPricingRow => item.type === "optionRow" && (configurationFilter === "all" || item.configuration === configurationFilter));

  const groupedOptions = optionRows.reduce<Record<string, OptionPricingRow[]>>((accumulator, item) => {
    const key = item.group;
    accumulator[key] ??= [];
    accumulator[key].push(item);
    return accumulator;
  }, {});

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Admin panel</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">{reseller.companyName} price matrix</h1>
          <p className="mt-4 max-w-3xl text-base text-zinc-600">
            This reseller matrix was cloned from the default template when the account was created and can now be edited independently.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/admin/resellers/${encodeURIComponent(reseller.id)}/edit`}
            className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
          >
            Edit reseller
          </Link>
          <Link
            to="/admin/resellers"
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Back to resellers
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Matrix rows</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">{pricing.filter((item) => item.type === "matrixRow").length}</p>
        </div>
        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Options and hardware</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">{pricing.filter((item) => item.type === "optionRow").length}</p>
        </div>
        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Template source</p>
          <p className="mt-2 text-lg font-semibold text-zinc-900">{reseller.sourceTemplateId}</p>
        </div>
        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Configuration view</p>
          <select
            value={configurationFilter}
            onChange={(event) => setConfigurationFilter(event.target.value as typeof configurationFilter)}
            className="mt-3 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          >
            <option value="all">All</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
          </select>
        </div>
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Base pricing</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Door size matrix</h2>
          </div>
          <div className="text-sm text-zinc-500">Edit any price and save inline.</div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
            <thead>
              <tr className="text-zinc-500">
                <th className="px-4 py-3 font-medium">Configuration</th>
                <th className="px-4 py-3 font-medium">Height range</th>
                <th className="px-4 py-3 font-medium">Width range</th>
                <th className="px-4 py-3 font-medium">Current price</th>
                <th className="px-4 py-3 font-medium">New price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {matrixRows.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4 capitalize text-zinc-900">{item.configuration}</td>
                  <td className="px-4 py-4 text-zinc-600">{item.heightMin}-{item.heightMax} mm</td>
                  <td className="px-4 py-4 text-zinc-600">{item.widthMin}-{item.widthMax} mm</td>
                  <td className="px-4 py-4 font-medium text-zinc-900">{formatMoney(item.price)}</td>
                  <td className="px-4 py-4"><PriceInput item={item} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {Object.entries(groupedOptions).map(([group, items]) => (
        <div key={group} className="mt-8 rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Options</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-900">{group}</h2>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
              <thead>
                <tr className="text-zinc-500">
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Configuration</th>
                  <th className="px-4 py-3 font-medium">Width band</th>
                  <th className="px-4 py-3 font-medium">Current price</th>
                  <th className="px-4 py-3 font-medium">New price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4 text-zinc-900">{item.label}</td>
                    <td className="px-4 py-4 capitalize text-zinc-600">{item.configuration}</td>
                    <td className="px-4 py-4 text-zinc-600">{widthLabel(item)}</td>
                    <td className="px-4 py-4 font-medium text-zinc-900">{formatMoney(item.price)}</td>
                    <td className="px-4 py-4"><PriceInput item={item} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </section>
  );
}
