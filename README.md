## React shop

React, Next.js, Redux Toolkit, Tailwind, Shadcn UI, Nest.js, PostgreSQL, Prisma

## Getting started

Requirements: Node.js 22, Yarn 1, Docker.

### 1. Database

```bash
cd server
yarn install
yarn db:up          # Postgres 17 in Docker (docker-compose.yml in the repo root)
```

The data lives in the `markethub_db-data` Docker volume. `yarn db:down` stops the
container and keeps the data, `docker compose down -v` (in the repo root) deletes it.
Port, user, password and database name can be overridden through a root `.env`
(see `.env.example`).

### 2. Server (http://localhost:5000)

```bash
cd server
cp .env.example .env     # fill in JWT_SECRET and JWT_REFRESH_SECRET (two different values)
yarn db:deploy           # applies prisma/migrations to the empty database
yarn start:dev
```

Useful database commands:

| Command | What it does |
|---|---|
| `yarn db:migrate` | create and apply a new migration after you change `schema.prisma` |
| `yarn db:deploy` | apply existing migrations (CI / production) |
| `yarn db:reset` | drop everything and re-apply all migrations (dev only) |
| `yarn db:studio` | open Prisma Studio |
| `yarn db:test:up` | start a throw-away Postgres on port 5433 for integration tests |

### 3. Client (http://localhost:3000)

Create `client/.env`:

```
APP_ENV=development
APP_URL=http://localhost:3000
APP_DOMAIN=localhost
SERVER_URL=http://localhost:5000
```

```bash
cd client
yarn install
yarn dev
```

## API notes

`GET /products` is the public catalog and returns `{ items, meta: { page, limit, total, totalPages } }`.

| Query param | Meaning |
|---|---|
| `searchTerm` | case-insensitive match in title / description (max 100 chars) |
| `categoryId`, `minPrice`, `maxPrice` | filters |
| `sort` | `newest` (default), `price_asc`, `price_desc` |
| `page`, `limit` | pagination, `limit` is 1-48 (default 12) |

Unknown query parameters or body properties are rejected with `400` (global `ValidationPipe`
with `whitelist` + `forbidNonWhitelisted`). Login and registration are limited to 5 requests per
minute per IP, everything else to 100 per minute.
