import { Link } from "react-router-dom";
import DoorDrawing from "../components/DoorDrawing";
import { shopProducts } from "../data/products";

export default function ShopPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-500">Shop</p>
        <h2 className="mt-3 text-3xl font-bold">All doors</h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600">
          Browse our range of quality steel and aluminium doors for commercial and industrial applications.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {shopProducts.map((door, index) => (
          <article key={door.id} className="rounded-[1.6rem] border border-zinc-200 bg-[#fafaf8] p-5 shadow-sm">
            <div className="relative flex h-52 items-center justify-center rounded-[1.25rem] border border-zinc-200 bg-white">
              {door.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                  {door.badge}
                </span>
              )}
              <div className="scale-[0.55]">
                <DoorDrawing type={door.galleryType} frameClass="border-zinc-900 bg-zinc-900" variant={index} />
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-500">{door.category}</p>
            <h4 className="mt-1 text-lg font-semibold">{door.name}</h4>
            <p className="mt-2 text-sm text-zinc-600">{door.price} ex. VAT</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{door.shortDescription}</p>
            <Link to={`/product/${door.slug}`} className="mt-4 inline-block text-sm font-semibold text-zinc-900 hover:underline">
              View product
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}