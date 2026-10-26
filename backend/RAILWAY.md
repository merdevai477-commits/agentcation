# Backend on Railway (from `main`)

1. In the same Railway project as the frontend, click **New → GitHub Repo** (same repo).
2. Set **Root Directory** to `backend`.
3. Connect Postgres + Redis (or paste variables):
   - `DATABASE_URL` — from Postgres plugin (public URL + `?sslmode=require`)
   - `REDIS_URL` — from Redis plugin
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CORS_ORIGIN` — your frontend domain (e.g. `https://agintication.com`)
   - `PORT` — Railway sets this automatically; optional
4. Deploy from branch **`main`**.
5. Release runs `prisma migrate deploy` automatically via `railway.toml`.
