import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  createReseller,
  fetchReseller,
  fetchResellerCredentialStatus,
  updateReseller,
  upsertResellerCredentials,
} from '../resellers/api';
import type { Reseller, ResellerCredentialSummary, ResellerFormValues } from '../resellers/types';

const emptyForm: ResellerFormValues = {
  companyName: '',
  firstName: '',
  lastName: '',
  businessAddress: '',
  tel: '',
  fax: '',
  mobile: '',
  email: '',
  webAddress: '',
  notes: '',
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
  if (!value) return 'Never';

  return new Date(value).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function AdminResellerFormPage() {
  const navigate = useNavigate();
  const params = useParams<{ resellerId: string }>();
  const [existing, setExisting] = useState<Reseller | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(Boolean(params.resellerId));
  const [notFound, setNotFound] = useState(false);
  const [values, setValues] = useState<ResellerFormValues>(emptyForm);
  const [credentialSummary, setCredentialSummary] = useState<ResellerCredentialSummary>({
    loginEnabled: false,
    loginEmail: '',
    hasPassword: false,
    passwordLastSetAt: null,
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [credentialError, setCredentialError] = useState('');
  const [credentialNotice, setCredentialNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);

  const isEditing = Boolean(existing);

  useEffect(() => {
    if (!params.resellerId) {
      setExisting(null);
      setValues(emptyForm);
      setCredentialSummary({
        loginEnabled: false,
        loginEmail: '',
        hasPassword: false,
        passwordLastSetAt: null,
      });
      setIsInitialLoading(false);
      setNotFound(false);
      return;
    }

    let isCancelled = false;
    setIsInitialLoading(true);
    setError('');
    setCredentialError('');

    async function load() {
      try {
        const reseller = await fetchReseller(params.resellerId!);
        if (isCancelled) return;
        setExisting(reseller);
        setValues({
          companyName: reseller.companyName,
          firstName: reseller.firstName,
          lastName: reseller.lastName,
          businessAddress: reseller.businessAddress,
          tel: reseller.tel,
          fax: reseller.fax,
          mobile: reseller.mobile,
          email: reseller.email,
          webAddress: reseller.webAddress,
          notes: reseller.notes,
        });
        setCredentialSummary(reseller.credentials);
        setNotFound(false);
      } catch (err) {
        if (isCancelled) return;
        setNotFound(true);
        setError(err instanceof Error ? err.message : 'Unable to load reseller.');
      } finally {
        if (!isCancelled) setIsInitialLoading(false);
      }
    }

    void load();

    return () => {
      isCancelled = true;
    };
  }, [params.resellerId]);

  useEffect(() => {
    if (!existing) {
      return;
    }

    let isCancelled = false;
    const resellerId = existing.id;

    async function loadCredentialStatus() {
      setIsLoadingCredentials(true);
      setCredentialError('');

      try {
        const status = await fetchResellerCredentialStatus(resellerId);
        if (isCancelled) return;
        setCredentialSummary(status);
      } catch (err) {
        if (isCancelled) return;
        setCredentialError(err instanceof Error ? err.message : 'Unable to load reseller login status.');
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

  if (!isInitialLoading && params.resellerId && notFound) {
    return <Navigate to="/admin/resellers" replace />;
  }

  const setField = <K extends keyof ResellerFormValues>(key: K, value: ResellerFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const setCredentialField = <K extends keyof ResellerCredentialSummary>(key: K, value: ResellerCredentialSummary[K]) => {
    setCredentialSummary((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setCredentialError('');
    setCredentialNotice('');

    if (!values.companyName.trim()) {
      setError('Company Name is required.');
      return;
    }

    const shouldManageLogin = credentialSummary.loginEnabled || newPassword.trim().length > 0 || confirmPassword.trim().length > 0;

    if (shouldManageLogin) {
      const loginEmail = credentialSummary.loginEmail.trim() || values.email.trim();
      if (!loginEmail) {
        setCredentialError('A login email is required when reseller access is enabled.');
        return;
      }

      if (newPassword || confirmPassword) {
        if (newPassword.length < 8) {
          setCredentialError('Password must be at least 8 characters.');
          return;
        }

        if (newPassword !== confirmPassword) {
          setCredentialError('Password confirmation does not match.');
          return;
        }
      }
    }

    setIsSaving(true);

    try {
      const reseller = isEditing && existing
        ? await updateReseller(existing.id, values)
        : await createReseller(values);

      setExisting(reseller);

      if (shouldManageLogin) {
        const nextSummary = await upsertResellerCredentials({
          resellerId: reseller.id,
          loginEnabled: credentialSummary.loginEnabled,
          loginEmail: (credentialSummary.loginEmail.trim() || values.email.trim()).toLowerCase(),
          password: newPassword || undefined,
        });

        setCredentialSummary(nextSummary);
        setNewPassword('');
        setConfirmPassword('');
        setCredentialNotice(newPassword
          ? 'Reseller access details saved and password hashed.'
          : 'Reseller access updated.');
      }

      navigate(`/admin/resellers/${encodeURIComponent(reseller.id)}/edit`, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save reseller.';
      if (message.toLowerCase().includes('credential') || message.toLowerCase().includes('password') || message.toLowerCase().includes('login')) {
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
            {isEditing ? 'Edit reseller' : 'Add reseller'}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-zinc-600">
            {isEditing
              ? 'Update the reseller profile and manage reseller access from the same screen. Profile and pricing changes are saved through the backend.'
              : 'Create a reseller profile, clone the default pricing template, and optionally prepare reseller login access from this page.'}
          </p>
        </div>

        <Link
          to="/admin/resellers"
          className="inline-flex rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
        >
          Back to resellers
        </Link>
      </div>

      {isInitialLoading ? (
        <div className="mt-8 rounded-[1.75rem] border border-zinc-200 bg-white p-8 text-sm text-zinc-600 shadow-sm">Loading reseller...</div>
      ) : (
        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Company Name">
                <input
                  value={values.companyName}
                  onChange={(event) => setField('companyName', event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                  required
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={values.email}
                  onChange={(event) => setField('email', event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </Field>

              <Field label="First Name">
                <input
                  value={values.firstName}
                  onChange={(event) => setField('firstName', event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </Field>

              <Field label="Last Name">
                <input
                  value={values.lastName}
                  onChange={(event) => setField('lastName', event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </Field>

              <Field label="Tel">
                <input
                  value={values.tel}
                  onChange={(event) => setField('tel', event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </Field>

              <Field label="Fax">
                <input
                  value={values.fax}
                  onChange={(event) => setField('fax', event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </Field>

              <Field label="Mobile">
                <input
                  value={values.mobile}
                  onChange={(event) => setField('mobile', event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </Field>

              <Field label="Web Address">
                <input
                  value={values.webAddress}
                  onChange={(event) => setField('webAddress', event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </Field>
            </div>

            <div className="mt-5 grid gap-5">
              <Field label="Business Address">
                <textarea
                  value={values.businessAddress}
                  onChange={(event) => setField('businessAddress', event.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </Field>

              <Field label="Notes">
                <textarea
                  value={values.notes}
                  onChange={(event) => setField('notes', event.target.value)}
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
                  Login enablement, login email, and password hashing are now saved through the backend. Passwords are stored as secure hashes before reseller auth records are synced to Cosmos.
                </p>
              </div>
              <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                <div>Access: <span className="font-semibold text-zinc-900">{credentialSummary.loginEnabled ? 'Enabled' : 'Disabled'}</span></div>
                <div className="mt-1">Password set: <span className="font-semibold text-zinc-900">{credentialSummary.hasPassword ? 'Yes' : 'No'}</span></div>
                <div className="mt-1">Last updated: <span className="font-semibold text-zinc-900">{formatCredentialDate(credentialSummary.passwordLastSetAt)}</span></div>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 px-4 py-4">
                <input
                  type="checkbox"
                  checked={credentialSummary.loginEnabled}
                  onChange={(event) => setCredentialField('loginEnabled', event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-zinc-300"
                />
                <span>
                  <span className="block text-sm font-semibold text-zinc-900">Enable reseller login</span>
                  <span className="mt-1 block text-sm text-zinc-600">
                    When enabled, this reseller can sign in via the reseller login page after a password has been set.
                  </span>
                </span>
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Login Email">
                  <input
                    type="email"
                    value={credentialSummary.loginEmail}
                    onChange={(event) => setCredentialField('loginEmail', event.target.value)}
                    placeholder={values.email || 'reseller@example.com'}
                    className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                  />
                </Field>

                <div className="rounded-2xl border border-dashed border-zinc-200 px-4 py-4 text-sm text-zinc-600">
                  {isLoadingCredentials
                    ? 'Loading backend credential status...'
                    : 'Passwords entered here are hashed by the backend before the reseller login record is stored in Cosmos.'}
                </div>

                <Field label={isEditing ? 'Set New Password' : 'Initial Password'}>
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
              className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : isEditing ? 'Save reseller' : 'Create reseller and clone template'}
            </button>
            {isEditing && existing ? (
              <Link
                to={`/admin/resellers/${encodeURIComponent(existing.id)}/pricing`}
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
      )}
    </section>
  );
}
