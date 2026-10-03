# MarketHub server

NestJS 11 REST API on PostgreSQL (Prisma).

Setup, database in Docker and the full local stack are described in the [root README](../README.md).

```bash
cp .env.example .env
yarn install
yarn db:up && yarn db:deploy
yarn start:dev      # http://localhost:5000
yarn lint
yarn build
```

## Modules

`auth` (JWT access token + refresh token in an HttpOnly cookie, Google OAuth) · `user` · `store` · `category` ·
`color` · `product` · `order` · `review` · `statistics` · `file` (image uploads) · `prisma` (one global client).

## Rules worth knowing

- **Ownership:** every store-scoped resource is checked with `assertStoreOwner` / `store: { userId }`;
  other people's resources answer `404`.
- **Prices come from the database.** `POST /orders/place` accepts only `productId` and `quantity`.
- **Validation:** global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`).
- **Uploads:** only JPEG/PNG/GIF/WebP (checked by content), max 5 MB, stored under `uploads/products`
  with generated names; files nobody uses anymore are deleted.
- **Rate limits:** 100 requests/min per IP, login and registration 5/min, uploads 20/min.
  Set `TRUST_PROXY=1` behind a reverse proxy.
- **Statistics** count `PENDING` orders as sales until a payment provider exists (`COUNTED_STATUSES`).
