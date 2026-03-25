import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuote, type CustomerDetails } from "../context/QuoteContext";

const initialValues: CustomerDetails = {
  customerName: "",
  companyName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postcode: "",
};

export default function QuoteStartPage() {
  const navigate = useNavigate();
  const { quoteRef, startQuote, customerDetails } = useQuote();
  const [values, setValues] = useState<CustomerDetails>(customerDetails ?? initialValues);

  function update<K extends keyof CustomerDetails>(key: K, value: CustomerDetails[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    startQuote(values);
    navigate("/order-online/configure");
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-[#D7D7D7] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6B6B6B]">
          Order online
        </p>
        <h2 className="mt-0 text-2xl font-semibold text-[#111111] tracking-tight">
            Start your quote
          </h2>

        <div className="mt-6 rounded-[1.5rem] bg-[#FFF9F4] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">
            Quote reference : {quoteRef}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#111111]">Customer name</span>
            <input required value={values.customerName} onChange={(e) => update("customerName", e.target.value)} className="w-full rounded-[1rem] border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#111111]">Company name</span>
            <input value={values.companyName} onChange={(e) => update("companyName", e.target.value)} className="w-full rounded-[1rem] border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#111111]">Email</span>
            <input required type="email" value={values.email} onChange={(e) => update("email", e.target.value)} className="w-full rounded-[1rem] border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#111111]">Phone</span>
            <input required value={values.phone} onChange={(e) => update("phone", e.target.value)} className="w-full rounded-[1rem] border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-[#111111]">Address line 1</span>
            <input required value={values.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} className="w-full rounded-[1rem] border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-[#111111]">Address line 2</span>
            <input value={values.addressLine2} onChange={(e) => update("addressLine2", e.target.value)} className="w-full rounded-[1rem] border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#111111]">Town / City</span>
            <input required value={values.city} onChange={(e) => update("city", e.target.value)} className="w-full rounded-[1rem] border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#111111]">Postcode</span>
            <input required value={values.postcode} onChange={(e) => update("postcode", e.target.value)} className="w-full rounded-[1rem] border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]" />
          </label>
          <div className="sm:col-span-2 flex justify-end pt-2">
            <button type="submit"  
            className="mt-4 rounded-full bg-[#F47A20] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#D96510]">
              Continue to configurator
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
