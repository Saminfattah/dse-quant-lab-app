import { z } from "zod";

export const capitalSchema = z.object({
  startingCapitalBdt: z.number().positive("Paper capital must be greater than 0.")
});

export const resetAccountSchema = z.object({
  accountId: z.number().int().positive(),
  startingCapitalBdt: z.number().positive(),
  confirmation: z.literal("RESET")
});

export const paperTradeSchema = z.object({
  accountId: z.number().int().positive().optional(),
  ticker: z.string().min(1).transform((value) => value.toUpperCase().trim()),
  quantity: z.number().positive(),
  price: z.number().positive(),
  tradeDate: z.string().optional()
});

export const backtestRunSchema = z.object({
  runName: z.string().min(1).default("UI Backtest"),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  startingCapitalBdt: z.number().positive(),
  maxAllocationPerStock: z.number().positive().max(1),
  maxOpenPositions: z.number().int().positive(),
  buyThreshold: z.number().min(0).max(1),
  slippageRate: z.number().min(0).max(1),
  transactionCostRate: z.number().min(0).max(1)
});

