import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Plugins table
export const plugins = mysqlTable("plugins", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  version: varchar("version", { length: 50 }).notNull(),
  description: text("description"),
  enabled: boolean("enabled").default(true).notNull(),
  config: json("config").$type<Record<string, any>>().default({}).notNull(),
  author: varchar("author", { length: 255 }),
  homepage: varchar("homepage", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Printer settings
export const printers = mysqlTable("printers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ipAddress: varchar("ipAddress", { length: 50 }).notNull(),
  port: int("port").default(9100).notNull(),
  model: varchar("model", { length: 255 }),
  status: mysqlEnum("status", ["online", "offline", "error"]).default("offline").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Server settings
export const serverSettings = mysqlTable("server_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  type: mysqlEnum("type", ["string", "number", "boolean", "json"]).default("string").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Database settings
export const databaseSettings = mysqlTable("database_settings", {
  id: int("id").autoincrement().primaryKey(),
  dbType: varchar("dbType", { length: 50 }).notNull(),
  host: varchar("host", { length: 255 }).notNull(),
  port: int("port").notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  database: varchar("database", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["connected", "disconnected", "error"]).default("disconnected").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Activity logs
export const activityLogs = mysqlTable("activity_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 255 }).notNull(),
  entity: varchar("entity", { length: 100 }).notNull(),
  entityId: int("entityId"),
  details: json("details").$type<Record<string, any>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Export types
export type Plugin = typeof plugins.$inferSelect;
export type InsertPlugin = typeof plugins.$inferInsert;

export type Printer = typeof printers.$inferSelect;
export type InsertPrinter = typeof printers.$inferInsert;

export type ServerSetting = typeof serverSettings.$inferSelect;
export type InsertServerSetting = typeof serverSettings.$inferInsert;

export type DatabaseSetting = typeof databaseSettings.$inferSelect;
export type InsertDatabaseSetting = typeof databaseSettings.$inferInsert;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;
