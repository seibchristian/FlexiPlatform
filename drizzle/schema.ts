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

// ============ FORM DESIGNER TABLES ============

// Form Definitions - Store form configurations for different entity types
export const formDefinitions = mysqlTable("form_definitions", {
  id: int("id").autoincrement().primaryKey(),
  entityType: varchar("entityType", { length: 100 }).notNull().unique(),
  displayName: varchar("displayName", { length: 255 }).notNull(),
  description: text("description"),
  fields: json("fields").$type<Array<FormFieldConfig>>().default([]).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Form Fields - Individual field configurations
export const formFields = mysqlTable("form_fields", {
  id: int("id").autoincrement().primaryKey(),
  formDefinitionId: int("formDefinitionId").notNull(),
  fieldName: varchar("fieldName", { length: 255 }).notNull(),
  fieldLabel: varchar("fieldLabel", { length: 255 }).notNull(),
  fieldType: varchar("fieldType", { length: 50 }).notNull(),
  position: int("position").notNull(),
  width: int("width").default(100).notNull(),
  height: int("height").default(40).notNull(),
  isRequired: boolean("isRequired").default(false).notNull(),
  placeholder: varchar("placeholder", { length: 255 }),
  defaultValue: varchar("defaultValue", { length: 255 }),
  options: json("options").$type<Record<string, any>>(),
  validation: json("validation").$type<Record<string, any>>(),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Form Design History - Track changes to form configurations
export const formDesignHistory = mysqlTable("form_design_history", {
  id: int("id").autoincrement().primaryKey(),
  formDefinitionId: int("formDefinitionId").notNull(),
  userId: int("userId"),
  action: varchar("action", { length: 50 }).notNull(),
  previousConfig: json("previousConfig").$type<Record<string, any>>(),
  newConfig: json("newConfig").$type<Record<string, any>>(),
  description: text("description"),
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

export type FormDefinition = typeof formDefinitions.$inferSelect;
export type InsertFormDefinition = typeof formDefinitions.$inferInsert;

export type FormField = typeof formFields.$inferSelect;
export type InsertFormField = typeof formFields.$inferInsert;

export type FormDesignHistory = typeof formDesignHistory.$inferSelect;
export type InsertFormDesignHistory = typeof formDesignHistory.$inferInsert;

// Form Field Configuration Type
export interface FormFieldConfig {
  id?: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "date" | "phone";
  position: number;
  width: number;
  height: number;
  isRequired: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: Record<string, any>;
  metadata?: Record<string, any>;
}
