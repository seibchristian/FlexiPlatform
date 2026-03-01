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

  // ============ FORM DESIGNER ============
  formDesigner: router({
    // Get all form definitions
    listDefinitions: protectedProcedure.query(async () => {
      return db.getFormDefinitions();
    }),

    // Get form definition by entity type
    getDefinition: protectedProcedure
      .input(z.object({ entityType: z.string() }))
      .query(async ({ input }) => {
        return db.getFormDefinitionByEntityType(input.entityType);
      }),

    // Create a new form definition
    createDefinition: protectedProcedure
      .input(
        z.object({
          entityType: z.string().min(1).max(100),
          displayName: z.string().min(1).max(255),
          description: z.string().optional(),
          fields: z.array(z.any()).default([]),
        })
      )
      .mutation(async ({ input }) => {
        return db.createFormDefinition({
          entityType: input.entityType,
          displayName: input.displayName,
          description: input.description,
          fields: input.fields,
          isActive: true,
        });
      }),

    // Update form definition
    updateDefinition: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          displayName: z.string().optional(),
          description: z.string().optional(),
          fields: z.array(z.any()).optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;

        // Log the change
        const oldDef = await db.getFormDefinitions();
        await db.logFormDesignChange({
          formDefinitionId: id,
          userId: ctx.user.id,
          action: "update",
          previousConfig: oldDef,
          newConfig: data,
          description: "Form definition updated",
        });

        return db.updateFormDefinition(id, data);
      }),

    // Delete form definition
    deleteDefinition: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteFormDefinition(input.id);
      }),

    // Get form fields
    getFields: protectedProcedure
      .input(z.object({ formDefinitionId: z.number() }))
      .query(async ({ input }) => {
        return db.getFormFields(input.formDefinitionId);
      }),

    // Create form field
    createField: protectedProcedure
      .input(
        z.object({
          formDefinitionId: z.number(),
          fieldName: z.string(),
          fieldLabel: z.string(),
          fieldType: z.string(),
          position: z.number(),
          width: z.number().default(100),
          height: z.number().default(40),
          isRequired: z.boolean().default(false),
          placeholder: z.string().optional(),
          defaultValue: z.string().optional(),
          options: z.record(z.any()).optional(),
          validation: z.record(z.any()).optional(),
          metadata: z.record(z.any()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createFormField(input);
      }),

    // Update form field
    updateField: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          fieldName: z.string().optional(),
          fieldLabel: z.string().optional(),
          fieldType: z.string().optional(),
          position: z.number().optional(),
          width: z.number().optional(),
          height: z.number().optional(),
          isRequired: z.boolean().optional(),
          placeholder: z.string().optional(),
          defaultValue: z.string().optional(),
          options: z.record(z.any()).optional(),
          validation: z.record(z.any()).optional(),
          metadata: z.record(z.any()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateFormField(id, data);
      }),

    // Delete form field
    deleteField: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteFormField(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
