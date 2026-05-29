import { prisma } from "@/lib/db";
import { calculateSettlementDate } from "@/lib/settlement";

const SINGLE_USER_ID = "single-user";
const DEFAULT_SLIPPAGE_RATE = 0.002;
const DEFAULT_TRANSACTION_COST_RATE = 0;

export async function getActivePaperAccount() {
  return prisma.paperAccount.findFirst({
    where: { userId: SINGLE_USER_ID, mode: "paper" },
    orderBy: { createdAt: "desc" }
  });
}

export async function createPaperAccount(startingCapital: number) {
  if (!Number.isFinite(startingCapital) || startingCapital <= 0) {
    throw new Error("Starting paper capital must be greater than 0.");
  }
  return prisma.paperAccount.create({
    data: {
      userId: SINGLE_USER_ID,
      accountName: "DSE Quant Lab Paper Portfolio",
      startingCapitalBdt: startingCapital,
      cashBalanceBdt: startingCapital,
      currentPortfolioValueBdt: startingCapital,
      mode: "paper"
    }
  });
}

export async function resetPaperAccount(accountId: number, startingCapital: number) {
  if (startingCapital <= 0) throw new Error("Starting paper capital must be greater than 0.");
  return prisma.$transaction(async (tx) => {
    await tx.paperEquityCurve.deleteMany({ where: { accountId } });
    await tx.paperTrade.deleteMany({ where: { accountId } });
    await tx.paperPosition.deleteMany({ where: { accountId } });
    return tx.paperAccount.update({
      where: { id: accountId },
      data: {
        startingCapitalBdt: startingCapital,
        cashBalanceBdt: startingCapital,
        currentPortfolioValueBdt: startingCapital
      }
    });
  });
}

export async function getAvailableCash(accountId: number) {
  const account = await prisma.paperAccount.findUnique({ where: { id: accountId } });
  return account?.cashBalanceBdt ?? 0;
}

export async function getSettledHoldings(accountId: number, ticker?: string) {
  return prisma.paperPosition.findMany({
    where: {
      accountId,
      ...(ticker ? { ticker } : {}),
      state: "settled",
      quantity: { gt: 0 }
    },
    orderBy: { ticker: "asc" }
  });
}

export async function getPendingHoldings(accountId: number) {
  return prisma.paperPosition.findMany({
    where: {
      accountId,
      state: { in: ["pending_t1", "pending_t2"] },
      quantity: { gt: 0 }
    },
    orderBy: { settlementDate: "asc" }
  });
}

export async function refreshSettlementStates(accountId: number, asOf = new Date()) {
  const pending = await prisma.paperPosition.findMany({
    where: { accountId, state: { in: ["pending_t1", "pending_t2"] } }
  });
  await Promise.all(
    pending.map((position) => {
      const settlement = new Date(position.settlementDate);
      const nextState = settlement <= asOf ? "settled" : "pending_t1";
      return prisma.paperPosition.update({
        where: { id: position.id },
        data: { state: nextState }
      });
    })
  );
}

export async function executePaperBuy(
  accountId: number,
  ticker: string,
  quantity: number,
  price: number,
  tradeDate = new Date(),
  slippageRate = DEFAULT_SLIPPAGE_RATE,
  transactionCostRate = DEFAULT_TRANSACTION_COST_RATE
) {
  if (quantity <= 0 || price <= 0) throw new Error("Quantity and price must be greater than 0.");
  const normalizedTicker = ticker.toUpperCase().trim();
  const effectivePrice = price * (1 + slippageRate);
  const grossValue = effectivePrice * quantity;
  const transactionCost = grossValue * transactionCostRate;
  const netValue = grossValue + transactionCost;
  const settlementDate = calculateSettlementDate(tradeDate);

  return prisma.$transaction(async (tx) => {
    const account = await tx.paperAccount.findUnique({ where: { id: accountId } });
    if (!account) throw new Error("Paper account not found.");
    if (account.cashBalanceBdt < netValue) throw new Error("Insufficient paper cash.");

    await tx.paperAccount.update({
      where: { id: accountId },
      data: {
        cashBalanceBdt: account.cashBalanceBdt - netValue,
        currentPortfolioValueBdt: account.currentPortfolioValueBdt
      }
    });

    const position = await tx.paperPosition.create({
      data: {
        accountId,
        ticker: normalizedTicker,
        quantity,
        averagePrice: effectivePrice,
        latestPrice: price,
        marketValue: price * quantity,
        state: "pending_t2",
        settlementDate,
        unrealizedPnl: (price - effectivePrice) * quantity
      }
    });

    const trade = await tx.paperTrade.create({
      data: {
        accountId,
        ticker: normalizedTicker,
        action: "BUY",
        quantity,
        price: effectivePrice,
        grossValue,
        transactionCost,
        slippage: grossValue - price * quantity,
        netValue,
        tradeDate,
        settlementDate,
        status: "pending_settlement",
        notes: "Paper buy only. Manual real-money review required."
      }
    });

    return { position, trade };
  });
}

export async function executePaperSell(
  accountId: number,
  ticker: string,
  quantity: number,
  price: number,
  tradeDate = new Date(),
  slippageRate = DEFAULT_SLIPPAGE_RATE,
  transactionCostRate = DEFAULT_TRANSACTION_COST_RATE
) {
  if (quantity <= 0 || price <= 0) throw new Error("Quantity and price must be greater than 0.");
  const normalizedTicker = ticker.toUpperCase().trim();
  await refreshSettlementStates(accountId, tradeDate);

  return prisma.$transaction(async (tx) => {
    const account = await tx.paperAccount.findUnique({ where: { id: accountId } });
    if (!account) throw new Error("Paper account not found.");
    const positions = await tx.paperPosition.findMany({
      where: { accountId, ticker: normalizedTicker, state: "settled", quantity: { gt: 0 } },
      orderBy: { createdAt: "asc" }
    });
    const settledQuantity = positions.reduce((sum, position) => sum + position.quantity, 0);
    if (settledQuantity < quantity) {
      throw new Error("Cannot sell more than settled holdings. Pending T+2 shares are locked.");
    }

    let remaining = quantity;
    let realizedPnl = 0;
    for (const position of positions) {
      if (remaining <= 0) break;
      const sellQuantity = Math.min(remaining, position.quantity);
      const pnl = (price * (1 - slippageRate) - position.averagePrice) * sellQuantity;
      realizedPnl += pnl;
      remaining -= sellQuantity;
      await tx.paperPosition.update({
        where: { id: position.id },
        data: {
          quantity: position.quantity - sellQuantity,
          marketValue: (position.quantity - sellQuantity) * price,
          latestPrice: price,
          realizedPnl: position.realizedPnl + pnl,
          unrealizedPnl: (price - position.averagePrice) * (position.quantity - sellQuantity),
          state: position.quantity - sellQuantity <= 0 ? "closed" : "settled"
        }
      });
    }

    const effectivePrice = price * (1 - slippageRate);
    const grossValue = effectivePrice * quantity;
    const transactionCost = grossValue * transactionCostRate;
    const netValue = grossValue - transactionCost;
    await tx.paperAccount.update({
      where: { id: accountId },
      data: { cashBalanceBdt: account.cashBalanceBdt + netValue }
    });
    const trade = await tx.paperTrade.create({
      data: {
        accountId,
        ticker: normalizedTicker,
        action: "SELL",
        quantity,
        price: effectivePrice,
        grossValue,
        transactionCost,
        slippage: price * quantity - grossValue,
        netValue,
        tradeDate,
        settlementDate: calculateSettlementDate(tradeDate),
        status: "paper_executed",
        realizedPnl,
        notes: "Paper sell only. No short selling."
      }
    });
    return { trade };
  });
}

export async function calculatePortfolioValue(accountId: number) {
  await refreshSettlementStates(accountId);
  const account = await prisma.paperAccount.findUnique({ where: { id: accountId } });
  if (!account) throw new Error("Paper account not found.");
  const positions = await prisma.paperPosition.findMany({
    where: { accountId, quantity: { gt: 0 }, state: { not: "closed" } }
  });
  const holdingsValue = positions.reduce((sum, position) => sum + position.marketValue, 0);
  const pendingValue = positions
    .filter((position) => position.state !== "settled")
    .reduce((sum, position) => sum + position.marketValue, 0);
  const totalEquity = account.cashBalanceBdt + holdingsValue;
  await prisma.paperAccount.update({
    where: { id: accountId },
    data: { currentPortfolioValueBdt: totalEquity }
  });
  return {
    cashBalance: account.cashBalanceBdt,
    holdingsValue,
    pendingValue,
    totalEquity,
    positions
  };
}

export async function updatePaperEquityCurve(accountId: number) {
  const account = await prisma.paperAccount.findUnique({ where: { id: accountId } });
  if (!account) throw new Error("Paper account not found.");
  const value = await calculatePortfolioValue(accountId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const prior = await prisma.paperEquityCurve.findFirst({
    where: { accountId },
    orderBy: { date: "desc" }
  });
  const dailyPnl = value.totalEquity - (prior?.totalEquity ?? account.startingCapitalBdt);
  return prisma.paperEquityCurve.upsert({
    where: { accountId_date: { accountId, date: today } },
    update: {
      cashBalance: value.cashBalance,
      holdingsValue: value.holdingsValue,
      pendingValue: value.pendingValue,
      totalEquity: value.totalEquity,
      dailyPnl,
      cumulativeReturn: value.totalEquity / account.startingCapitalBdt - 1
    },
    create: {
      accountId,
      date: today,
      cashBalance: value.cashBalance,
      holdingsValue: value.holdingsValue,
      pendingValue: value.pendingValue,
      totalEquity: value.totalEquity,
      dailyPnl,
      cumulativeReturn: value.totalEquity / account.startingCapitalBdt - 1
    }
  });
}

