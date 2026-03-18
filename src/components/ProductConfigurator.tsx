import { useMemo, useState } from "react";
import type { Product } from "../data/products";
import { colourOptions } from "../data/products";

export default function ProductConfigurator({ product }: { product: Product }) {
  const [width, setWidth] = useState(product.galleryType === "double" ? 1800 : 900);
  const [height, setHeight] = useState(2100);
  const [selectedColour, setSelectedColour] = useState(colourOptions[0].name);

  const estimatedPrice = useMemo(() => {
    const widthFactor = Math.max(0, width - (product.galleryType === "double" ? 1800 : 900)) * 0.45;
    const heightFactor = Math.max(0, height - 2100) * 0.35;
    const colourFactor = selectedColour === "Jet Black" ? 0 : selectedColour === "Anthracite" ? 90 : 120;
    return Math.round(product.basePrice + widthFactor + heightFactor + colourFactor);
  }, [height, product.basePrice, product.galleryType, selectedColour, width]);

  return (
    <div className="mt-8 rounded-[1.5rem] border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <h5 className="text-base font-semibold">Door configurator</h5>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Estimate
        </span>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">Width (mm)</span>
          <input
            type="range"
            min={product.galleryType === "double" ? 1400 : 700}
            max={product.galleryType === "double" ? 2400 : 1100}
            step={50}
            value={width}
            onChange={(event) => setWidth(Number(event.target.value))}
            className="w-full"
          />
          <div className="mt-2 rounded-full border border-zinc-200 px-4 py-2 text-sm">{width} mm</div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">Height (mm)</span>
          <input
            type="range"
            min={1900}
            max={3000}
            step={50}
            value={height}
            onChange={(event) => setHeight(Number(event.target.value))}
            className="w-full"
          />
          <div className="mt-2 rounded-full border border-zinc-200 px-4 py-2 text-sm">{height} mm</div>
        </label>
      </div>

      <div className="mt-5">
        <span className="mb-3 block text-sm font-medium text-zinc-700">Colour</span>
        <div className="flex flex-wrap gap-3">
          {colourOptions.map((colour) => (
            <button
              key={colour.name}
              onClick={() => setSelectedColour(colour.name)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                selectedColour === colour.name
                  ? "border-black bg-black text-white"
                  : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: colour.swatch }} />
              {colour.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-[1.25rem] border border-zinc-200 bg-[#fafaf8] p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-600">Estimated configured price</span>
          <span className="text-2xl font-bold">£{estimatedPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}