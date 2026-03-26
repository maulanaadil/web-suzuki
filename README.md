# web-suzuki

Next.js app with PostgreSQL running in Docker and Prisma as ORM.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment file:

```bash
cp .env.example .env
```

3. Start PostgreSQL in Docker:

```bash
pnpm docker:db:up
```

4. Generate Prisma Client:

```bash
pnpm prisma:generate
```

5. Apply migrations:

```bash
pnpm prisma:migrate:deploy
```

6. Import Suzuki catalog + OTR prices:

```bash
pnpm ingest:suzuki
```

7. Run the app:

```bash
pnpm dev
```

## Useful Commands

- `pnpm docker:db:up` - start PostgreSQL container
- `pnpm docker:db:down` - stop and remove containers
- `pnpm docker:db:logs` - view PostgreSQL logs
- `pnpm prisma:generate` - regenerate Prisma Client
- `pnpm prisma:migrate:dev` - create/apply migration in development
- `pnpm prisma:migrate:deploy` - apply existing migrations in non-dev environments
- `pnpm prisma:studio` - open Prisma Studio
- `pnpm ingest:suzuki:dry` - scrape and parse without database writes
- `pnpm ingest:suzuki` - scrape Suzuki catalog and upsert catalog + prices
