import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ PLUGIN MANAGEMENT ============

export async function getPlugins() {
  const db = await getDb();
  if (!db) return [];
  const { plugins: pluginsTable } = await import("../drizzle/schema");
  return db.select().from(pluginsTable);
}

export async function getEnabledPlugins() {
  const db = await getDb();
  if (!db) return [];
  const { plugins: pluginsTable } = await import("../drizzle/schema");
  return db.select().from(pluginsTable).where(eq(pluginsTable.enabled, true));
}

export async function getPluginByName(name: string) {
  const db = await getDb();
  if (!db) return null;
  const { plugins: pluginsTable } = await import("../drizzle/schema");
  const result = await db.select().from(pluginsTable).where(eq(pluginsTable.name, name));
  return result[0] || null;
}

export async function createPlugin(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { plugins: pluginsTable } = await import("../drizzle/schema");
  await db.insert(pluginsTable).values(data);
  return true;
}

export async function updatePlugin(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { plugins: pluginsTable } = await import("../drizzle/schema");
  await db.update(pluginsTable).set(data).where(eq(pluginsTable.id, id));
}

export async function deletePlugin(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { plugins: pluginsTable } = await import("../drizzle/schema");
  await db.delete(pluginsTable).where(eq(pluginsTable.id, id));
}

export async function togglePlugin(id: number, enabled: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { plugins: pluginsTable } = await import("../drizzle/schema");
  await db.update(pluginsTable).set({ enabled }).where(eq(pluginsTable.id, id));
}

// ============ PRINTER MANAGEMENT ============

export async function getPrinters() {
  const db = await getDb();
  if (!db) return [];
  const { printers: printersTable } = await import("../drizzle/schema");
  return db.select().from(printersTable);
}

export async function getPrinterById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const { printers: printersTable } = await import("../drizzle/schema");
  const result = await db.select().from(printersTable).where(eq(printersTable.id, id));
  return result[0] || null;
}

export async function createPrinter(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { printers: printersTable } = await import("../drizzle/schema");
  await db.insert(printersTable).values(data);
  return true;
}

export async function updatePrinter(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { printers: printersTable } = await import("../drizzle/schema");
  await db.update(printersTable).set(data).where(eq(printersTable.id, id));
}

export async function deletePrinter(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { printers: printersTable } = await import("../drizzle/schema");
  await db.delete(printersTable).where(eq(printersTable.id, id));
}

export async function updatePrinterStatus(id: number, status: "online" | "offline" | "error") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { printers: printersTable } = await import("../drizzle/schema");
  await db.update(printersTable).set({ status }).where(eq(printersTable.id, id));
}

// ============ SERVER SETTINGS ============

export async function getServerSettings() {
  const db = await getDb();
  if (!db) return [];
  const { serverSettings: settingsTable } = await import("../drizzle/schema");
  return db.select().from(settingsTable);
}

export async function getServerSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  const { serverSettings: settingsTable } = await import("../drizzle/schema");
  const result = await db.select().from(settingsTable).where(eq(settingsTable.key, key));
  return result[0] || null;
}

export async function setServerSetting(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { serverSettings: settingsTable } = await import("../drizzle/schema");
  const existing = await getServerSetting(data.key);
  if (existing) {
    await db.update(settingsTable).set(data).where(eq(settingsTable.key, data.key));
  } else {
    await db.insert(settingsTable).values(data);
  }
  return true;
}

// ============ DATABASE SETTINGS ============

export async function getDatabaseSettings() {
  const db = await getDb();
  if (!db) return [];
  const { databaseSettings: dbSettingsTable } = await import("../drizzle/schema");
  return db.select().from(dbSettingsTable);
}

export async function getLatestDatabaseSettings() {
  const db = await getDb();
  if (!db) return null;
  const { databaseSettings: dbSettingsTable } = await import("../drizzle/schema");
  const result = await db.select().from(dbSettingsTable).limit(1);
  return result[0] || null;
}

export async function createDatabaseSettings(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { databaseSettings: dbSettingsTable } = await import("../drizzle/schema");
  await db.insert(dbSettingsTable).values(data);
  return true;
}

export async function updateDatabaseSettings(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { databaseSettings: dbSettingsTable } = await import("../drizzle/schema");
  await db.update(dbSettingsTable).set(data).where(eq(dbSettingsTable.id, id));
}

export async function updateDatabaseStatus(id: number, status: "connected" | "disconnected" | "error") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { databaseSettings: dbSettingsTable } = await import("../drizzle/schema");
  await db.update(dbSettingsTable).set({ status }).where(eq(dbSettingsTable.id, id));
}

// ============ ACTIVITY LOGS ============

export async function getActivityLogs(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  const { activityLogs: logsTable } = await import("../drizzle/schema");
  return db.select().from(logsTable).limit(limit);
}

export async function logActivity(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { activityLogs: logsTable } = await import("../drizzle/schema");
  await db.insert(logsTable).values(data);
}
