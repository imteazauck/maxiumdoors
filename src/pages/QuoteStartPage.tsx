import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuote, type CustomerDetails } from "../context/QuoteContext";

export default function QuoteStartPage() {
  const navigate = useNavigate();
  const { quoteRef, startQuote, customerDetails } = useQuote();
  const [form, setForm] = useState<CustomerDetails>(
    customerDetails ?? {
      customerName: "",
      companyName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postcode: "",
    }
  );

  const isValid = useMemo(
    () =>
      Boolean(
        form.customerName &&
          form.email &&
          form.phone &&
          form.addressLine1 &&
          form.city &&
          form.postcode
      ),
    [form]
  );

  function update<K extends keyof CustomerDetails>(key: K, value: CustomerDetails[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    startQuote(form);
    navigate("/order-online/configure");
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-[#DCE5DD] bg-[#F8FAF8] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8A908C]">Online order</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#40584A]">Start a new quote</h1>
          <p className="mt-4 text-sm leading-7 text-[#4B4F4C]">
            Before the configurator, capture the customer and site details for this enquiry. A quote reference has already been generated for this session.
          </p>

          <div className="mt-8 rounded-[1.5rem] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8A908C]">Quote reference</p>
            <p className="mt-2 text-2xl font-semibold text-[#40584A]">{quoteRef}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#DCE5DD] bg-white p-8 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Customer name" value={form.customerName} onChange={(value) => update("customerName", value)} required />
            <Field label="Company name" value={form.companyName ?? ""} onChange={(value) => update("companyName", value)} />
            <Field label="Email" type="email" value={form.email} onChange={(value) => update("email", value)} required />
            <Field label="Phone" value={form.phone} onChange={(value) => update("phone", value)} required />
            <Field label="Address line 1" value={form.addressLine1} onChange={(value) => update("addressLine1", value)} required className="sm:col-span-2" />
            <Field label="Address line 2" value={form.addressLine2 ?? ""} onChange={(value) => update("addressLine2", value)} className="sm:col-span-2" />
            <Field label="Town / City" value={form.city} onChange={(value) => update("city", value)} required />
            <Field label="Postcode" value={form.postcode} onChange={(value) => update("postcode", value)} required />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#E7EEE7] pt-6">
            <p className="text-sm text-[#4B4F4C]">Continue to the MultiDor configurator and build the first door.</p>
            <button
              type="submit"
              disabled={!isValid}
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue to configurator
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-[#40584A]">{label}{required ? " *" : ""}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[1rem] border border-[#DCE5DD] px-4 py-3 text-sm text-[#4B4F4C] outline-none transition focus:border-[#40584A]"
      />
    </label>
  );
}
