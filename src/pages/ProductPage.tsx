import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ConfigurationDrawings from "../components/ConfigurationDrawings";
import DoorDrawing from "../components/DoorDrawing";
import PricingMatrixTable from "../components/pricingMatrixTables";
import ProductConfigurator from "../components/ProductConfigurator";
import ProductTabs from "../components/ProductTabs";
import { useCart } from "../context/CartContext";
import { colourOptions, products } from "../data/products";
import { pricingMatrices } from "../data/pricingMatrices";

export default function ProductPage() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug) ?? products[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColour, setSelectedColour] = useState(colourOptions[0].name);
  const { addItem } = useCart();

  const selectedColourData = useMemo(
    () => colourOptions.find((colour) => colour.name === selectedColour) ?? colourOptions[0],
    [selectedColour]
  );

  const matrix = pricingMatrices.find((item) => item.productSlug === product.slug);
  const galleryVariants = [0, 1, 2, 3];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="mb-8 text-sm text-zinc-500">
        <Link to="/shop" className="hover:underline">Shop</Link> / <span>{product.name}</span>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 xl:grid-cols-2 xl:items-start">
        <div className="space-y-6 xl:flex xl:justify-center">
          <div className="w-full max-w-[40rem] overflow-hidden rounded-[2rem] border border-zinc-200 bg-[#fafaf8] shadow-sm">
            <div className="flex min-h-[24rem] items-center justify-center border-b border-zinc-200 bg-white p-6 sm:min-h-[520px]">
              <DoorDrawing
                type={product.galleryType}
                frameClass={selectedColourData.frameClass}
                variant={selectedImageIndex}
              />
            </div>

            <div className="grid grid-cols-4 gap-3 p-4 sm:p-5">
              {galleryVariants.map((variant) => (
                <button
                  key={variant}
                  onClick={() => setSelectedImageIndex(variant)}
                  className={`flex h-24 items-center justify-center rounded-[1rem] border bg-white transition sm:h-28 ${
                    selectedImageIndex === variant ? "border-black" : "border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  <div className="scale-[0.28] sm:scale-[0.34]">
                    <DoorDrawing
                      type={product.galleryType}
                      frameClass={selectedColourData.frameClass}
                      variant={variant}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[40rem] rounded-[2rem] border border-zinc-200 bg-[#fafaf8] p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-zinc-500">{product.category}</p>
          <h2 className="mt-2 text-3xl font-semibold">{product.name}</h2>
          <p className="mt-4 text-lg font-semibold text-zinc-900">
            {product.price} <span className="text-sm font-normal text-zinc-500">ex. VAT</span>
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-600">{product.shortDescription}</p>

          <div className="mt-5">
            <span className="mb-3 block text-sm font-medium text-zinc-700">Preview colour</span>
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
                  <span
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ backgroundColor: colour.swatch }}
                  />
                  {colour.name}
                </button>
              ))}
            </div>
          </div>

          <ProductConfigurator product={product} />

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => addItem({ product, colour: selectedColour })}
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Add to basket
            </button>
            <button className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white">
              Request quote
            </button>
          </div>
        </div>
      </div>

      {matrix && <PricingMatrixTable matrix={matrix} />}
      {matrix && <ConfigurationDrawings drawings={matrix.drawings} />}
      <ProductTabs product={product} />
    </section>
  );
}