# MarketHub client

Next.js 16 (App Router) storefront and seller dashboard.

Setup and the full local stack are described in the [root README](../README.md).

```bash
cp .env.example .env
yarn install
yarn dev       # http://localhost:3000
yarn lint      # ESLint (flat config, eslint-config-next)
yarn build     # needs the API to be reachable
```

## Structure

| Path | What is there |
|---|---|
| `src/app/(root)` | public shop: home, catalog (`/explorer`), category, product, user dashboard |
| `src/app/store/[storeId]` | seller dashboard: products, categories, colors, statistics |
| `src/proxy.ts` | redirects guests away from private pages and signed-in users away from `/auth` |
| `src/services` | API calls (axios); `src/api` holds the client with token refresh |
| `src/store` | Redux Toolkit: only the cart (persisted). Server data lives in TanStack Query |

The catalog and category pages are server-rendered and driven by the URL (`?page=`, `?sort=`, `?searchTerm=`).
