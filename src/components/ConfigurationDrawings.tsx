import type { ConfigurationDrawing } from "../data/pricingTypes";

export default function ConfigurationDrawings({ drawings }: { drawings: ConfigurationDrawing[] }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">Configuration drawings</p>
      <h3 className="mt-2 text-2xl font-semibold">Available layouts</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
        The client has confirmed that each available door configuration will have its own drawing. The cards below are ready for database-backed drawing assets later.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {drawings.map((drawing) => (
          <article key={drawing.id} className="rounded-[1.25rem] border border-zinc-200 bg-[#fafaf8] p-4">
            <div className="flex aspect-[4/3] items-center justify-center rounded-[1rem] border border-zinc-200 bg-white p-4">
              <div className="text-center">
                <p className="text-sm font-semibold text-zinc-900">Drawing placeholder</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{drawing.configurationCode}</p>
              </div>
            </div>
            <p className="mt-3 text-sm font-medium text-zinc-900">{drawing.configurationCode}</p>
            <p className="mt-1 text-sm text-zinc-600">{drawing.alt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}