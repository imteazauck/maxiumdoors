import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import templateSeed from './defaultPricingTemplate.json' with { type: 'json' };

const DATA_FILE = path.join(process.cwd(), 'data', 'reseller-backoffice.json');
const DEFAULT_TEMPLATE_ID = templateSeed.templateId ?? 'default';
const DEFAULT_TEMPLATE_ITEMS = Array.isArray(templateSeed.items) ? templateSeed.items : [];
const COSMOS_API_VERSION = '2018-12-31';

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix = 'id') {
  return `${prefix}_${crypto.randomUUID()}`;
}

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function buildResellerId(values) {
  const company = slugify(values.companyName);
  const contact = slugify(`${values.firstName ?? ''}-${values.lastName ?? ''}`);
  const stem = company || contact || 'reseller';
  return `${stem}_${Math.random().toString(36).slice(2, 6)}`;
}

function emptyCredentials(loginEmail = '') {
  return {
    loginEnabled: false,
    loginEmail,
    hasPassword: false,
    passwordLastSetAt: null,
    passwordHashStatus: 'not_set',
  };
}

function normalizeReseller(source) {
  return {
    id: String(source.id),
    resellerId: String(source.resellerId ?? source.id),
    companyName: String(source.companyName ?? ''),
    firstName: String(source.firstName ?? ''),
    lastName: String(source.lastName ?? ''),
    businessAddress: String(source.businessAddress ?? ''),
    tel: String(source.tel ?? ''),
    fax: String(source.fax ?? ''),
    mobile: String(source.mobile ?? ''),
    email: String(source.email ?? ''),
    webAddress: String(source.webAddress ?? ''),
    notes: String(source.notes ?? ''),
    isActive: source.isActive !== false,
    pricingInitialized: source.pricingInitialized !== false,
    sourceTemplateId: String(source.sourceTemplateId ?? DEFAULT_TEMPLATE_ID),
    credentials: {
      ...emptyCredentials(String(source.email ?? '')),
      ...(source.credentials ?? {}),
    },
    createdAt: String(source.createdAt ?? nowIso()),
    updatedAt: String(source.updatedAt ?? source.createdAt ?? nowIso()),
    type: 'reseller',
  };
}

function cloneTemplateRow(row, resellerId) {
  const timestamp = nowIso();
  const base = {
    ...row,
    id: createId(row.type === 'matrixRow' ? `matrix_${resellerId}` : `option_${resellerId}`),
    resellerId,
    sourceTemplateId: row.sourceTemplateId ?? DEFAULT_TEMPLATE_ID,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  if (row.type === 'matrixRow') {
    return {
      ...base,
      doorCategory: String(row.doorCategory ?? ''),
      configuration: row.configuration === 'double' ? 'double' : 'single',
      heightMin: Number(row.heightMin ?? 0),
      heightMax: Number(row.heightMax ?? 0),
      widthMin: Number(row.widthMin ?? 0),
      widthMax: Number(row.widthMax ?? 0),
      price: Number(row.price ?? 0),
      currency: 'GBP',
      type: 'matrixRow',
    };
  }

  return {
    ...base,
    group: String(row.group ?? ''),
    label: String(row.label ?? ''),
    configuration: ['single', 'double', 'both'].includes(row.configuration) ? row.configuration : 'both',
    widthMin: row.widthMin == null ? undefined : Number(row.widthMin),
    widthMax: row.widthMax == null ? undefined : Number(row.widthMax),
    price: Number(row.price ?? 0),
    currency: 'GBP',
    type: 'optionRow',
  };
}

function sortPricingItems(items) {
  return [...items].sort((left, right) => {
    if (left.type !== right.type) return String(left.type).localeCompare(String(right.type));
    if (left.type === 'matrixRow' && right.type === 'matrixRow') {
      return String(left.configuration).localeCompare(String(right.configuration))
        || Number(left.heightMin) - Number(right.heightMin)
        || Number(left.widthMin) - Number(right.widthMin);
    }
    return String(left.group ?? '').localeCompare(String(right.group ?? ''))
      || String(left.label ?? '').localeCompare(String(right.label ?? ''));
  });
}

class LocalResellerStore {
  async readState() {
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        return { resellers: [], pricing: {} };
      }
      throw error;
    }
  }

  async writeState(state) {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2), 'utf8');
  }

  async listResellers() {
    const state = await this.readState();
    return state.resellers.map(normalizeReseller).sort((a, b) => a.companyName.localeCompare(b.companyName));
  }

  async getReseller(resellerId) {
    const resellers = await this.listResellers();
    return resellers.find((item) => item.id === resellerId) ?? null;
  }

  async createReseller(values) {
    const state = await this.readState();
    const timestamp = nowIso();
    const resellerId = buildResellerId(values);
    const reseller = normalizeReseller({
      id: resellerId,
      resellerId,
      ...values,
      isActive: true,
      pricingInitialized: true,
      sourceTemplateId: DEFAULT_TEMPLATE_ID,
      credentials: emptyCredentials(values.email),
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    state.resellers.push(reseller);
    state.pricing[resellerId] = DEFAULT_TEMPLATE_ITEMS.map((row) => cloneTemplateRow(row, resellerId));
    await this.writeState(state);
    return reseller;
  }

  async updateReseller(resellerId, values) {
    const state = await this.readState();
    const index = state.resellers.findIndex((item) => item.id === resellerId);
    if (index < 0) throw new Error('Reseller not found.');

    const existing = normalizeReseller(state.resellers[index]);
    const updated = normalizeReseller({
      ...existing,
      ...values,
      id: resellerId,
      resellerId,
      credentials: {
        ...existing.credentials,
        loginEmail: existing.credentials.loginEmail || values.email || existing.email,
      },
      updatedAt: nowIso(),
    });

    state.resellers[index] = updated;
    await this.writeState(state);
    return updated;
  }

  async deleteReseller(resellerId) {
    const state = await this.readState();
    state.resellers = state.resellers.filter((item) => item.id !== resellerId);
    delete state.pricing[resellerId];
    await this.writeState(state);
  }

  async getPricing(resellerId) {
    const state = await this.readState();
    const items = Array.isArray(state.pricing[resellerId]) ? state.pricing[resellerId] : [];
    return sortPricingItems(items);
  }

  async updatePricingItem(resellerId, itemId, nextPrice) {
    const state = await this.readState();
    const items = Array.isArray(state.pricing[resellerId]) ? state.pricing[resellerId] : [];
    const index = items.findIndex((item) => item.id === itemId);
    if (index < 0) throw new Error('Pricing row not found.');

    items[index] = { ...items[index], price: Number(nextPrice), updatedAt: nowIso() };
    state.pricing[resellerId] = items;
    await this.writeState(state);
    return items[index];
  }

  async getCredentialStatus(resellerId) {
    const reseller = await this.getReseller(resellerId);
    if (!reseller) throw new Error('Reseller not found.');
    return reseller.credentials;
  }

  async updateCredentials(resellerId, input) {
    const state = await this.readState();
    const index = state.resellers.findIndex((item) => item.id === resellerId);
    if (index < 0) throw new Error('Reseller not found.');
    const existing = normalizeReseller(state.resellers[index]);
    const updated = normalizeReseller({
      ...existing,
      credentials: {
        ...existing.credentials,
        loginEnabled: Boolean(input.loginEnabled),
        loginEmail: String(input.loginEmail ?? existing.credentials?.loginEmail ?? existing.email ?? '').trim().toLowerCase(),
        hasPassword: existing.credentials?.hasPassword ?? false,
        passwordLastSetAt: existing.credentials?.passwordLastSetAt ?? null,
        passwordHashStatus: input.password ? 'pending_backend_hash' : (existing.credentials?.passwordHashStatus ?? 'not_set'),
      },
      updatedAt: nowIso(),
    });
    state.resellers[index] = updated;
    await this.writeState(state);
    return updated.credentials;
  }
}

class CosmosRestClient {
  constructor() {
    this.endpoint = (process.env.COSMOS_DB_ENDPOINT ?? '').replace(/\/$/, '');
    this.key = process.env.COSMOS_DB_KEY ?? '';
    this.databaseId = process.env.COSMOS_DB_DATABASE ?? 'maxiumdoors';
    this.resellersContainerId = process.env.COSMOS_DB_RESELLERS_CONTAINER ?? 'resellers';
    this.pricingContainerId = process.env.COSMOS_DB_PRICING_CONTAINER ?? 'resellerPricing';
  }

  authHeader(verb, resourceType, resourceLink, date) {
    const key = Buffer.from(this.key, 'base64');
    const payload = `${verb.toLowerCase()}\n${resourceType.toLowerCase()}\n${resourceLink}\n${date.toLowerCase()}\n\n`;
    const signature = crypto.createHmac('sha256', key).update(payload, 'utf8').digest('base64');
    return encodeURIComponent(`type=master&ver=1.0&sig=${signature}`);
  }

  async request({ verb, resourceType, resourceLink, path, body, headers = {} }) {
    const date = new Date().toUTCString();
    const response = await fetch(`${this.endpoint}/${path}`, {
      method: verb,
      headers: {
        Authorization: this.authHeader(verb, resourceType, resourceLink, date),
        'x-ms-date': date,
        'x-ms-version': COSMOS_API_VERSION,
        Accept: 'application/json',
        ...headers,
      },
      body: body == null ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      const error = new Error(text || `Cosmos request failed with ${response.status}.`);
      error.statusCode = response.status;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async queryDocuments(containerId, query, parameters, partitionKey) {
    const resourceLink = `dbs/${this.databaseId}/colls/${containerId}`;
    const headers = {
      'Content-Type': 'application/query+json',
      'x-ms-documentdb-isquery': 'true',
      'x-ms-documentdb-query-enablecrosspartition': partitionKey ? 'false' : 'true',
    };
    if (partitionKey != null) {
      headers['x-ms-documentdb-partitionkey'] = JSON.stringify([partitionKey]);
    }
    const payload = await this.request({
      verb: 'POST',
      resourceType: 'docs',
      resourceLink,
      path: `${resourceLink}/docs`,
      headers,
      body: { query, parameters },
    });
    return Array.isArray(payload?.Documents) ? payload.Documents : [];
  }

  async createDocument(containerId, doc) {
    const resourceLink = `dbs/${this.databaseId}/colls/${containerId}`;
    return this.request({
      verb: 'POST',
      resourceType: 'docs',
      resourceLink,
      path: `${resourceLink}/docs`,
      headers: { 'Content-Type': 'application/json' },
      body: doc,
    });
  }

  async upsertDocument(containerId, doc) {
    const resourceLink = `dbs/${this.databaseId}/colls/${containerId}`;
    return this.request({
      verb: 'POST',
      resourceType: 'docs',
      resourceLink,
      path: `${resourceLink}/docs`,
      headers: {
        'Content-Type': 'application/json',
        'x-ms-documentdb-is-upsert': 'true',
      },
      body: doc,
    });
  }

  async readDocument(containerId, id, partitionKey) {
    const resourceLink = `dbs/${this.databaseId}/colls/${containerId}/docs/${id}`;
    try {
      return await this.request({
        verb: 'GET',
        resourceType: 'docs',
        resourceLink,
        path: resourceLink,
        headers: {
          'x-ms-documentdb-partitionkey': JSON.stringify([partitionKey]),
        },
      });
    } catch (error) {
      if (error?.statusCode === 404) return null;
      throw error;
    }
  }

  async deleteDocument(containerId, id, partitionKey) {
    const resourceLink = `dbs/${this.databaseId}/colls/${containerId}/docs/${id}`;
    return this.request({
      verb: 'DELETE',
      resourceType: 'docs',
      resourceLink,
      path: resourceLink,
      headers: {
        'x-ms-documentdb-partitionkey': JSON.stringify([partitionKey]),
      },
    });
  }
}

class CosmosResellerStore {
  constructor() {
    this.client = new CosmosRestClient();
    this.resellersContainerId = this.client.resellersContainerId;
    this.pricingContainerId = this.client.pricingContainerId;
  }

  async initialize() {
    return true;
  }

  async listResellers() {
    const docs = await this.client.queryDocuments(
      this.resellersContainerId,
      'SELECT * FROM c WHERE c.type = @type',
      [{ name: '@type', value: 'reseller' }],
      null,
    );
    return docs.map(normalizeReseller).sort((a, b) => a.companyName.localeCompare(b.companyName));
  }

  async getReseller(resellerId) {
    const doc = await this.client.readDocument(this.resellersContainerId, resellerId, resellerId);
    return doc ? normalizeReseller(doc) : null;
  }

  async createReseller(values) {
    const timestamp = nowIso();
    const resellerId = buildResellerId(values);
    const reseller = normalizeReseller({
      id: resellerId,
      resellerId,
      ...values,
      type: 'reseller',
      isActive: true,
      pricingInitialized: true,
      sourceTemplateId: DEFAULT_TEMPLATE_ID,
      credentials: emptyCredentials(values.email),
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await this.client.createDocument(this.resellersContainerId, reseller);
    for (const row of DEFAULT_TEMPLATE_ITEMS) {
      await this.client.createDocument(this.pricingContainerId, cloneTemplateRow(row, resellerId));
    }
    return reseller;
  }

  async updateReseller(resellerId, values) {
    const existing = await this.getReseller(resellerId);
    if (!existing) throw new Error('Reseller not found.');
    const updated = normalizeReseller({
      ...existing,
      ...values,
      id: resellerId,
      resellerId,
      credentials: {
        ...existing.credentials,
        loginEmail: existing.credentials.loginEmail || values.email || existing.email,
      },
      updatedAt: nowIso(),
    });
    await this.client.upsertDocument(this.resellersContainerId, updated);
    return updated;
  }

  async deleteReseller(resellerId) {
    const items = await this.getPricing(resellerId);
    for (const item of items) {
      await this.client.deleteDocument(this.pricingContainerId, item.id, resellerId);
    }
    await this.client.deleteDocument(this.resellersContainerId, resellerId, resellerId);
  }

  async getPricing(resellerId) {
    const docs = await this.client.queryDocuments(
      this.pricingContainerId,
      'SELECT * FROM c WHERE c.resellerId = @resellerId',
      [{ name: '@resellerId', value: resellerId }],
      resellerId,
    );
    return sortPricingItems(docs);
  }

  async updatePricingItem(resellerId, itemId, nextPrice) {
    const existing = await this.client.readDocument(this.pricingContainerId, itemId, resellerId);
    if (!existing) throw new Error('Pricing row not found.');
    const updated = { ...existing, price: Number(nextPrice), updatedAt: nowIso() };
    await this.client.upsertDocument(this.pricingContainerId, updated);
    return updated;
  }

  async getCredentialStatus(resellerId) {
    const reseller = await this.getReseller(resellerId);
    if (!reseller) throw new Error('Reseller not found.');
    return reseller.credentials;
  }

  async updateCredentials(resellerId, input) {
    const reseller = await this.getReseller(resellerId);
    if (!reseller) throw new Error('Reseller not found.');
    const updated = normalizeReseller({
      ...reseller,
      credentials: {
        ...reseller.credentials,
        loginEnabled: Boolean(input.loginEnabled),
        loginEmail: String(input.loginEmail ?? reseller.credentials.loginEmail ?? reseller.email ?? '').trim().toLowerCase(),
        hasPassword: reseller.credentials.hasPassword,
        passwordLastSetAt: reseller.credentials.passwordLastSetAt,
        passwordHashStatus: input.password ? 'pending_backend_hash' : (reseller.credentials.passwordHashStatus ?? 'not_set'),
      },
      updatedAt: nowIso(),
    });
    await this.client.upsertDocument(this.resellersContainerId, updated);
    return updated.credentials;
  }
}

let repositoryPromise;

export async function getResellerRepository() {
  if (!repositoryPromise) {
    repositoryPromise = (async () => {
      if (process.env.COSMOS_DB_ENDPOINT && process.env.COSMOS_DB_KEY) {
        const store = new CosmosResellerStore();
        await store.initialize();
        return store;
      }
      return new LocalResellerStore();
    })();
  }

  return repositoryPromise;
}
