/**
 * Type definitions for the Sample Analytics Plugin
 */

export interface PluginConfig {
  enableTracking: boolean;
  trackingInterval: number;
  retentionDays: number;
  enableDetailedLogging: boolean;
  excludedEvents: string[];
}

export interface UserAction {
  id: string;
  userId: string;
  action: string;
  timestamp: number;
  metadata?: Record<string, any>;
  duration?: number;
}

export interface ActionEvent {
  type: string;
  userId: string;
  action: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface AnalyticsReport {
  totalActions: number;
  uniqueUsers: number;
  actionsByType: Record<string, number>;
  actionsByUser: Record<string, number>;
  topActions: Array<{ action: string; count: number }>;
  timeRange: {
    start: number;
    end: number;
  };
  generatedAt: number;
}

export interface DailyStats {
  date: string;
  totalActions: number;
  uniqueUsers: number;
  actionsByType: Record<string, number>;
}

export interface PluginState {
  isReady: boolean;
  startTime: number;
  actionsTracked: number;
  lastCleanup: number;
  isProcessing: boolean;
}

export interface ExecuteParams {
  [key: string]: any;
}

export interface ExecuteResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: number;
}
