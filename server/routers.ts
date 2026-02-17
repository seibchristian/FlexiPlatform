import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ PLUGIN MANAGEMENT ============
  plugins: router({
    list: protectedProcedure.query(async () => {
      return db.getPlugins();
    }),
    listEnabled: protectedProcedure.query(async () => {
      return db.getEnabledPlugins();
    }),
    getByName: protectedProcedure
      .input(z.object({ name: z.string() }))
      .query(async ({ input }) => {
        return db.getPluginByName(input.name);
      }),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          version: z.string().min(1).max(50),
          description: z.string().optional(),
          author: z.string().optional(),
          homepage: z.string().optional(),
          config: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createPlugin({
          ...input,
          enabled: true,
          config: input.config || {},
        });
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          version: z.string().optional(),
          description: z.string().optional(),
          config: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updatePlugin(id, data);
      }),
    toggle: protectedProcedure
      .input(z.object({ id: z.number(), enabled: z.boolean() }))
      .mutation(async ({ input }) => {
        return db.togglePlugin(input.id, input.enabled);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deletePlugin(input.id);
      }),
  }),

  // ============ PRINTER MANAGEMENT ============
  printers: router({
    list: protectedProcedure.query(async () => {
      return db.getPrinters();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getPrinterById(input.id);
      }),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          ipAddress: z.string().min(1).max(50),
          port: z.number().int().default(9100),
          model: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createPrinter({
          ...input,
          status: "offline",
        });
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          ipAddress: z.string().optional(),
          port: z.number().optional(),
          model: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updatePrinter(id, data);
      }),
    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["online", "offline", "error"]),
        })
      )
      .mutation(async ({ input }) => {
        return db.updatePrinterStatus(input.id, input.status);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deletePrinter(input.id);
      }),
  }),

  // ============ SERVER SETTINGS ============
  serverSettings: router({
    list: protectedProcedure.query(async () => {
      return db.getServerSettings();
    }),
    get: protectedProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        return db.getServerSetting(input.key);
      }),
    set: protectedProcedure
      .input(
        z.object({
          key: z.string().min(1).max(255),
          value: z.string().optional(),
          type: z.enum(["string", "number", "boolean", "json"]).default("string"),
        })
      )
      .mutation(async ({ input }) => {
        return db.setServerSetting(input);
      }),
  }),

  // ============ DATABASE SETTINGS ============
  databaseSettings: router({
    list: protectedProcedure.query(async () => {
      return db.getDatabaseSettings();
    }),
    getLatest: protectedProcedure.query(async () => {
      return db.getLatestDatabaseSettings();
    }),
    create: protectedProcedure
      .input(
        z.object({
          dbType: z.string().min(1).max(50),
          host: z.string().min(1).max(255),
          port: z.number().int().positive(),
          username: z.string().min(1).max(255),
          password: z.string().min(1).max(255),
          database: z.string().min(1).max(255),
        })
      )
      .mutation(async ({ input }) => {
        return db.createDatabaseSettings({
          ...input,
          status: "disconnected",
        });
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          dbType: z.string().optional(),
          host: z.string().optional(),
          port: z.number().optional(),
          username: z.string().optional(),
          password: z.string().optional(),
          database: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateDatabaseSettings(id, data);
      }),
    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["connected", "disconnected", "error"]),
        })
      )
      .mutation(async ({ input }) => {
        return db.updateDatabaseStatus(input.id, input.status);
      }),
  }),

  // ============ ACTIVITY LOGS ============
  activityLogs: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().int().default(100) }).optional())
      .query(async ({ input }) => {
        return db.getActivityLogs(input?.limit || 100);
      }),
    log: protectedProcedure
      .input(
        z.object({
          action: z.string(),
          entity: z.string(),
          entityId: z.number().optional(),
          details: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return db.logActivity({
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
