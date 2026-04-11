import { defaultPricingTemplate, defaultPricingTemplateId } from "./defaultPricingTemplate";
import type {
  PricingTemplateRow,
  Reseller,
  ResellerCredentialSummary,
  ResellerFormValues,
  ResellerPricingItem,
} from "./types";

const RESELLERS_KEY = "maxiumdoors-resellers";
const RESELLER_PRICING_KEY = "maxiumdoors-reseller-pricing";

type PricingState = Record<string, ResellerPricingItem[]>;

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function cloneTemplateRow(row: PricingTemplateRow, resellerId: string): ResellerPricingItem {
  const timestamp = new Date().toISOString();

  if (row.type === "matrixRow") {
    return {
      ...row,
      id: createId(`matrix_${resellerId}`),
      resellerId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  return {
    ...row,
    id: createId(`option_${resellerId}`),
    resellerId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function emptyCredentials(loginEmail = ""): ResellerCredentialSummary {
  return {
    loginEnabled: false,
    loginEmail,
    hasPassword: false,
    passwordLastSetAt: null,
  };
}

function withCredentialDefaults(reseller: Reseller): Reseller {
  return {
    ...reseller,
    credentials: reseller.credentials ?? emptyCredentials(reseller.email),
  };
}

function seedExampleData() {
  const resellers = readJson<Reseller[]>(RESELLERS_KEY, []);

  if (resellers.length > 0) {
    return;
  }

  const timestamp = new Date().toISOString();
  const resellerId = "reseller_demo";
  const reseller: Reseller = {
    id: resellerId,
    companyName: "Demo Reseller Ltd",
    firstName: "Alex",
    lastName: "Morgan",
    businessAddress: "10 Trade Park, Birmingham, B1 1AA",
    tel: "0121 555 0101",
    fax: "0121 555 0102",
    mobile: "07700 900123",
    email: "alex@demoreseller.co.uk",
    webAddress: "https://demoreseller.co.uk",
    notes: "Seeded from the default template for admin review.",
    isActive: true,
    pricingInitialized: true,
    sourceTemplateId: defaultPricingTemplateId,
    credentials: emptyCredentials("alex@demoreseller.co.uk"),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  writeJson(RESELLERS_KEY, [reseller]);
  writeJson(RESELLER_PRICING_KEY, {
    [resellerId]: defaultPricingTemplate.map((row) => cloneTemplateRow(row, resellerId)),
  });
}

export function ensureResellerStore() {
  if (typeof window === "undefined") {
    return;
  }

  seedExampleData();
}

export function listResellers() {
  ensureResellerStore();
  return readJson<Reseller[]>(RESELLERS_KEY, [])
    .map(withCredentialDefaults)
    .sort((left, right) => left.companyName.localeCompare(right.companyName));
}

export function getReseller(resellerId: string) {
  return listResellers().find((item) => item.id === resellerId) ?? null;
}

export function createReseller(values: ResellerFormValues) {
  const resellers = listResellers();
  const pricing = readJson<PricingState>(RESELLER_PRICING_KEY, {});
  const timestamp = new Date().toISOString();
  const derivedSlug = slugify(values.companyName) || slugify(`${values.firstName}-${values.lastName}`) || "reseller";
  const resellerId = `${derivedSlug}_${Math.random().toString(36).slice(2, 6)}`;

  const reseller: Reseller = {
    id: resellerId,
    ...values,
    isActive: true,
    pricingInitialized: true,
    sourceTemplateId: defaultPricingTemplateId,
    credentials: emptyCredentials(values.email),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  resellers.push(reseller);
  pricing[resellerId] = defaultPricingTemplate.map((row) => cloneTemplateRow(row, resellerId));

  writeJson(RESELLERS_KEY, resellers);
  writeJson(RESELLER_PRICING_KEY, pricing);

  return reseller;
}

export function updateReseller(resellerId: string, values: ResellerFormValues) {
  const resellers = listResellers();
  const resellerIndex = resellers.findIndex((item) => item.id === resellerId);

  if (resellerIndex < 0) {
    throw new Error("Reseller not found.");
  }

  const existing = resellers[resellerIndex];
  const updated: Reseller = {
    ...existing,
    ...values,
    credentials: {
      ...existing.credentials,
      loginEmail: existing.credentials.loginEmail || values.email,
    },
    updatedAt: new Date().toISOString(),
  };

  resellers[resellerIndex] = updated;
  writeJson(RESELLERS_KEY, resellers);
  return updated;
}

export function updateResellerCredentialSummary(resellerId: string, credentials: ResellerCredentialSummary) {
  const resellers = listResellers();
  const resellerIndex = resellers.findIndex((item) => item.id === resellerId);

  if (resellerIndex < 0) {
    throw new Error("Reseller not found.");
  }

  resellers[resellerIndex] = {
    ...resellers[resellerIndex],
    credentials,
    updatedAt: new Date().toISOString(),
  };

  writeJson(RESELLERS_KEY, resellers);
  return resellers[resellerIndex];
}

export function deleteReseller(resellerId: string) {
  const resellers = listResellers().filter((item) => item.id !== resellerId);
  const pricing = readJson<PricingState>(RESELLER_PRICING_KEY, {});
  delete pricing[resellerId];
  writeJson(RESELLERS_KEY, resellers);
  writeJson(RESELLER_PRICING_KEY, pricing);
}

export function getResellerPricing(resellerId: string) {
  ensureResellerStore();
  const pricing = readJson<PricingState>(RESELLER_PRICING_KEY, {});
  return (pricing[resellerId] ?? []).slice().sort((left, right) => {
    if (left.type !== right.type) {
      return left.type.localeCompare(right.type);
    }

    if (left.type === "matrixRow" && right.type === "matrixRow") {
      return left.configuration.localeCompare(right.configuration)
        || left.heightMin - right.heightMin
        || left.widthMin - right.widthMin;
    }

    if (left.type === "optionRow" && right.type === "optionRow") {
      return left.group.localeCompare(right.group)
        || left.label.localeCompare(right.label)
        || left.configuration.localeCompare(right.configuration)
        || (left.widthMin ?? 0) - (right.widthMin ?? 0);
    }

    return 0;
  });
}

export function updatePricingItem(resellerId: string, itemId: string, nextPrice: number) {
  const pricing = readJson<PricingState>(RESELLER_PRICING_KEY, {});
  const rows = pricing[resellerId] ?? [];

  pricing[resellerId] = rows.map((row) => row.id === itemId
    ? { ...row, price: nextPrice, updatedAt: new Date().toISOString() }
    : row);

  writeJson(RESELLER_PRICING_KEY, pricing);
}

export function replaceResellerPricing(resellerId: string, items: ResellerPricingItem[]) {
  const pricing = readJson<PricingState>(RESELLER_PRICING_KEY, {});
  pricing[resellerId] = items;
  writeJson(RESELLER_PRICING_KEY, pricing);
}
