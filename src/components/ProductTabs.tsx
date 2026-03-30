import { useState } from "react";
import type { Product, TabKey } from "../data/products";
import { renderStars } from "../data/products";

export default function ProductTabs({ product }: { product: Product }) {
  const [selectedTab, setSelectedTab] = useState<TabKey>("description");

  return (
    <div className="mt-10 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 p-3 sm:p-4">
        {([
          ["description", "Description"],
          ["specs", "Specifications"],
          ["reviews", `Reviews (${product.reviews.length})`],
        ] as [TabKey, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedTab(key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedTab === key ? "bg-black text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        {selectedTab === "description" && (
          <div className="max-w-4xl">
            <h3 className="text-xl font-semibold">Product description</h3>
            <p className="mt-4 text-sm leading-7 text-zinc-600">{product.longDescription}</p>
          </div>
        )}

        {selectedTab === "specs" && (
          <div>
            <h3 className="text-xl font-semibold">Technical summary</h3>
            <div className="mt-5 divide-y divide-zinc-200 overflow-hidden rounded-[1.25rem] border border-zinc-200">
              {product.specs.map((spec) => (
                <div key={spec.label} className="grid gap-2 bg-white px-5 py-4 sm:grid-cols-[220px_1fr]">
                  <div className="text-sm font-semibold text-zinc-900">{spec.label}</div>
                  <div className="text-sm text-zinc-600">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "reviews" && (
          <div>
            <h3 className="text-xl font-semibold">Customer reviews</h3>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {product.reviews.map((review) => (
                <div key={review.author} className="rounded-[1.25rem] border border-zinc-200 bg-[#fafaf8] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold">{review.author}</span>
                    <span className="text-sm text-zinc-600">{renderStars(review.rating)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}