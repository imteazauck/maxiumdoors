import type { ChangeEvent } from "react";

export type DeliveryDetails = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  country: string;
  useParentsPostCode: boolean;
  postCode: string;
  confirmAddress: boolean;
  contactEmail: string;
  contactPhone: string;
  siteContactName: string;
  siteContactPhone: string;
  amDelivery: boolean;
  pre10amDelivery: boolean;
  offloadingAvailable: boolean;
  deliveryMethod: string;
  estimatedDeliveryDate: string;
};

type DeliveryDetailsCardProps = {
  value: DeliveryDetails;
  onChange: (next: DeliveryDetails) => void;
};

export const initialDeliveryDetails: DeliveryDetails = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  county: "",
  country: "United Kingdom",
  useParentsPostCode: false,
  postCode: "",
  confirmAddress: false,
  contactEmail: "",
  contactPhone: "",
  siteContactName: "",
  siteContactPhone: "",
  amDelivery: false,
  pre10amDelivery: false,
  offloadingAvailable: false,
  deliveryMethod: "",
  estimatedDeliveryDate: "",
};

export function isDeliveryDetailsComplete(details: DeliveryDetails) {
  return Boolean(
    details.addressLine1.trim() &&
      details.city.trim() &&
      details.postCode.trim() &&
      details.contactEmail.trim() &&
      details.contactPhone.trim() &&
      details.deliveryMethod.trim() &&
      details.estimatedDeliveryDate.trim(),
  );
}

export default function DeliveryDetailsCard({
  value,
  onChange,
}: DeliveryDetailsCardProps) {
  function handleTextChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value: nextValue } = event.target;
    onChange({
      ...value,
      [name]: nextValue,
    });
  }

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;
    onChange({
      ...value,
      [name]: checked,
    });
  }

  return (
    <section className="rounded-[2rem] border border-[#D7D7D7] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-[#111111]">Delivery details</h2>

      <div className="mt-6 space-y-8">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B6B6B]">
            Delivery address
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">
                Address line 1
              </span>
              <input
                name="addressLine1"
                value={value.addressLine1}
                onChange={handleTextChange}
                className="w-full rounded-xl border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">
                Address line 2
              </span>
              <input
                name="addressLine2"
                value={value.addressLine2}
                onChange={handleTextChange}
                className="w-full rounded-xl border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">
                City
              </span>
              <input
                name="city"
                value={value.city}
                onChange={handleTextChange}
                className="w-full rounded-xl border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">
                County
              </span>
              <input
                name="county"
                value={value.county}
                onChange={handleTextChange}
                className="w-full rounded-xl border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">
                Country
              </span>
              <select
                name="country"
                value={value.country}
                onChange={handleTextChange}
                className="w-full rounded-xl border border-[#D7D7D7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
              >
                <option value="United Kingdom">United Kingdom</option>
                <option value="Ireland">Ireland</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">
                Post code
              </span>
              <input
                name="postCode"
                value={value.postCode}
                onChange={handleTextChange}
                className="w-full rounded-xl border border-[#D7D7D7] px-4 py-3 text-sm uppercase outline-none transition focus:border-[#F47A20]"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 text-sm text-[#111111]">
              <input
                type="checkbox"
                name="useParentsPostCode"
                checked={value.useParentsPostCode}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-[#D7D7D7]"
              />
              Use parent&apos;s post code
            </label>

            <label className="flex items-center gap-3 text-sm text-[#111111]">
              <input
                type="checkbox"
                name="confirmAddress"
                checked={value.confirmAddress}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-[#D7D7D7]"
              />
              Confirm delivery address
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B6B6B]">
            Site details
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">
                Contact email
              </span>
              <input
                type="email"
                name="contactEmail"
                value={value.contactEmail}
                onChange={handleTextChange}
                className="w-full rounded-xl border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">
                Contact phone
              </span>
              <input
                name="contactPhone"
                value={value.contactPhone}
                onChange={handleTextChange}
                className="w-full rounded-xl border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">
                Site contact name
              </span>
              <input
                name="siteContactName"
                value={value.siteContactName}
                onChange={handleTextChange}
                className="w-full rounded-xl border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">
                Site contact phone
              </span>
              <input
                name="siteContactPhone"
                value={value.siteContactPhone}
                onChange={handleTextChange}
                className="w-full rounded-xl border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-3 text-sm text-[#111111]">
              <input
                type="checkbox"
                name="amDelivery"
                checked={value.amDelivery}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-[#D7D7D7]"
              />
              AM delivery
            </label>

            <label className="flex items-center gap-3 text-sm text-[#111111]">
              <input
                type="checkbox"
                name="pre10amDelivery"
                checked={value.pre10amDelivery}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-[#D7D7D7]"
              />
              Pre 10 AM delivery
            </label>

            <label className="flex items-center gap-3 text-sm text-[#111111]">
              <input
                type="checkbox"
                name="offloadingAvailable"
                checked={value.offloadingAvailable}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-[#D7D7D7]"
              />
              Offloading available
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B6B6B]">
            Delivery method
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">
                Delivery method
              </span>
              <select
                name="deliveryMethod"
                value={value.deliveryMethod}
                onChange={handleTextChange}
                className="w-full rounded-xl border border-[#D7D7D7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
              >
                <option value="">Select delivery method</option>
                <option value="Palletised">Palletised</option>
                <option value="Direct">Direct</option>
                <option value="Collection">Collection</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]">
                Estimated delivery date
              </span>
              <input
                type="date"
                name="estimatedDeliveryDate"
                value={value.estimatedDeliveryDate}
                onChange={handleTextChange}
                className="w-full rounded-xl border border-[#D7D7D7] px-4 py-3 text-sm outline-none transition focus:border-[#F47A20]"
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}