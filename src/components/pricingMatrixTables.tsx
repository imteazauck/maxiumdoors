import type { ProductPricingMatrix } from "../data/pricingTypes";

function formatPrice(value: number) {
  return `£${value.toFixed(2)}`;
}

export default function PricingMatrixTable({ matrix }: { matrix: ProductPricingMatrix }) {
  const groupedOptions = matrix.options.reduce<Record<string, typeof matrix.options>>((acc, option) => {
    if (!acc[option.category]) acc[option.category] = [];
    acc[option.category].push(option);
    return acc;
  }, {});

  return (
    <section className="mt-10 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">Pricing matrix</p>
          <h3 className="mt-2 text-2xl font-semibold">{matrix.title}</h3>
          <p className="mt-2 text-sm text-zinc-600">
            {matrix.mode === "single" ? "Single door" : "Double door"} · {matrix.vatMode === "ex_vat" ? "Ex. VAT" : "Inc. VAT"}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[1.25rem] border border-zinc-200">
        <table className="min-w-full text-sm">
          <thead className="bg-[#fafaf8] text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-zinc-900">Width band (mm)</th>
              <th className="px-4 py-3 font-semibold text-zinc-900">Base price</th>
            </tr>
          </thead>
          <tbody>
            {matrix.bands.map((band) => (
              <tr key={band.code} className="border-t border-zinc-200 bg-white">
                <td className="px-4 py-3 text-zinc-700">{band.code}</td>
                <td className="px-4 py-3 font-medium text-zinc-900">{formatPrice(band.basePrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {Object.entries(groupedOptions).map(([category, items]) => (
          <div key={category} className="rounded-[1.25rem] border border-zinc-200 bg-[#fafaf8] p-5">
            <h4 className="text-base font-semibold capitalize">{category}</h4>
            <div className="mt-4 space-y-3">
              {items.map((option) => (
                <div key={option.id} className="flex items-start justify-between gap-4 rounded-[1rem] border border-zinc-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{option.label}</p>
                    {option.priceModel && (
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">{option.priceModel}</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-zinc-900">{formatPrice(option.price)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}