# Maxium Doors admin and reseller project

This version includes:
- admin dashboard button for **Manage resellers**
- reseller CRUD screens
- cloned per-reseller pricing matrix from the default template
- backend API routes for reseller profile, credentials, and pricing updates
- persistence through the backend, with Cosmos DB support when environment variables are supplied

## Run locally

```bash
npm install
npm run build
npm start
```

The app serves the built frontend and the reseller admin API from the same Node server.

## Reseller backend routes

- `GET /api/backoffice/resellers`
- `POST /api/backoffice/resellers`
- `GET /api/backoffice/resellers/:resellerId`
- `PUT /api/backoffice/resellers/:resellerId`
- `DELETE /api/backoffice/resellers/:resellerId`
- `GET /api/backoffice/resellers/:resellerId/pricing`
- `PUT /api/backoffice/resellers/:resellerId/pricing/:itemId`
- `GET /api/backoffice/resellers/:resellerId/credentials`
- `POST /api/backoffice/resellers/:resellerId/credentials`

## Cosmos DB configuration

Set these server environment variables before starting the Node server:

```bash
COSMOS_DB_ENDPOINT=
COSMOS_DB_KEY=
COSMOS_DB_DATABASE=maxiumdoors
COSMOS_DB_RESELLERS_CONTAINER=resellers
COSMOS_DB_PRICING_CONTAINER=resellerPricing
```

Recommended partition key:
- `resellers` container: `/resellerId`
- `resellerPricing` container: `/resellerId`

If the Cosmos environment variables are not supplied, the reseller backend falls back to a local JSON file at `data/reseller-backoffice.json` for local development.

## Password hashing status

Reseller credential enablement and login email are now persisted through the backend.
Password hashing and secure password storage are intentionally left for the next backend pass.
