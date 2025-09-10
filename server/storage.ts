import {
  users,
  bets,
  transactions,
  type User,
  type UpsertUser,
  type Bet,
  type InsertBet,
  type Transaction,
  type InsertTransaction,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sum, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Bet operations
  createBet(bet: InsertBet & { userId: string }): Promise<Bet>;
  getBets(userId: string): Promise<Bet[]>;
  getBet(id: string, userId: string): Promise<Bet | undefined>;
  updateBet(id: string, userId: string, updates: Partial<InsertBet>): Promise<Bet | undefined>;
  deleteBet(id: string, userId: string): Promise<boolean>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction & { userId: string }): Promise<Transaction>;
  getTransactions(userId: string): Promise<Transaction[]>;
  getTransaction(id: string, userId: string): Promise<Transaction | undefined>;
  
  // Analytics
  getBetStats(userId: string): Promise<{
    totalBets: number;
    totalWins: number;
    totalStaked: number;
    totalReturns: number;
    netProfit: number;
  }>;
  getBankrollBalance(userId: string): Promise<{
    totalDeposits: number;
    totalWithdrawals: number;
    currentBalance: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Bet operations
  async createBet(betData: InsertBet & { userId: string }): Promise<Bet> {
    // Calculate profit based on result
    let profit = 0;
    if (betData.result === 'Won') {
      profit = Number(betData.stake) * (Number(betData.odds) - 1);
    } else if (betData.result === 'Lost') {
      profit = -Number(betData.stake);
    }
    // Push result is 0 profit

    const [bet] = await db
      .insert(bets)
      .values({
        ...betData,
        profit: profit.toString(),
      })
      .returning();
    return bet;
  }

  async getBets(userId: string): Promise<Bet[]> {
    return await db
      .select()
      .from(bets)
      .where(eq(bets.userId, userId))
      .orderBy(desc(bets.date));
  }

  async getBet(id: string, userId: string): Promise<Bet | undefined> {
    const [bet] = await db
      .select()
      .from(bets)
      .where(and(eq(bets.id, id), eq(bets.userId, userId)));
    return bet;
  }

  async updateBet(id: string, userId: string, updates: Partial<InsertBet>): Promise<Bet | undefined> {
    // Recalculate profit if result or odds/stake changed
    let profit: number | undefined;
    if (updates.result || updates.odds || updates.stake) {
      const existing = await this.getBet(id, userId);
      if (!existing) return undefined;
      
      const newResult = updates.result || existing.result;
      const newOdds = Number(updates.odds || existing.odds);
      const newStake = Number(updates.stake || existing.stake);
      
      if (newResult === 'Won') {
        profit = newStake * (newOdds - 1);
      } else if (newResult === 'Lost') {
        profit = -newStake;
      } else {
        profit = 0;
      }
    }

    const [bet] = await db
      .update(bets)
      .set({
        ...updates,
        ...(profit !== undefined && { profit: profit.toString() }),
        updatedAt: new Date(),
      })
      .where(and(eq(bets.id, id), eq(bets.userId, userId)))
      .returning();
    return bet;
  }

  async deleteBet(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(bets)
      .where(and(eq(bets.id, id), eq(bets.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Transaction operations
  async createTransaction(transactionData: InsertTransaction & { userId: string }): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(transactionData)
      .returning();
    return transaction;
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date));
  }

  async getTransaction(id: string, userId: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    return transaction;
  }

  // Analytics
  async getBetStats(userId: string): Promise<{
    totalBets: number;
    totalWins: number;
    totalStaked: number;
    totalReturns: number;
    netProfit: number;
  }> {
    // Get basic counts and sums
    const [stats] = await db
      .select({
        totalBets: count(),
        totalStaked: sum(bets.stake),
        totalProfit: sum(bets.profit),
      })
      .from(bets)
      .where(eq(bets.userId, userId));

    // Get win count separately since we can't use sum() on boolean
    const [winStats] = await db
      .select({
        totalWins: count(),
      })
      .from(bets)
      .where(and(eq(bets.userId, userId), eq(bets.result, 'Won')));

    const totalStaked = Number(stats.totalStaked || 0);
    const totalProfit = Number(stats.totalProfit || 0);
    const totalWins = Number(winStats.totalWins || 0);

    return {
      totalBets: Number(stats.totalBets || 0),
      totalWins,
      totalStaked,
      totalReturns: totalStaked + totalProfit,
      netProfit: totalProfit,
    };
  }

  async getBankrollBalance(userId: string): Promise<{
    totalDeposits: number;
    totalWithdrawals: number;
    currentBalance: number;
  }> {
    const [depositStats] = await db
      .select({ total: sum(transactions.amount) })
      .from(transactions)
      .where(and(eq(transactions.userId, userId), eq(transactions.type, 'deposit')));

    const [withdrawalStats] = await db
      .select({ total: sum(transactions.amount) })
      .from(transactions)
      .where(and(eq(transactions.userId, userId), eq(transactions.type, 'withdrawal')));

    const [betProfit] = await db
      .select({ total: sum(bets.profit) })
      .from(bets)
      .where(eq(bets.userId, userId));

    const totalDeposits = Number(depositStats.total || 0);
    const totalWithdrawals = Number(withdrawalStats.total || 0);
    const netBetProfit = Number(betProfit.total || 0);

    return {
      totalDeposits,
      totalWithdrawals,
      currentBalance: totalDeposits - totalWithdrawals + netBetProfit,
    };
  }
}

export const storage = new DatabaseStorage();
