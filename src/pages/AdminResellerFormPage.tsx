import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { fetchResellerCredentialStatus, upsertResellerCredentials } from "../resellers/api";
import { createReseller, getReseller, updateReseller, updateResellerCredentialSummary } from "../resellers/storage";
import type { ResellerCredentialSummary, ResellerFormValues } from "../resellers/types";

const emptyForm: ResellerFormValues = {
  companyName: "",
  firstName: "",
  lastName: "",
  businessAddress: "",
  tel: "",
  fax: "",
  mobile: "",
  email: "",
  webAddress: "",
  notes: "",
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-900">{label}</span>
      {children}
    </label>
  );
}

function formatCredentialDate(value: string | null) {
  if (!value) return "Never";

  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminResellerFormPage() {
  const navigate = useNavigate();
  const params = useParams<{ resellerId: string }>();
  const existing = useMemo(() => (params.resellerId ? getReseller(params.resellerId) : null), [params.resellerId]);
  const [values, setValues] = useState<ResellerFormValues>(
    existing
      ? {
          companyName: existing.companyName,
          firstName: existing.firstName,
          lastName: existing.lastName,
          businessAddress: existing.businessAddress,
          tel: existing.tel,
          fax: existing.fax,
          mobile: existing.mobile,
          email: existing.email,
          webAddress: existing.webAddress,
          notes: existing.notes,
        }
      : emptyForm
  );
  const [credentialSummary, setCredentialSummary] = useState<ResellerCredentialSummary>(
    existing?.credentials ?? {
      loginEnabled: false,
      loginEmail: existing?.email ?? "",
      hasPassword: false,
      passwordLastSetAt: null,
    }
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [credentialError, setCredentialError] = useState("");
  const [credentialNotice, setCredentialNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);

  if (params.resellerId && !existing) {
    return <Navigate to="/admin/resellers" replace />;
  }

  const isEditing = Boolean(existing);

  useEffect(() => {
    if (!existing) {
      return;
    }

    let isCancelled = false;

    async function loadCredentialStatus() {
      setIsLoadingCredentials(true);
      setCredentialError("");

      try {
        const status = await fetchResellerCredentialStatus(existing!.id);
        if (isCancelled) return;
        setCredentialSummary(status);
        updateResellerCredentialSummary(existing!.id, status);
      } catch (err) {
        if (isCancelled) return;
        setCredentialError(err instanceof Error ? err.message : "Unable to load reseller login status.");
      } finally {
        if (!isCancelled) {
          setIsLoadingCredentials(false);
        }
      }
    }

    void loadCredentialStatus();

    return () => {
      isCancelled = true;
    };
  }, [existing]);

  const setField = <K extends keyof ResellerFormValues>(key: K, value: ResellerFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const setCredentialField = <K extends keyof ResellerCredentialSummary>(key: K, value: ResellerCredentialSummary[K]) => {
    setCredentialSummary((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setCredentialError("");
    setCredentialNotice("");

    if (!values.companyName.trim()) {
      setError("Company Name is required.");
      return;
    }

    const shouldManageLogin = credentialSummary.loginEnabled || newPassword.trim().length > 0 || confirmPassword.trim().length > 0;

    if (shouldManageLogin) {
      const loginEmail = credentialSummary.loginEmail.trim() || values.email.trim();
      if (!loginEmail) {
        setCredentialError("A login email is required when reseller access is enabled.");
        return;
      }

      if (newPassword || confirmPassword) {
        if (newPassword.length < 8) {
          setCredentialError("Password must be at least 8 characters.");
          return;
        }

        if (newPassword !== confirmPassword) {
          setCredentialError("Password confirmation does not match.");
          return;
        }
      } else if (credentialSummary.loginEnabled && !credentialSummary.hasPassword && !isEditing) {
        setCredentialError("Set an initial password for the reseller login.");
        return;
      }
    }

    setIsSaving(true);

    try {
      const reseller = isEditing && existing ? updateReseller(existing.id, values) : createReseller(values);

      const finalLoginEmail = (credentialSummary.loginEmail.trim() || values.email.trim()).toLowerCase();

      if (shouldManageLogin) {
        const nextSummary = await upsertResellerCredentials({
          resellerId: reseller.id,
          loginEnabled: credentialSummary.loginEnabled,
          loginEmail: finalLoginEmail,
          password: newPassword || undefined,
        });

        updateResellerCredentialSummary(reseller.id, nextSummary);
        setCredentialSummary(nextSummary);
        setNewPassword("");
        setConfirmPassword("");
        setCredentialNotice(nextSummary.hasPassword ? "Reseller login credentials saved." : "Reseller access updated.");
      }

      navigate(`/admin/resellers/${encodeURIComponent(reseller.id)}/edit`, { replace: true });
      window.location.reload();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save reseller.";
      if (message.toLowerCase().includes("credential") || message.toLowerCase().includes("password") || message.toLowerCase().includes("login")) {
        setCredentialError(message);
      } else {
        setError(message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Admin panel</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            {isEditing ? "Edit reseller" : "Add reseller"}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-zinc-600">
            {isEditing
              ? "Update the reseller profile and manage the reseller's login from the same screen. Passwords are sent to the backend and hashed there."
              : "Create a reseller profile, clone the default pricing template, and optionally issue reseller login credentials from this page."}
          </p>
        </div>

        <Link
          to="/admin/resellers"
          className="inline-flex rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
        >
          Back to resellers
        </Link>
      </div>

      <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
        <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Company Name">
              <input
                value={values.companyName}
                onChange={(event) => setField("companyName", event.target.value)}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                required
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={values.email}
                onChange={(event) => setField("email", event.target.value)}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </Field>

            <Field label="First Name">
              <input
                value={values.firstName}
                onChange={(event) => setField("firstName", event.target.value)}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </Field>

            <Field label="Last Name">
              <input
                value={values.lastName}
                onChange={(event) => setField("lastName", event.target.value)}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </Field>

            <Field label="Tel">
              <input
                value={values.tel}
                onChange={(event) => setField("tel", event.target.value)}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </Field>

            <Field label="Fax">
              <input
                value={values.fax}
                onChange={(event) => setField("fax", event.target.value)}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </Field>

            <Field label="Mobile">
              <input
                value={values.mobile}
                onChange={(event) => setField("mobile", event.target.value)}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </Field>

            <Field label="Web Address">
              <input
                value={values.webAddress}
                onChange={(event) => setField("webAddress", event.target.value)}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-5">
            <Field label="Business Address">
              <textarea
                value={values.businessAddress}
                onChange={(event) => setField("businessAddress", event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </Field>

            <Field label="Notes">
              <textarea
                value={values.notes}
                onChange={(event) => setField("notes", event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </Field>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-900">Reseller login access</h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                Manage the reseller's sign-in details here. New passwords are posted to the backend and must be hashed there using the existing password hash functionality.
              </p>
            </div>
            <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
              <div>Access: <span className="font-semibold text-zinc-900">{credentialSummary.loginEnabled ? "Enabled" : "Disabled"}</span></div>
              <div className="mt-1">Password set: <span className="font-semibold text-zinc-900">{credentialSummary.hasPassword ? "Yes" : "No"}</span></div>
              <div className="mt-1">Last updated: <span className="font-semibold text-zinc-900">{formatCredentialDate(credentialSummary.passwordLastSetAt)}</span></div>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 px-4 py-4">
              <input
                type="checkbox"
                checked={credentialSummary.loginEnabled}
                onChange={(event) => setCredentialField("loginEnabled", event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-300"
              />
              <span>
                <span className="block text-sm font-semibold text-zinc-900">Enable reseller login</span>
                <span className="mt-1 block text-sm text-zinc-600">
                  When enabled, this reseller can sign in via the reseller login page using the login email and password below.
                </span>
              </span>
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Login Email">
                <input
                  type="email"
                  value={credentialSummary.loginEmail}
                  onChange={(event) => setCredentialField("loginEmail", event.target.value)}
                  placeholder={values.email || "reseller@example.com"}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </Field>

              <div className="rounded-2xl border border-dashed border-zinc-200 px-4 py-4 text-sm text-zinc-600">
                {isLoadingCredentials ? "Loading backend credential status..." : "Leave the password fields blank to keep the current password unchanged."}
              </div>

              <Field label={isEditing ? "Set New Password" : "Initial Password"}>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </Field>

              <Field label="Confirm Password">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </Field>
            </div>
          </div>

          {credentialNotice ? (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{credentialNotice}</div>
          ) : null}

          {credentialError ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{credentialError}</div>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {isSaving ? "Saving..." : isEditing ? "Save reseller" : "Create reseller and clone template"}
          </button>
          {isEditing ? (
            <Link
              to={`/admin/resellers/${encodeURIComponent(existing!.id)}/pricing`}
              className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
            >
              Manage price matrix
            </Link>
          ) : null}
          <Link
            to="/admin/resellers"
            className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
