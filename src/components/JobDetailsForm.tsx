import { type ChangeEvent, type FormEvent, useState } from "react";
import type { UserRole } from "../data/job";

export interface JobDetailsFormValues {
  jobRef: string;
  siteAddress: string;
  customerName: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  estimatorAssigned: string;
  notes: string;
}

interface JobDetailsFormProps {
  role: UserRole;
  initialValues?: Partial<JobDetailsFormValues>;
  onSaveDraft: (values: JobDetailsFormValues) => void;
  onContinue: (values: JobDetailsFormValues) => void;
}

const defaultValues: JobDetailsFormValues = {
  jobRef: "",
  siteAddress: "",
  customerName: "",
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
  estimatorAssigned: "",
  notes: "",
};

interface FormErrors {
  jobRef?: string;
  siteAddress?: string;
  contactName?: string;
  email?: string;
}

export default function JobDetailsForm({
  role,
  initialValues,
  onSaveDraft,
  onContinue,
}: JobDetailsFormProps) {
  const [values, setValues] = useState<JobDetailsFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!values.jobRef.trim()) {
      nextErrors.jobRef = "Job reference is required.";
    }

    if (!values.siteAddress.trim()) {
      nextErrors.siteAddress = "Site address is required.";
    }

    if (!values.contactName.trim()) {
      nextErrors.contactName = "Contact name is required.";
    }

    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onContinue(values);
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="jobRef">Job Reference *</label>
          <input
            id="jobRef"
            name="jobRef"
            value={values.jobRef}
            onChange={handleChange}
            placeholder="e.g. JR-1024"
          />
          {errors.jobRef && <span className="error-text">{errors.jobRef}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="estimatorAssigned">
            {role === "estimator" ? "Estimator Name" : "Preferred Estimator"}
          </label>
          <input
            id="estimatorAssigned"
            name="estimatorAssigned"
            value={values.estimatorAssigned}
            onChange={handleChange}
            placeholder="e.g. John Smith"
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="siteAddress">Site Address *</label>
          <input
            id="siteAddress"
            name="siteAddress"
            value={values.siteAddress}
            onChange={handleChange}
            placeholder="Full installation site address"
          />
          {errors.siteAddress && (
            <span className="error-text">{errors.siteAddress}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="customerName">Customer Name</label>
          <input
            id="customerName"
            name="customerName"
            value={values.customerName}
            onChange={handleChange}
            placeholder="Customer / end user"
          />
        </div>

        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            id="companyName"
            name="companyName"
            value={values.companyName}
            onChange={handleChange}
            placeholder="Company / contractor"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactName">Contact Name *</label>
          <input
            id="contactName"
            name="contactName"
            value={values.contactName}
            onChange={handleChange}
            placeholder="Primary contact"
          />
          {errors.contactName && (
            <span className="error-text">{errors.contactName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            placeholder="Phone number"
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="contact@example.com"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="notes">Notes / Special Requirements</label>
          <textarea
            id="notes"
            name="notes"
            value={values.notes}
            onChange={handleChange}
            placeholder="Access requirements, delivery notes, special specs..."
            rows={5}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="secondary-btn"
          onClick={() => onSaveDraft(values)}
        >
          Save Draft
        </button>

        <button type="submit" className="primary-btn">
          Save and Continue to Calculator
        </button>
      </div>
    </form>
  );
}