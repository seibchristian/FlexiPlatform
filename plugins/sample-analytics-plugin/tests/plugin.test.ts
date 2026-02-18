/**
 * Unit tests for the Sample Analytics Plugin
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import sampleAnalyticsPlugin from '../src/index';
import type { PluginConfig } from '../src/types';

describe('SampleAnalyticsPlugin', () => {
  const mockConfig: PluginConfig = {
    enableTracking: true,
    trackingInterval: 5000,
    retentionDays: 30,
    enableDetailedLogging: false,
    excludedEvents: ['heartbeat', 'ping'],
  };

  beforeEach(async () => {
    // Initialize plugin before each test
    await sampleAnalyticsPlugin.initialize(mockConfig);
  });

  afterEach(async () => {
    // Cleanup after each test
    await sampleAnalyticsPlugin.deactivate();
  });

  describe('Initialization', () => {
    it('should initialize with valid configuration', async () => {
      const result = await sampleAnalyticsPlugin.execute('getStatus', {});
      expect(result.success).toBe(true);
      expect(result.data.status).toBe('active');
    });

    it('should throw error with invalid configuration', async () => {
      const invalidConfig = {
        enableTracking: 'invalid',
        trackingInterval: 5000,
        retentionDays: 30,
        enableDetailedLogging: false,
        excludedEvents: [],
      };

      await expect(
        sampleAnalyticsPlugin.initialize(invalidConfig as any)
      ).rejects.toThrow();
    });

    it('should have correct metadata', () => {
      expect(sampleAnalyticsPlugin.name).toBe('sample-analytics-plugin');
      expect(sampleAnalyticsPlugin.version).toBe('1.0.0');
      expect(sampleAnalyticsPlugin.displayName).toBe('Sample Analytics Plugin');
    });
  });

  describe('Action Tracking', () => {
    it('should track user actions', async () => {
      const result = await sampleAnalyticsPlugin.execute('trackAction', {
        userId: 'user123',
        action: 'login',
        metadata: { ip: '192.168.1.1' },
      });

      expect(result.success).toBe(true);
      expect(result.data.actionId).toBeDefined();
    });

    it('should exclude specified events', async () => {
      const result = await sampleAnalyticsPlugin.execute('trackAction', {
        userId: 'user123',
        action: 'heartbeat',
      });

      expect(result.success).toBe(true);
      expect(result.data.skipped).toBe(true);
    });

    it('should require userId and action', async () => {
      const result = await sampleAnalyticsPlugin.execute('trackAction', {
        userId: 'user123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should track multiple actions', async () => {
      for (let i = 0; i < 5; i++) {
        await sampleAnalyticsPlugin.execute('trackAction', {
          userId: `user${i}`,
          action: 'click',
        });
      }

      const statusResult = await sampleAnalyticsPlugin.execute('getStatus', {});
      expect(statusResult.data.actionsTracked).toBe(5);
    });
  });

  describe('Report Generation', () => {
    beforeEach(async () => {
      // Track some actions
      await sampleAnalyticsPlugin.execute('trackAction', {
        userId: 'user1',
        action: 'login',
      });
      await sampleAnalyticsPlugin.execute('trackAction', {
        userId: 'user1',
        action: 'view_page',
      });
      await sampleAnalyticsPlugin.execute('trackAction', {
        userId: 'user2',
        action: 'login',
      });
    });

    it('should generate analytics report', async () => {
      const result = await sampleAnalyticsPlugin.execute('getReport', {});

      expect(result.success).toBe(true);
      expect(result.data.totalActions).toBe(3);
      expect(result.data.uniqueUsers).toBe(2);
    });

    it('should group actions by type', async () => {
      const result = await sampleAnalyticsPlugin.execute('getReport', {});

      expect(result.data.actionsByType.login).toBe(2);
      expect(result.data.actionsByType.view_page).toBe(1);
    });

    it('should group actions by user', async () => {
      const result = await sampleAnalyticsPlugin.execute('getReport', {});

      expect(result.data.actionsByUser.user1).toBe(2);
      expect(result.data.actionsByUser.user2).toBe(1);
    });

    it('should identify top actions', async () => {
      const result = await sampleAnalyticsPlugin.execute('getReport', {});

      expect(result.data.topActions).toBeDefined();
      expect(result.data.topActions[0].action).toBe('login');
      expect(result.data.topActions[0].count).toBe(2);
    });

    it('should filter report by time range', async () => {
      const now = Date.now();
      const result = await sampleAnalyticsPlugin.execute('getReport', {
        timeRange: {
          start: now - 60000,
          end: now,
        },
      });

      expect(result.success).toBe(true);
      expect(result.data.timeRange.start).toBe(now - 60000);
    });
  });

  describe('Configuration Management', () => {
    it('should update configuration', async () => {
      const result = await sampleAnalyticsPlugin.execute('updateConfig', {
        enableDetailedLogging: true,
        trackingInterval: 10000,
      });

      expect(result.success).toBe(true);
      expect(result.data.config.enableDetailedLogging).toBe(true);
      expect(result.data.config.trackingInterval).toBe(10000);
    });

    it('should validate configuration updates', async () => {
      const result = await sampleAnalyticsPlugin.execute('updateConfig', {
        trackingInterval: 500, // Too low
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Data Management', () => {
    beforeEach(async () => {
      // Track some actions
      for (let i = 0; i < 3; i++) {
        await sampleAnalyticsPlugin.execute('trackAction', {
          userId: 'user1',
          action: 'click',
        });
      }
    });

    it('should clear all data', async () => {
      const result = await sampleAnalyticsPlugin.execute('clearData', {});

      expect(result.success).toBe(true);
      expect(result.data.clearedCount).toBe(3);

      const statusResult = await sampleAnalyticsPlugin.execute('getStatus', {});
      expect(statusResult.data.totalActionsStored).toBe(0);
    });

    it('should get plugin status', async () => {
      const result = await sampleAnalyticsPlugin.execute('getStatus', {});

      expect(result.success).toBe(true);
      expect(result.data.status).toBe('active');
      expect(result.data.uptime).toBeGreaterThan(0);
      expect(result.data.actionsTracked).toBe(3);
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown actions', async () => {
      const result = await sampleAnalyticsPlugin.execute('unknownAction', {});

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown action');
    });

    it('should handle missing required parameters', async () => {
      const result = await sampleAnalyticsPlugin.execute('trackAction', {});

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle getDailyStats with missing date', async () => {
      const result = await sampleAnalyticsPlugin.execute('getDailyStats', {});

      expect(result.success).toBe(false);
      expect(result.error).toContain('date parameter is required');
    });
  });

  describe('Lifecycle', () => {
    it('should activate plugin', async () => {
      await sampleAnalyticsPlugin.activate();
      const result = await sampleAnalyticsPlugin.execute('getStatus', {});

      expect(result.success).toBe(true);
      expect(result.data.status).toBe('active');
    });

    it('should deactivate plugin', async () => {
      await sampleAnalyticsPlugin.activate();
      await sampleAnalyticsPlugin.deactivate();

      // Plugin should still respond but indicate deactivation
      const result = await sampleAnalyticsPlugin.execute('getStatus', {});
      expect(result.success).toBe(true);
    });

    it('should shutdown plugin', async () => {
      await sampleAnalyticsPlugin.activate();
      await sampleAnalyticsPlugin.shutdown();

      // After shutdown, data should be cleared
      const result = await sampleAnalyticsPlugin.execute('getStatus', {});
      expect(result.data.totalActionsStored).toBe(0);
    });
  });
});
