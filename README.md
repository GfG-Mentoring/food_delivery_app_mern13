# Food delivery app (MERN stack)

Demo food-ordering UI with a JWT-backed Express API and MongoDB-backed restaurant data (geo queries). Each package under `frontend/` and `backend/` is independent; use **pnpm** in each directory.

## Codebase overview

| Path | Purpose |
|------|---------|
| `frontend/` | React 19 SPA (Vite, React Router v7), Redux Toolkit, Tailwind CSS v4 |
| `backend/` | Express 5 REST API (auth, `/restaurants` with `lat` / `lng` / `radiusKm`), Mongoose, Vitest integration tests |
| `docs/` | Notes and UI reference images |
| `.cursor/rules/` | Cursor workspace rules for agents (see [AI tooling](#ai-tooling)) |

### Frontend routes

- `/` — landing (restaurant list; uses browser geolocation when allowed, then `/restaurants` query params)
- `/r/:restaurantId` — restaurant detail & menu
- `/sign-in`, `/sign-up` — JWT auth flows

### API surface (high level)

- Health check, auth (register / login / current user where applicable), restaurants list with geo filters and by id (`backend/src/routes/`)

## Prerequisites

- **Node.js** (compatible with the pinned TypeScript toolchain in each package)
- **pnpm** 10.x (`corepack enable` or install from [pnpm.io](https://pnpm.io))
- **MongoDB** — local (`mongodb://127.0.0.1:27017/...`) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (configure via env as below)

## Setup

### 1. Backend

```bash
cd backend
pnpm install
cp .env.example .env
```

Edit `.env`:

- Prefer **`MONGODB_URI`**, or set **`MONGO_USERNAME`**, **`MONGO_PASSWORD`**, **`MONGO_CLUSTER`** (full Atlas host, e.g. `cluster0.xxxxx.mongodb.net`), and **`MONGO_DATABASE`**
- Set **`JWT_SECRET`** (required for production-grade deploys)

Start the API (default port **3000**):

```bash
pnpm dev
```

Optional: populate sample Bangalore-area restaurants:

```bash
pnpm seed
```

Run tests:

```bash
pnpm test
```

### 2. Frontend

```bash
cd frontend
pnpm install
cp .env.example .env
```

`VITE_API_URL` must match the backend origin (no trailing slash), e.g. `http://localhost:3000`.

```bash
pnpm dev
pnpm build    # production build
pnpm lint
```

Geolocation (`navigator.geolocation`) works on **HTTPS** or **localhost**; otherwise the client falls back to a fixed centroid and still loads data when the API is reachable.

### 3. Point frontend at deployed API

Copy `frontend/.env.example` to `.env` and set `VITE_API_URL` to your API base URL before `pnpm build`.

## Scripts quick reference

| Location | Command | Description |
|---------|---------|-------------|
| `backend/` | `pnpm dev` | Watch-mode TS server |
| `backend/` | `pnpm build` / `pnpm start` | Compile & run production build |
| `backend/` | `pnpm seed` | Seed restaurants (requires DB) |
| `backend/` | `pnpm test` | Vitest integration tests |
| `frontend/` | `pnpm dev` | Vite dev server |
| `frontend/` | `pnpm build` | Typecheck + Vite build |
| `frontend/` | `pnpm lint` | ESLint |

## AI tooling (Cursor)

This repo includes **Cursor project rules** under [`.cursor/rules/`](.cursor/rules/):

- **`pnpm.mdc`** — use **pnpm** only; run installs and scripts from `frontend/` or `backend/`; keep `pnpm-lock.yaml`, do not add npm/yarn lockfiles.
- **`tailwind-css.mdc`** — prefer **Tailwind** utilities in the React app, `clsx` + `tailwind-merge` / `cn()`, theme tokens over one-off colors, no new CSS-in-JS stacks unless requested.

These rules apply automatically to AI edits in Cursor; keep them aligned when you change stack or tooling.

## Contributing

Use **pnpm** in each workspace. `.env` and `.pnpm-store/` are intentionally not tracked (see root `.gitignore`).
