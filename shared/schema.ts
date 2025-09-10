import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bets table
export const bets = pgTable("bets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  sport: varchar("sport", { length: 100 }).notNull(),
  league: varchar("league", { length: 100 }),
  event: text("event").notNull(),
  market: varchar("market", { length: 100 }).notNull(),
  selection: text("selection").notNull(),
  bookmaker: varchar("bookmaker", { length: 100 }).notNull(),
  odds: decimal("odds", { precision: 10, scale: 2 }).notNull(),
  stake: decimal("stake", { precision: 10, scale: 2 }).notNull(),
  betType: varchar("bet_type", { length: 50 }).notNull(),
  result: varchar("result", { length: 20 }), // 'Won', 'Lost', 'Push', 'Pending'
  profit: decimal("profit", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bankroll transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type", { length: 20 }).notNull(), // 'deposit', 'withdrawal'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertBetSchema = createInsertSchema(bets).omit({
  id: true,
  userId: true,
  profit: true,
  createdAt: true,
  updatedAt: true,
});

// Strict schema with proper validation for forms
export const insertBetSchemaStrict = insertBetSchema.extend({
  odds: z.coerce.number().gt(1, "Odds must be greater than 1"),
  stake: z.coerce.number().positive("Stake must be greater than 0"),
  sport: z.string().min(1, "Sport is required"),
  event: z.string().min(1, "Event is required"),
  market: z.string().min(1, "Market is required"),
  selection: z.string().min(1, "Selection is required"),
  bookmaker: z.string().min(1, "Bookmaker is required"),
  betType: z.string().min(1, "Bet type is required"),
  result: z.enum(["Won", "Lost", "Push", "Pending"]).default("Pending"),
  date: z.coerce.date(),
  league: z.string().optional(),
  notes: z.string().optional(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Strict schema for transaction validation
export const insertTransactionSchemaStrict = insertTransactionSchema.extend({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  type: z.enum(["deposit", "withdrawal"]),
  description: z.string().min(1, "Description is required"),
  date: z.coerce.date(),
});

export type InsertBet = z.infer<typeof insertBetSchema>;
export type InsertBetStrict = z.infer<typeof insertBetSchemaStrict>;
export type Bet = typeof bets.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertTransactionStrict = z.infer<typeof insertTransactionSchemaStrict>;
export type Transaction = typeof transactions.$inferSelect;
