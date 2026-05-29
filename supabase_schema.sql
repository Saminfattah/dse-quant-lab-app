-- DSE Quant Lab Supabase/Postgres schema.
-- Run this in Supabase SQL Editor if you cannot run Prisma locally.

CREATE TABLE IF NOT EXISTS daily_prices (
    id SERIAL PRIMARY KEY,
    trading_code TEXT NOT NULL,
    date DATE NOT NULL,
    open DOUBLE PRECISION,
    high DOUBLE PRECISION,
    low DOUBLE PRECISION,
    close DOUBLE PRECISION,
    volume DOUBLE PRECISION,
    trade_count DOUBLE PRECISION,
    source TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (trading_code, date)
);

CREATE TABLE IF NOT EXISTS intraday_prices (
    id SERIAL PRIMARY KEY,
    trading_code TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    ltp DOUBLE PRECISION,
    high DOUBLE PRECISION,
    low DOUBLE PRECISION,
    volume DOUBLE PRECISION,
    trade_count DOUBLE PRECISION,
    source TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (trading_code, timestamp)
);

CREATE TABLE IF NOT EXISTS stock_universe (
    id SERIAL PRIMARY KEY,
    trading_code TEXT NOT NULL,
    market_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    source TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (trading_code, market_date)
);

CREATE TABLE IF NOT EXISTS features (
    id SERIAL PRIMARY KEY,
    trading_code TEXT NOT NULL,
    date DATE NOT NULL,
    feature_set_version TEXT NOT NULL,
    features_json JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (trading_code, date, feature_set_version)
);

CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    trading_code TEXT NOT NULL,
    date DATE NOT NULL,
    prediction_time TIMESTAMP NOT NULL,
    probability_up DOUBLE PRECISION NOT NULL,
    signal TEXT NOT NULL,
    threshold DOUBLE PRECISION NOT NULL,
    model_version TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS signals (
    id SERIAL PRIMARY KEY,
    ticker TEXT NOT NULL,
    signal_date DATE NOT NULL,
    probability_up DOUBLE PRECISION NOT NULL,
    signal TEXT NOT NULL,
    model_version TEXT NOT NULL,
    latest_price DOUBLE PRECISION,
    vwap_deviation DOUBLE PRECISION,
    volume_status TEXT,
    liquidity_flag BOOLEAN NOT NULL DEFAULT FALSE,
    floor_price_flag BOOLEAN NOT NULL DEFAULT FALSE,
    reason_codes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_registry (
    id SERIAL PRIMARY KEY,
    model_version TEXT NOT NULL UNIQUE,
    training_start_date DATE,
    training_end_date DATE,
    validation_period TEXT,
    test_period TEXT,
    feature_set_version TEXT,
    threshold DOUBLE PRECISION,
    precision DOUBLE PRECISION,
    recall DOUBLE PRECISION,
    f1_score DOUBLE PRECISION,
    roc_auc DOUBLE PRECISION,
    pr_auc DOUBLE PRECISION,
    model_path TEXT,
    feature_list_path TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS paper_accounts (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'single-user',
    account_name TEXT NOT NULL DEFAULT 'Paper Portfolio',
    starting_capital_bdt DOUBLE PRECISION NOT NULL,
    cash_balance_bdt DOUBLE PRECISION NOT NULL,
    current_portfolio_value_bdt DOUBLE PRECISION NOT NULL,
    mode TEXT NOT NULL DEFAULT 'paper',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS paper_positions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES paper_accounts(id) ON DELETE CASCADE,
    ticker TEXT NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    average_price DOUBLE PRECISION NOT NULL,
    latest_price DOUBLE PRECISION,
    market_value DOUBLE PRECISION NOT NULL DEFAULT 0,
    state TEXT NOT NULL,
    settlement_date DATE NOT NULL,
    realized_pnl DOUBLE PRECISION NOT NULL DEFAULT 0,
    unrealized_pnl DOUBLE PRECISION NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS paper_trades (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES paper_accounts(id) ON DELETE CASCADE,
    ticker TEXT NOT NULL,
    action TEXT NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    gross_value DOUBLE PRECISION NOT NULL,
    transaction_cost DOUBLE PRECISION NOT NULL,
    slippage DOUBLE PRECISION NOT NULL,
    net_value DOUBLE PRECISION NOT NULL,
    trade_date DATE NOT NULL,
    settlement_date DATE NOT NULL,
    status TEXT NOT NULL,
    realized_pnl DOUBLE PRECISION NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS paper_equity_curve (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES paper_accounts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    cash_balance DOUBLE PRECISION NOT NULL,
    holdings_value DOUBLE PRECISION NOT NULL,
    pending_value DOUBLE PRECISION NOT NULL,
    total_equity DOUBLE PRECISION NOT NULL,
    daily_pnl DOUBLE PRECISION NOT NULL DEFAULT 0,
    cumulative_return DOUBLE PRECISION NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (account_id, date)
);

CREATE TABLE IF NOT EXISTS watchlist (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'single-user',
    ticker TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, ticker)
);

CREATE TABLE IF NOT EXISTS backtest_runs (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'single-user',
    run_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    starting_capital_bdt DOUBLE PRECISION NOT NULL,
    max_allocation_per_stock DOUBLE PRECISION NOT NULL,
    max_open_positions INTEGER NOT NULL,
    buy_threshold DOUBLE PRECISION NOT NULL,
    slippage_rate DOUBLE PRECISION NOT NULL,
    transaction_cost_rate DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL,
    result_json JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_prices_ticker_date ON daily_prices(trading_code, date);
CREATE INDEX IF NOT EXISTS idx_predictions_ticker_time ON predictions(trading_code, prediction_time);
CREATE INDEX IF NOT EXISTS idx_signals_ticker_date ON signals(ticker, signal_date);
CREATE INDEX IF NOT EXISTS idx_paper_positions_account ON paper_positions(account_id);
CREATE INDEX IF NOT EXISTS idx_paper_trades_account ON paper_trades(account_id);

