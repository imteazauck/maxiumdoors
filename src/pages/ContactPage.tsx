export default function ContactPage() {
  return (
    <section className="border-t border-zinc-200 bg-[#f7f7f5]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 sm:p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-500">Get in touch</p>
          <h2 className="mt-3 text-3xl font-bold">Need help choosing the right door?</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Use this enquiry section for quote requests, showroom questions, or next-step consultation.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <input className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm outline-none" placeholder="Name" />
            <input className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm outline-none" placeholder="Email" />
            <input className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm outline-none" placeholder="Project type" />
          </div>

          <textarea
            className="mt-4 min-h-[140px] w-full rounded-[1.5rem] border border-zinc-300 bg-white px-5 py-4 text-sm outline-none"
            placeholder="Tell us which door style you want and any dimensions or layout notes."
          />

          <button className="mt-5 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
            Send enquiry
          </button>
        </div>
      </div>
    </section>
  );
}