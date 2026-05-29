# Product and Implementation Plan

## Design Overview

DSE Quant Lab is a professional finance dashboard with a simple first-run path: choose BDT paper capital, create a virtual account, then review model signals and paper trade performance. The visual language is clean, restrained, and dashboard-first with clear Paper Mode labeling.

## Pages

- Landing page
- Dashboard home
- Paper trading setup
- Paper portfolio
- Manual paper trade
- Model signals
- Ticker list
- Ticker detail
- Backtesting
- Watchlist
- Settings
- Risk disclaimer

## Components

- App shell, sidebar, topbar, theme provider
- Summary cards
- BDT capital selector
- Portfolio summary
- Holdings table
- Trade form
- Trade history table
- Signal table, signal badge, probability bar, reason codes
- Equity curve, price, volume, and backtest charts

## API Design

The API routes are lightweight database actions. They do not run model training, scraping, or long-running backtests.

## Paper Trading Logic

The app implements long-only paper trading with cash checks, T+2 pending states, settlement updates, no short selling, realized/unrealized P&L, and immutable trade logs.

## Backend Integration

The Python worker writes processed market data, features, predictions, registry metadata, signals, and completed backtest results into PostgreSQL. The Next.js app reads those outputs and manages paper account state.

