/**
 * Sample Analytics Plugin for FlexiPlatform
 *
 * This plugin demonstrates how to:
 * - Initialize and configure a plugin
 * - Track user actions and events
 * - Generate analytics reports
 * - Handle plugin lifecycle
 * - Implement error handling and logging
 */

import type {
  PluginConfig,
  UserAction,
  ActionEvent,
  AnalyticsReport,
  DailyStats,
  PluginState,
  ExecuteParams,
  ExecuteResult,
} from './types';

/**
 * Sample Analytics Plugin
 * Tracks user actions and generates analytics reports
 */
class SampleAnalyticsPlugin {
  // Plugin metadata
  name = 'sample-analytics-plugin';
  version = '1.0.0';
  displayName = 'Sample Analytics Plugin';
  description = 'A sample plugin that tracks user actions and generates reports';
  author = 'Manus AI';

  // Configuration and state
  private config: PluginConfig | null = null;
  private state: PluginState = {
    isReady: false,
    startTime: 0,
    actionsTracked: 0,
    lastCleanup: 0,
    isProcessing: false,
  };

  // Data storage
  private actions: UserAction[] = [];
  private dailyStats: Map<string, DailyStats> = new Map();

  // Timers and intervals
  private aggregationInterval: NodeJS.Timeout | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize the plugin with configuration
   * Called when the plugin is first loaded
   */
  async initialize(config: PluginConfig): Promise<void> {
    try {
      // Validate configuration
      this.validateConfig(config);

      // Store configuration
      this.config = config;

      // Initialize state
      this.state = {
        isReady: true,
        startTime: Date.now(),
        actionsTracked: 0,
        lastCleanup: Date.now(),
        isProcessing: false,
      };

      this.log('info', 'Plugin initialized successfully', {
        config: this.config,
        startTime: this.state.startTime,
      });
    } catch (error) {
      this.log('error', 'Plugin initialization failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Activate the plugin
   * Called when the plugin is activated
   */
  async activate(): Promise<void> {
    try {
      if (!this.state.isReady) {
        throw new Error('Plugin not initialized');
      }

      // Start aggregation interval
      if (this.config) {
        this.aggregationInterval = setInterval(() => {
          this.aggregateData();
        }, this.config.trackingInterval);
      }

      // Start cleanup interval (daily)
      this.cleanupInterval = setInterval(() => {
        this.cleanupOldData();
      }, 24 * 60 * 60 * 1000);

      this.log('info', 'Plugin activated', {
        trackingInterval: this.config?.trackingInterval,
      });
    } catch (error) {
      this.log('error', 'Plugin activation failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Deactivate the plugin
   * Called when the plugin is deactivated
   */
  async deactivate(): Promise<void> {
    try {
      // Stop intervals
      if (this.aggregationInterval) {
        clearInterval(this.aggregationInterval);
        this.aggregationInterval = null;
      }

      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
        this.cleanupInterval = null;
      }

      // Perform final aggregation
      this.aggregateData();

      this.log('info', 'Plugin deactivated', {
        totalActionsTracked: this.state.actionsTracked,
      });
    } catch (error) {
      this.log('error', 'Plugin deactivation failed', { error: error.message });
    }
  }

  /**
   * Shutdown the plugin
   * Called before the plugin is uninstalled
   */
  async shutdown(): Promise<void> {
    try {
      // Cleanup all resources
      await this.deactivate();

      // Clear data
      this.actions = [];
      this.dailyStats.clear();

      this.log('info', 'Plugin shut down', {
        actionsTracked: this.state.actionsTracked,
      });
    } catch (error) {
      this.log('error', 'Plugin shutdown failed', { error: error.message });
    }
  }

  /**
   * Execute plugin actions
   * Main entry point for plugin operations
   */
  async execute(action: string, params: ExecuteParams): Promise<ExecuteResult> {
    try {
      if (this.config?.enableDetailedLogging) {
        this.log('info', 'Executing action', { action, params });
      }

      switch (action) {
        case 'trackAction':
          return await this.handleTrackAction(params);

        case 'getReport':
          return await this.handleGetReport(params);

        case 'getDailyStats':
          return await this.handleGetDailyStats(params);

        case 'getStatus':
          return await this.handleGetStatus();

        case 'clearData':
          return await this.handleClearData();

        case 'updateConfig':
          return await this.handleUpdateConfig(params);

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      this.log('error', 'Action execution failed', {
        action,
        error: error.message,
      });

      return {
        success: false,
        error: error.message,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Handle trackAction
   * Track a user action
   */
  private async handleTrackAction(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { userId, action, metadata, duration } = params;

      // Validate required parameters
      if (!userId || !action) {
        throw new Error('userId and action are required');
      }

      // Check if event should be excluded
      if (this.config?.excludedEvents.includes(action)) {
        return {
          success: true,
          data: { skipped: true, reason: 'Event type excluded' },
          timestamp: Date.now(),
        };
      }

      // Create action record
      const userAction: UserAction = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        action,
        timestamp: Date.now(),
        metadata,
        duration,
      };

      // Store action
      this.actions.push(userAction);
      this.state.actionsTracked++;

      if (this.config?.enableDetailedLogging) {
        this.log('info', 'Action tracked', { userId, action });
      }

      return {
        success: true,
        data: { actionId: userAction.id },
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle getReport
   * Generate an analytics report
   */
  private async handleGetReport(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { timeRange } = params;

      // Filter actions by time range if provided
      let filteredActions = this.actions;
      if (timeRange) {
        const { start, end } = timeRange;
        filteredActions = this.actions.filter(
          (a) => a.timestamp >= start && a.timestamp <= end
        );
      }

      // Generate report
      const report: AnalyticsReport = {
        totalActions: filteredActions.length,
        uniqueUsers: new Set(filteredActions.map((a) => a.userId)).size,
        actionsByType: this.groupByAction(filteredActions),
        actionsByUser: this.groupByUser(filteredActions),
        topActions: this.getTopActions(filteredActions, 10),
        timeRange: timeRange || {
          start: this.state.startTime,
          end: Date.now(),
        },
        generatedAt: Date.now(),
      };

      return {
        success: true,
        data: report,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle getDailyStats
   * Get daily statistics
   */
  private async handleGetDailyStats(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { date } = params;

      if (!date) {
        throw new Error('date parameter is required');
      }

      const stats = this.dailyStats.get(date);

      if (!stats) {
        return {
          success: true,
          data: null,
          timestamp: Date.now(),
        };
      }

      return {
        success: true,
        data: stats,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle getStatus
   * Get plugin status
   */
  private async handleGetStatus(): Promise<ExecuteResult> {
    try {
      const uptime = Date.now() - this.state.startTime;

      return {
        success: true,
        data: {
          status: 'active',
          uptime,
          actionsTracked: this.state.actionsTracked,
          totalActionsStored: this.actions.length,
          dailyStatsCount: this.dailyStats.size,
          config: this.config,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle clearData
   * Clear all tracked data
   */
  private async handleClearData(): Promise<ExecuteResult> {
    try {
      const clearedCount = this.actions.length;
      this.actions = [];
      this.dailyStats.clear();

      this.log('info', 'Data cleared', { clearedCount });

      return {
        success: true,
        data: { clearedCount },
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle updateConfig
   * Update plugin configuration
   */
  private async handleUpdateConfig(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const newConfig = { ...this.config, ...params };
      this.validateConfig(newConfig);
      this.config = newConfig;

      this.log('info', 'Configuration updated', { config: this.config });

      return {
        success: true,
        data: { config: this.config },
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Aggregate tracking data
   * Called at regular intervals to aggregate data
   */
  private aggregateData(): void {
    if (this.state.isProcessing) {
      return;
    }

    try {
      this.state.isProcessing = true;

      const today = new Date().toISOString().split('T')[0];
      const todayActions = this.actions.filter((a) => {
        const actionDate = new Date(a.timestamp).toISOString().split('T')[0];
        return actionDate === today;
      });

      const stats: DailyStats = {
        date: today,
        totalActions: todayActions.length,
        uniqueUsers: new Set(todayActions.map((a) => a.userId)).size,
        actionsByType: this.groupByAction(todayActions),
      };

      this.dailyStats.set(today, stats);

      if (this.config?.enableDetailedLogging) {
        this.log('info', 'Data aggregated', { date: today, stats });
      }
    } catch (error) {
      this.log('error', 'Data aggregation failed', { error: error.message });
    } finally {
      this.state.isProcessing = false;
    }
  }

  /**
   * Cleanup old data
   * Remove data older than retention period
   */
  private cleanupOldData(): void {
    try {
      const retentionMs = (this.config?.retentionDays || 30) * 24 * 60 * 60 * 1000;
      const cutoffTime = Date.now() - retentionMs;

      const beforeCount = this.actions.length;
      this.actions = this.actions.filter((a) => a.timestamp > cutoffTime);
      const removedCount = beforeCount - this.actions.length;

      this.state.lastCleanup = Date.now();

      this.log('info', 'Old data cleaned up', {
        removedCount,
        retentionDays: this.config?.retentionDays,
      });
    } catch (error) {
      this.log('error', 'Data cleanup failed', { error: error.message });
    }
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: PluginConfig): void {
    if (typeof config.enableTracking !== 'boolean') {
      throw new Error('enableTracking must be a boolean');
    }

    if (typeof config.trackingInterval !== 'number' || config.trackingInterval < 1000) {
      throw new Error('trackingInterval must be a number >= 1000');
    }

    if (typeof config.retentionDays !== 'number' || config.retentionDays < 1) {
      throw new Error('retentionDays must be a number >= 1');
    }

    if (!Array.isArray(config.excludedEvents)) {
      throw new Error('excludedEvents must be an array');
    }
  }

  /**
   * Group actions by type
   */
  private groupByAction(actions: UserAction[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    for (const action of actions) {
      grouped[action.action] = (grouped[action.action] || 0) + 1;
    }
    return grouped;
  }

  /**
   * Group actions by user
   */
  private groupByUser(actions: UserAction[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    for (const action of actions) {
      grouped[action.userId] = (grouped[action.userId] || 0) + 1;
    }
    return grouped;
  }

  /**
   * Get top actions
   */
  private getTopActions(
    actions: UserAction[],
    limit: number
  ): Array<{ action: string; count: number }> {
    const grouped = this.groupByAction(actions);
    return Object.entries(grouped)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Logging utility
   */
  private log(
    level: 'info' | 'warn' | 'error',
    message: string,
    data?: Record<string, any>
  ): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }
}

// Export plugin instance
export const sampleAnalyticsPlugin = new SampleAnalyticsPlugin();
export default sampleAnalyticsPlugin;
