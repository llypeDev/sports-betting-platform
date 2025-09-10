import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertBetSchemaStrict, insertTransactionSchemaStrict } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Bet routes
  app.get('/api/bets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bets = await storage.getBets(userId);
      res.json(bets);
    } catch (error) {
      console.error("Error fetching bets:", error);
      res.status(500).json({ message: "Failed to fetch bets" });
    }
  });

  app.post('/api/bets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const betData = insertBetSchemaStrict.parse(req.body);
      // Convert numbers back to strings for database storage
      const dbBetData = {
        ...betData,
        odds: betData.odds.toString(),
        stake: betData.stake.toString(),
      };
      const bet = await storage.createBet({ ...dbBetData, userId });
      res.json(bet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid bet data", errors: error.errors });
      } else {
        console.error("Error creating bet:", error);
        res.status(500).json({ message: "Failed to create bet" });
      }
    }
  });

  app.get('/api/bets/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bet = await storage.getBet(req.params.id, userId);
      if (!bet) {
        return res.status(404).json({ message: "Bet not found" });
      }
      res.json(bet);
    } catch (error) {
      console.error("Error fetching bet:", error);
      res.status(500).json({ message: "Failed to fetch bet" });
    }
  });

  app.put('/api/bets/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = insertBetSchemaStrict.partial().parse(req.body);
      // Convert numbers back to strings for database storage
      const dbUpdates = {
        ...updates,
        ...(updates.odds && { odds: updates.odds.toString() }),
        ...(updates.stake && { stake: updates.stake.toString() }),
      };
      const bet = await storage.updateBet(req.params.id, userId, dbUpdates);
      if (!bet) {
        return res.status(404).json({ message: "Bet not found" });
      }
      res.json(bet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid bet data", errors: error.errors });
      } else {
        console.error("Error updating bet:", error);
        res.status(500).json({ message: "Failed to update bet" });
      }
    }
  });

  app.delete('/api/bets/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.deleteBet(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ message: "Bet not found" });
      }
      res.json({ message: "Bet deleted successfully" });
    } catch (error) {
      console.error("Error deleting bet:", error);
      res.status(500).json({ message: "Failed to delete bet" });
    }
  });

  // Transaction routes
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactionData = insertTransactionSchemaStrict.parse(req.body);
      // Convert amount back to string for database storage
      const dbTransactionData = {
        ...transactionData,
        amount: transactionData.amount.toString(),
      };
      const transaction = await storage.createTransaction({ ...dbTransactionData, userId });
      res.json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  // Analytics routes
  app.get('/api/stats/bets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getBetStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching bet stats:", error);
      res.status(500).json({ message: "Failed to fetch bet stats" });
    }
  });

  app.get('/api/stats/bankroll', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getBankrollBalance(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching bankroll stats:", error);
      res.status(500).json({ message: "Failed to fetch bankroll stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
