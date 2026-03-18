export default function HelpCentrePage() {
  const items = [
    {
      title: "How to measure",
      text: "Add a measuring guide with structural opening, finished floor level, and tolerance notes.",
    },
    {
      title: "Colour choices",
      text: "Explain standard and bespoke finishes, swatches, and powder coating expectations.",
    },
    {
      title: "Lead times",
      text: "Use this panel for production estimates, delivery windows, and installation planning.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-500">Help Centre</p>
      <h2 className="mt-3 text-3xl font-bold">Buying guidance</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="rounded-[1.5rem] border border-zinc-200 bg-[#fafaf8] p-6">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}