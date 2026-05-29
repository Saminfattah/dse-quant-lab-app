# DSE Quant Lab

DSE Quant Lab is a Vercel-ready Next.js dashboard for DSE research, paper trading, model signal review, and backtest visualization. It is designed to sit on top of the Python data worker from the previous project.

The app does **not** execute real trades, call broker APIs, auto-click broker screens, or route orders into a BO account. It is paper trading and decision support only.

## Product Overview

The app lets you:

- View DSE ticker data and charts.
- Review model-generated `BUY WATCH`, `HOLD`, `AVOID`, and `SELL REVIEW` signals.
- Choose paper capital in BDT, starting with a default of `৳1,000,000`.
- Track virtual cash, holdings, pending T+2 positions, realized P&L, unrealized P&L, and trade history.
- Submit manual paper buys and sells.
- Queue backtest jobs for the Python worker.
- View risk warnings and model/data status.

## Vercel-Friendly Architecture

```text
Python Data Worker
  -> Kaggle/bdshare ingestion
  -> feature engineering
  -> LightGBM training
  -> prediction/signal generation
  -> backtest calculations
  -> hosted PostgreSQL
  -> Next.js app on Vercel
  -> interactive dashboard and paper trading UI
```

Vercel hosts the Next.js frontend and lightweight API routes only. Heavy ingestion, scraping, model training, and long-running backtests should run outside Vercel on Render, Railway, Fly.io, a VPS, GitHub Actions, or your local machine.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI primitives
- Recharts
- Prisma ORM
- Hosted PostgreSQL, recommended Supabase Postgres for MVP
- Vercel deployment

## Database

The Prisma schema in [prisma/schema.prisma](./prisma/schema.prisma) includes:

- Existing worker tables: `daily_prices`, `intraday_prices`, `stock_universe`, `features`, `predictions`, `model_registry`
- App tables: `paper_accounts`, `paper_positions`, `paper_trades`, `paper_equity_curve`, `watchlist`, `signals`, `backtest_runs`

The deployed app should use PostgreSQL. SQLite can remain in the Python worker for local experiments, but production should point both the worker and the app to the same hosted database.

## Environment

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Required:

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_NAME=DSE Quant Lab
NEXT_PUBLIC_DEFAULT_CURRENCY=BDT
```

Optional alert variables:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
EMAIL_SERVER=
EMAIL_FROM=
```

Never commit real secrets.

## Local Development

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Open the URL printed by Next.js, usually:

```text
http://localhost:3000
```

## Paper Trading Flow

1. Open `/paper-trading/setup`.
2. Choose a paper capital amount, for example `৳1,000,000`.
3. Click `Start Paper Trading`.
4. The app creates a `paper_accounts` row with cash equal to the starting capital.
5. Use `/paper-trading/trade` to submit virtual buys and sells.
6. Track holdings at `/paper-trading/portfolio`.

The quick buttons are:

- `৳100,000`
- `৳500,000`
- `৳1,000,000`
- `৳2,500,000`
- `৳5,000,000`

Resetting a paper portfolio requires typing `RESET`.

## T+2 Settlement Model

- A paper buy reduces cash immediately.
- A paper buy creates a pending position.
- Pending positions become settled after T+2 business days.
- Pending holdings cannot be sold.
- Paper sells are allowed only for settled quantity.
- Short selling is blocked.
- Every paper action is saved in `paper_trades`.

The MVP skips a full Bangladesh exchange holiday calendar. Add one later for exact settlement treatment around market holidays.

## API Routes

- `POST /api/paper-account/create`
- `POST /api/paper-account/reset`
- `GET /api/paper-portfolio`
- `POST /api/paper-trades/buy`
- `POST /api/paper-trades/sell`
- `GET /api/signals`
- `GET /api/tickers`
- `GET /api/tickers/[ticker]`
- `POST /api/backtests/run`
- `GET /api/backtests/[id]`
- `GET /api/health`

## Python Worker Integration

The Python worker from the previous project should write to the hosted PostgreSQL database:

- Historical prices -> `daily_prices`
- Intraday snapshots -> `intraday_prices`
- Universe refresh -> `stock_universe`
- Feature output -> `features`
- LightGBM predictions -> `predictions` and/or `signals`
- Model metadata -> `model_registry`
- Backtest output -> `backtest_runs.result_json`

The Vercel app reads these tables and manages paper-trading tables directly.

For backtests, the UI creates a queued `backtest_runs` row. A separate worker should poll queued rows, compute results, and update `status` plus `result_json`.

## Supabase or Neon Setup

Supabase:

1. Create a Supabase project.
2. Copy the pooled or direct PostgreSQL connection string.
3. Set `DATABASE_URL` locally and in Vercel.
4. Run `npx prisma migrate dev` locally or `npx prisma migrate deploy` in deployment.

Neon:

1. Create a Neon project and database.
2. Copy the connection string.
3. Set `DATABASE_URL`.
4. Run Prisma migrations.

## Vercel Deployment

CLI:

```bash
npm run build
vercel
```

GitHub-to-Vercel:

1. Push this app to GitHub.
2. Import the repo in Vercel.
3. Add `DATABASE_URL` and public env variables.
4. Set build command: `npm run build`.
5. Deploy.

For production migrations:

```bash
npx prisma migrate deploy
```

## Testing Checklist

- Create paper account with `৳1,000,000`.
- Select each BDT quick amount.
- Reject invalid capital values.
- Reset account only after typed `RESET`.
- Paper buy succeeds with enough cash.
- Paper buy fails with insufficient cash.
- Paper sell succeeds with settled holdings.
- Paper sell fails with pending T+2 holdings.
- Paper sell fails when quantity exceeds settled quantity.
- Short selling remains impossible.
- T+2 settlement updates pending holdings to settled.
- Portfolio value equals cash plus holdings.
- Signal table loads from `signals` or `predictions`.
- Ticker detail page loads price and volume charts.
- Backtest page queues a job without running heavy compute in Vercel.
- `/api/health` confirms database connection.
- `npm run build` succeeds before Vercel deploy.

## Risk Disclaimer

This app is not financial advice. It is paper trading by default. Model predictions can be wrong. Backtests can overfit. DSE liquidity can be low. Floor-price behavior can distort data. T+2 settlement can lock positions. Data may be delayed, incomplete, or inaccurate. Human review is required before any real trade.

