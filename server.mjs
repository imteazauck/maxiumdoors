import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getResellerRepository } from './server/resellerRepository.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;
const root = path.join(__dirname, 'dist');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function sendError(res, error, fallback = 'Request failed.', status = 500) {
  console.error(error);
  res.status(status).json({ error: error instanceof Error ? error.message : fallback });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/backoffice/resellers', async (_req, res) => {
  try {
    const repository = await getResellerRepository();
    res.json(await repository.listResellers());
  } catch (error) {
    sendError(res, error, 'Unable to list resellers.');
  }
});

app.post('/api/backoffice/resellers', async (req, res) => {
  try {
    const repository = await getResellerRepository();
    const reseller = await repository.createReseller(req.body ?? {});
    res.status(201).json(reseller);
  } catch (error) {
    sendError(res, error, 'Unable to create reseller.');
  }
});

app.get('/api/backoffice/resellers/:resellerId', async (req, res) => {
  try {
    const repository = await getResellerRepository();
    const reseller = await repository.getReseller(req.params.resellerId);
    if (!reseller) {
      res.status(404).json({ error: 'Reseller not found.' });
      return;
    }
    res.json(reseller);
  } catch (error) {
    sendError(res, error, 'Unable to load reseller.');
  }
});

app.put('/api/backoffice/resellers/:resellerId', async (req, res) => {
  try {
    const repository = await getResellerRepository();
    const reseller = await repository.updateReseller(req.params.resellerId, req.body ?? {});
    res.json(reseller);
  } catch (error) {
    const status = error instanceof Error && error.message === 'Reseller not found.' ? 404 : 500;
    sendError(res, error, 'Unable to update reseller.', status);
  }
});

app.delete('/api/backoffice/resellers/:resellerId', async (req, res) => {
  try {
    const repository = await getResellerRepository();
    await repository.deleteReseller(req.params.resellerId);
    res.status(204).end();
  } catch (error) {
    sendError(res, error, 'Unable to delete reseller.');
  }
});

app.get('/api/backoffice/resellers/:resellerId/pricing', async (req, res) => {
  try {
    const repository = await getResellerRepository();
    res.json(await repository.getPricing(req.params.resellerId));
  } catch (error) {
    sendError(res, error, 'Unable to load reseller pricing.');
  }
});

app.put('/api/backoffice/resellers/:resellerId/pricing/:itemId', async (req, res) => {
  try {
    const repository = await getResellerRepository();
    const nextPrice = Number(req.body?.price);
    if (!Number.isFinite(nextPrice) || nextPrice < 0) {
      res.status(400).json({ error: 'A valid non-negative price is required.' });
      return;
    }
    const updated = await repository.updatePricingItem(req.params.resellerId, req.params.itemId, nextPrice);
    res.json(updated);
  } catch (error) {
    sendError(res, error, 'Unable to update reseller pricing.');
  }
});

app.get('/api/backoffice/resellers/:resellerId/credentials', async (req, res) => {
  try {
    const repository = await getResellerRepository();
    res.json(await repository.getCredentialStatus(req.params.resellerId));
  } catch (error) {
    const status = error instanceof Error && error.message === 'Reseller not found.' ? 404 : 500;
    sendError(res, error, 'Unable to load reseller credentials.', status);
  }
});

app.post('/api/backoffice/resellers/:resellerId/credentials', async (req, res) => {
  try {
    const repository = await getResellerRepository();
    const credentials = await repository.updateCredentials(req.params.resellerId, req.body ?? {});
    res.json(credentials);
  } catch (error) {
    const status = error instanceof Error && error.message === 'Reseller not found.' ? 404 : 500;
    sendError(res, error, 'Unable to update reseller credentials.', status);
  }
});

app.use(express.static(root));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
