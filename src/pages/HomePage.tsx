import { Link } from "react-router-dom";
import DoorDrawing from "../components/DoorDrawing";
import { featuredProducts } from "../data/products";

export default function HomePage() {
  return (
    <>
      <section className="border-b border-zinc-200 bg-[#f7f7f5]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-500">
              Quality internal slim steel doors & screens
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Maximum light.
              <br />
              Minimal frames.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg">
              Trade Steel Doors offers a range of high-quality steel and aluminium doors for commercial and industrial applications. Our products are designed to provide maximum light and minimal frames, making them perfect for a variety of settings. Whether you're looking for a single door, double door, or custom solution, we have the expertise and experience to help you find the perfect fit for your project.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Shop featured doors
              </Link>
              <Link
                to="/help-centre"
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
              >
                Explore help centre
              </Link>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex h-[300px] items-center justify-center rounded-[1.5rem] border border-zinc-200 bg-zinc-100 sm:h-[380px]">
                <DoorDrawing type="single" frameClass="border-zinc-900 bg-zinc-900" />
              </div>
              <p className="mt-4 text-sm font-medium text-zinc-500">Single door</p>
              <h3 className="mt-1 text-lg font-semibold">F4-inspired steel door</h3>
            </div>

            <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex h-[300px] items-center justify-center rounded-[1.5rem] border border-zinc-200 bg-zinc-100 sm:h-[380px]">
                <DoorDrawing type="double" frameClass="border-zinc-900 bg-zinc-900" />
              </div>
              <p className="mt-4 text-sm font-medium text-zinc-500">Double door</p>
              <h3 className="mt-1 text-lg font-semibold">F3-inspired steel door</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-500">Featured products</p>
            <h3 className="mt-3 text-3xl font-bold">Integrated door products</h3>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {featuredProducts.map((product) => (
            <article key={product.id} className="rounded-[2rem] border border-zinc-200 bg-[#fafaf8] p-6 shadow-sm">
              <div className="grid gap-6 md:grid-cols-[240px_1fr] md:items-center">
                <div className="flex h-85 items-center justify-center rounded-[1.5rem] border border-zinc-200 bg-white">
                  <DoorDrawing type={product.galleryType} frameClass="border-zinc-900 bg-zinc-900" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500">{product.category}</p>
                  <h4 className="mt-2 text-2xl font-semibold">{product.name}</h4>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{product.shortDescription}</p>
                  <p className="mt-4 text-lg font-semibold">{product.price}</p>
                  <Link
                    to={`/product/${product.slug}`}
                    className="mt-5 inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
                  >
                    View product
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}