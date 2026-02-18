# Sample Analytics Plugin

A comprehensive sample plugin for FlexiPlatform that demonstrates best practices for plugin development. This plugin tracks user actions and generates analytics reports.

## Features

**User Action Tracking**: Automatically tracks user actions with timestamps, metadata, and optional duration information.

**Analytics Reports**: Generate comprehensive analytics reports with action counts, unique user counts, and top actions.

**Daily Statistics**: Automatically aggregates data into daily statistics for trend analysis.

**Data Retention**: Automatically cleans up old data based on configurable retention period.

**Flexible Configuration**: Supports runtime configuration updates without restarting the plugin.

**Comprehensive Logging**: Detailed logging for debugging and monitoring plugin operations.

## Installation

### Prerequisites

- Node.js 22.13 or higher
- pnpm package manager
- FlexiPlatform installed and running

### Steps

1. **Clone the repository**

   ```bash
   cd /path/to/FlexiPlatform/plugins
   ```

2. **Install dependencies**

   ```bash
   cd sample-analytics-plugin
   pnpm install
   ```

3. **Build the plugin**

   ```bash
   pnpm run build
   ```

4. **Register the plugin in FlexiPlatform**

   Copy the plugin to the FlexiPlatform plugins directory and register it through the management UI.

## Configuration

Configure the plugin through `plugin.config.json`:

```json
{
  "enableTracking": true,
  "trackingInterval": 60000,
  "retentionDays": 30,
  "enableDetailedLogging": false,
  "excludedEvents": ["heartbeat", "ping"]
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableTracking` | boolean | true | Enable or disable user action tracking |
| `trackingInterval` | number | 60000 | Interval in milliseconds for aggregating data |
| `retentionDays` | number | 30 | Number of days to retain analytics data |
| `enableDetailedLogging` | boolean | false | Enable detailed logging for debugging |
| `excludedEvents` | array | ["heartbeat", "ping"] | Event types to exclude from tracking |

## Usage

### Track User Actions

Track a user action:

```typescript
const result = await plugin.execute('trackAction', {
  userId: 'user123',
  action: 'login',
  metadata: {
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0...'
  },
  duration: 1500
});
```

### Generate Analytics Report

Generate a comprehensive analytics report:

```typescript
const result = await plugin.execute('getReport', {
  timeRange: {
    start: Date.now() - 7 * 24 * 60 * 60 * 1000, // Last 7 days
    end: Date.now()
  }
});

console.log(result.data);
// {
//   totalActions: 1250,
//   uniqueUsers: 45,
//   actionsByType: { login: 450, view_page: 600, click: 200 },
//   actionsByUser: { user1: 50, user2: 35, ... },
//   topActions: [
//     { action: 'view_page', count: 600 },
//     { action: 'login', count: 450 },
//     { action: 'click', count: 200 }
//   ],
//   timeRange: { start: ..., end: ... },
//   generatedAt: ...
// }
```

### Get Daily Statistics

Retrieve statistics for a specific day:

```typescript
const result = await plugin.execute('getDailyStats', {
  date: '2026-02-17'
});

console.log(result.data);
// {
//   date: '2026-02-17',
//   totalActions: 250,
//   uniqueUsers: 15,
//   actionsByType: { login: 50, view_page: 150, click: 50 }
// }
```

### Get Plugin Status

Get the current status of the plugin:

```typescript
const result = await plugin.execute('getStatus', {});

console.log(result.data);
// {
//   status: 'active',
//   uptime: 3600000,
//   actionsTracked: 1250,
//   totalActionsStored: 1200,
//   dailyStatsCount: 7,
//   config: { ... }
// }
```

### Update Configuration

Update plugin configuration at runtime:

```typescript
const result = await plugin.execute('updateConfig', {
  trackingInterval: 120000,
  enableDetailedLogging: true
});
```

### Clear Data

Clear all tracked data:

```typescript
const result = await plugin.execute('clearData', {});

console.log(result.data);
// { clearedCount: 1250 }
```

## API Reference

### trackAction

Track a user action.

**Parameters:**
- `userId` (string, required): Unique user identifier
- `action` (string, required): Action type (e.g., 'login', 'click', 'view_page')
- `metadata` (object, optional): Additional metadata about the action
- `duration` (number, optional): Duration of the action in milliseconds

**Returns:**
```typescript
{
  success: true,
  data: { actionId: 'string' },
  timestamp: number
}
```

### getReport

Generate an analytics report.

**Parameters:**
- `timeRange` (object, optional): Time range for the report
  - `start` (number): Start timestamp
  - `end` (number): End timestamp

**Returns:**
```typescript
{
  success: true,
  data: {
    totalActions: number,
    uniqueUsers: number,
    actionsByType: Record<string, number>,
    actionsByUser: Record<string, number>,
    topActions: Array<{ action: string, count: number }>,
    timeRange: { start: number, end: number },
    generatedAt: number
  },
  timestamp: number
}
```

### getDailyStats

Get statistics for a specific day.

**Parameters:**
- `date` (string, required): Date in YYYY-MM-DD format

**Returns:**
```typescript
{
  success: true,
  data: {
    date: string,
    totalActions: number,
    uniqueUsers: number,
    actionsByType: Record<string, number>
  } | null,
  timestamp: number
}
```

### getStatus

Get the current plugin status.

**Returns:**
```typescript
{
  success: true,
  data: {
    status: string,
    uptime: number,
    actionsTracked: number,
    totalActionsStored: number,
    dailyStatsCount: number,
    config: PluginConfig
  },
  timestamp: number
}
```

### updateConfig

Update plugin configuration.

**Parameters:**
- Configuration fields to update (partial)

**Returns:**
```typescript
{
  success: true,
  data: { config: PluginConfig },
  timestamp: number
}
```

### clearData

Clear all tracked data.

**Returns:**
```typescript
{
  success: true,
  data: { clearedCount: number },
  timestamp: number
}
```

## Development

### Project Structure

```
sample-analytics-plugin/
├── src/
│   ├── index.ts          # Main plugin implementation
│   └── types.ts          # TypeScript type definitions
├── tests/
│   └── plugin.test.ts    # Unit tests
├── dist/                 # Compiled output
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
├── plugin.config.json    # Plugin metadata
└── README.md             # This file
```

### Building

```bash
# Build the plugin
pnpm run build

# Watch mode for development
pnpm run dev
```

### Testing

```bash
# Run tests
pnpm run test

# Watch mode for tests
pnpm run test:watch
```

### Linting and Formatting

```bash
# Lint code
pnpm run lint

# Format code
pnpm run format
```

## Best Practices Demonstrated

This sample plugin demonstrates several best practices:

1. **Type Safety**: Comprehensive TypeScript types for configuration, events, and data structures
2. **Error Handling**: Proper error handling with meaningful error messages
3. **Resource Management**: Cleanup of timers and resources in lifecycle methods
4. **Logging**: Structured logging for debugging and monitoring
5. **Configuration Validation**: Validation of configuration during initialization
6. **Testing**: Comprehensive unit tests covering all functionality
7. **Documentation**: Well-documented code with JSDoc comments
8. **Separation of Concerns**: Clear separation between data handling, aggregation, and cleanup

## Extending the Plugin

To create your own plugin based on this sample:

1. Copy the plugin directory
2. Rename it to your plugin name
3. Update `plugin.config.json` with your plugin metadata
4. Modify `src/index.ts` to implement your custom logic
5. Update `src/types.ts` with your custom types
6. Add tests for your functionality
7. Update this README with your plugin's documentation

## Troubleshooting

### Plugin fails to initialize

Check the error message in the logs. Ensure all required configuration is provided and valid.

```bash
# Check logs
tail -f /var/log/flexiplatform/plugin.log
```

### Actions not being tracked

Verify that:
- `enableTracking` is set to `true`
- The action type is not in `excludedEvents`
- Required parameters (`userId`, `action`) are provided

### Memory usage increasing

The plugin automatically cleans up old data based on `retentionDays`. If memory usage is still high:
- Reduce `retentionDays`
- Reduce `trackingInterval` to aggregate data more frequently
- Call `clearData` to manually clear data

## License

MIT

## Support

For issues, questions, or contributions, please refer to the main FlexiPlatform repository:
- GitHub: https://github.com/seibchristian/FlexiPlatform
- Issues: https://github.com/seibchristian/FlexiPlatform/issues

## Author

Manus AI

## Version

1.0.0 (February 2026)
