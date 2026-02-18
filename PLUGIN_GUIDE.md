# FlexiPlatform Plugin Development Guide

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Author**: Manus AI

## Table of Contents

1. [Introduction](#introduction)
2. [Plugin Architecture](#plugin-architecture)
3. [Getting Started](#getting-started)
4. [Plugin Structure](#plugin-structure)
5. [Plugin Lifecycle](#plugin-lifecycle)
6. [API Reference](#api-reference)
7. [Best Practices](#best-practices)
8. [Examples](#examples)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)

---

## Introduction

The FlexiPlatform plugin system enables developers to extend the platform's functionality without modifying the core codebase. Plugins are modular, self-contained packages that can be installed, configured, activated, and deactivated at runtime.

### Key Benefits

**Modularity**: Plugins are isolated from the core system, reducing dependencies and improving maintainability. Each plugin can be developed, tested, and deployed independently.

**Extensibility**: Add new features to FlexiPlatform without touching the core code. The plugin system provides a standardized interface for all plugins to interact with the platform.

**Runtime Management**: Plugins can be installed, activated, deactivated, and removed without restarting the platform. Configuration changes are applied immediately.

**Security**: Plugins run in a sandboxed environment with limited access to system resources. The platform enforces permission-based access control.

---

## Plugin Architecture

### Overview

The FlexiPlatform plugin system consists of four main components:

| Component | Purpose |
|-----------|---------|
| **Plugin Registry** | Maintains a catalog of all installed plugins with their metadata and status |
| **Plugin Loader** | Dynamically loads and initializes plugins at runtime |
| **Plugin Lifecycle Manager** | Handles plugin initialization, activation, deactivation, and cleanup |
| **Plugin API** | Provides a standardized interface for plugins to interact with the platform |

### Plugin Lifecycle

Every plugin follows a well-defined lifecycle:

```
Installation → Initialization → Activation → Configuration → Execution → Deactivation → Uninstallation
```

**Installation**: The plugin package is added to the system and registered in the database.

**Initialization**: The plugin's `initialize()` method is called with the configuration. The plugin sets up resources, connects to external services, and validates its environment.

**Activation**: The plugin is marked as active and begins processing requests. Event listeners are registered and hooks are attached.

**Configuration**: The plugin's settings can be modified through the management interface. Configuration changes are persisted and applied immediately.

**Execution**: The plugin processes requests, handles events, and executes its core functionality.

**Deactivation**: The plugin is marked as inactive. Event listeners are removed and resources are released.

**Uninstallation**: The plugin is completely removed from the system, including its database records and files.

### Permission Model

FlexiPlatform implements a role-based permission model for plugins:

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all plugin operations and system resources |
| **Editor** | Can manage plugins but cannot modify core system settings |
| **Viewer** | Read-only access to plugin information |

Plugins can request specific permissions during initialization. The platform validates permissions before allowing plugin actions.

---

## Getting Started

### Prerequisites

Before developing a plugin, ensure you have:

- **Node.js** (version 22.13 or higher)
- **TypeScript** (version 5.9 or higher)
- **pnpm** package manager
- **Git** for version control
- **FlexiPlatform** source code cloned locally

### Development Environment Setup

1. **Clone the FlexiPlatform repository**

   ```bash
   git clone https://github.com/seibchristian/FlexiPlatform.git
   cd FlexiPlatform
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

   The backend API runs on `http://localhost:3000` and the frontend on `http://localhost:8081`.

4. **Create a plugins directory**

   ```bash
   mkdir -p plugins/my-plugin
   cd plugins/my-plugin
   ```

### Creating Your First Plugin

The simplest way to get started is to use the sample plugin as a template:

```bash
cp -r plugins/sample-plugin plugins/my-first-plugin
cd plugins/my-first-plugin
npm install
```

Then modify the plugin configuration and implement your custom logic.

---

## Plugin Structure

### Directory Layout

A well-organized plugin follows this structure:

```
my-plugin/
├── src/
│   ├── index.ts              # Main plugin entry point
│   ├── types.ts              # TypeScript type definitions
│   ├── config.ts             # Configuration schema and defaults
│   ├── handlers/             # Event and action handlers
│   │   ├── init.ts
│   │   ├── execute.ts
│   │   └── shutdown.ts
│   └── utils/                # Utility functions
│       ├── logger.ts
│       └── validators.ts
├── tests/
│   ├── plugin.test.ts        # Unit tests
│   └── integration.test.ts   # Integration tests
├── dist/                     # Compiled output (generated)
├── package.json              # Plugin dependencies
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Plugin documentation
└── plugin.config.json        # Plugin metadata
```

### plugin.config.json

The plugin metadata file defines the plugin's identity and capabilities:

```json
{
  "name": "my-plugin",
  "displayName": "My Custom Plugin",
  "version": "1.0.0",
  "description": "A custom plugin that extends FlexiPlatform functionality",
  "author": "Your Name",
  "license": "MIT",
  "homepage": "https://github.com/yourusername/my-plugin",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/my-plugin.git"
  },
  "keywords": ["flexiplatform", "plugin", "custom"],
  "permissions": [
    "read:users",
    "write:plugins",
    "read:database"
  ],
  "hooks": [
    "onPluginInitialize",
    "onUserLogin",
    "onDataChange"
  ],
  "settings": {
    "apiKey": {
      "type": "string",
      "required": true,
      "description": "API key for external service"
    },
    "enableNotifications": {
      "type": "boolean",
      "default": true,
      "description": "Enable plugin notifications"
    },
    "maxRetries": {
      "type": "number",
      "default": 3,
      "min": 1,
      "max": 10,
      "description": "Maximum number of retries"
    }
  }
}
```

### Main Plugin File (index.ts)

The main plugin file exports the plugin interface:

```typescript
import type { FlexiPlatformPlugin, PluginConfig } from '@flexiplatform/types';

export interface MyPluginConfig extends PluginConfig {
  apiKey: string;
  enableNotifications: boolean;
  maxRetries: number;
}

export const myPlugin: FlexiPlatformPlugin<MyPluginConfig> = {
  // Plugin metadata
  name: 'my-plugin',
  version: '1.0.0',
  displayName: 'My Custom Plugin',
  description: 'A custom plugin for FlexiPlatform',
  author: 'Your Name',

  // Lifecycle methods
  async initialize(config: MyPluginConfig) {
    console.log('Plugin initializing with config:', config);
    // Setup resources, validate configuration
  },

  async activate() {
    console.log('Plugin activated');
    // Register event listeners, start background tasks
  },

  async deactivate() {
    console.log('Plugin deactivated');
    // Cleanup resources, unregister listeners
  },

  async shutdown() {
    console.log('Plugin shutting down');
    // Final cleanup before uninstallation
  },

  // Action execution
  async execute(action: string, params: Record<string, any>) {
    switch (action) {
      case 'doSomething':
        return await this.doSomething(params);
      case 'getStatus':
        return await this.getStatus();
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  },

  // Custom methods
  async doSomething(params: Record<string, any>) {
    return { success: true, message: 'Action completed' };
  },

  async getStatus() {
    return { status: 'active', uptime: process.uptime() };
  },
};

export default myPlugin;
```

---

## Plugin Lifecycle

### Initialization Phase

The initialization phase is called when the plugin is first loaded:

```typescript
async initialize(config: MyPluginConfig) {
  // Validate configuration
  if (!config.apiKey) {
    throw new Error('API key is required');
  }

  // Connect to external services
  this.apiClient = new ApiClient(config.apiKey);

  // Setup database connections
  this.db = await connectDatabase();

  // Register event listeners
  this.eventBus.on('user:login', this.handleUserLogin.bind(this));

  // Initialize plugin state
  this.state = {
    isReady: true,
    startTime: Date.now(),
  };

  console.log('Plugin initialized successfully');
}
```

### Activation Phase

The activation phase is called when the plugin is activated:

```typescript
async activate() {
  // Start background tasks
  this.backgroundTask = setInterval(() => {
    this.performBackgroundWork();
  }, 60000);

  // Register API endpoints
  this.registerEndpoints();

  // Emit activation event
  this.eventBus.emit('plugin:activated', { name: this.name });

  console.log('Plugin activated');
}
```

### Deactivation Phase

The deactivation phase is called when the plugin is deactivated:

```typescript
async deactivate() {
  // Stop background tasks
  if (this.backgroundTask) {
    clearInterval(this.backgroundTask);
  }

  // Unregister event listeners
  this.eventBus.removeAllListeners();

  // Close connections
  if (this.apiClient) {
    await this.apiClient.close();
  }

  console.log('Plugin deactivated');
}
```

### Shutdown Phase

The shutdown phase is called before the plugin is uninstalled:

```typescript
async shutdown() {
  // Cleanup resources
  await this.db.close();

  // Remove temporary files
  await this.cleanupTempFiles();

  // Unregister from registry
  await this.unregisterFromRegistry();

  console.log('Plugin shut down');
}
```

---

## API Reference

### Plugin Interface

```typescript
interface FlexiPlatformPlugin<T extends PluginConfig = PluginConfig> {
  // Metadata
  name: string;
  version: string;
  displayName: string;
  description: string;
  author: string;

  // Lifecycle
  initialize(config: T): Promise<void>;
  activate(): Promise<void>;
  deactivate(): Promise<void>;
  shutdown(): Promise<void>;

  // Execution
  execute(action: string, params: Record<string, any>): Promise<any>;

  // Event handling
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
  emit(event: string, data: any): void;

  // Configuration
  getConfig(): T;
  updateConfig(config: Partial<T>): Promise<void>;

  // Logging
  log(level: 'info' | 'warn' | 'error', message: string, data?: any): void;
}
```

### Platform API

Plugins have access to the following platform APIs:

#### Database API

```typescript
// Query the database
const users = await platform.db.query('SELECT * FROM users');

// Execute a transaction
await platform.db.transaction(async (tx) => {
  await tx.insert('users', { name: 'John' });
});

// Listen for changes
platform.db.on('change', (event) => {
  console.log('Database changed:', event);
});
```

#### Event Bus API

```typescript
// Listen for events
platform.events.on('user:login', (user) => {
  console.log('User logged in:', user.name);
});

// Emit custom events
platform.events.emit('plugin:action', { action: 'doSomething' });

// Remove listeners
platform.events.off('user:login', handler);
```

#### Logger API

```typescript
// Log messages
platform.logger.info('Plugin started');
platform.logger.warn('Configuration incomplete');
platform.logger.error('Connection failed', error);

// Log with context
platform.logger.info('User action', { userId: 123, action: 'login' });
```

#### Storage API

```typescript
// Store data
await platform.storage.set('plugin:key', { data: 'value' });

// Retrieve data
const data = await platform.storage.get('plugin:key');

// Delete data
await platform.storage.delete('plugin:key');

// List all keys
const keys = await platform.storage.keys();
```

#### HTTP API

```typescript
// Make HTTP requests
const response = await platform.http.get('https://api.example.com/data');

// POST with data
const result = await platform.http.post('https://api.example.com/data', {
  name: 'John',
  email: 'john@example.com',
});

// Configure request options
const custom = await platform.http.request({
  method: 'PUT',
  url: 'https://api.example.com/data',
  headers: { 'Authorization': 'Bearer token' },
  data: { updated: true },
  timeout: 5000,
});
```

---

## Best Practices

### Error Handling

Always implement comprehensive error handling:

```typescript
async execute(action: string, params: Record<string, any>) {
  try {
    switch (action) {
      case 'doSomething':
        return await this.doSomething(params);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    this.log('error', 'Action failed', { action, error: error.message });
    throw error;
  }
}
```

### Configuration Validation

Validate configuration during initialization:

```typescript
async initialize(config: MyPluginConfig) {
  // Validate required fields
  if (!config.apiKey) {
    throw new Error('API key is required');
  }

  // Validate field types
  if (typeof config.maxRetries !== 'number') {
    throw new Error('maxRetries must be a number');
  }

  // Validate field ranges
  if (config.maxRetries < 1 || config.maxRetries > 10) {
    throw new Error('maxRetries must be between 1 and 10');
  }
}
```

### Resource Management

Always clean up resources properly:

```typescript
async activate() {
  this.connections = [];
  this.timers = [];
}

async deactivate() {
  // Close all connections
  for (const conn of this.connections) {
    await conn.close();
  }
  this.connections = [];

  // Clear all timers
  for (const timer of this.timers) {
    clearTimeout(timer);
  }
  this.timers = [];
}
```

### Logging

Use structured logging for debugging:

```typescript
this.log('info', 'Plugin started', {
  version: this.version,
  config: this.config,
  timestamp: new Date().toISOString(),
});

this.log('warn', 'Retry attempt', {
  attempt: retryCount,
  maxRetries: this.config.maxRetries,
});

this.log('error', 'Request failed', {
  url: requestUrl,
  statusCode: response.status,
  error: error.message,
});
```

### Testing

Write comprehensive tests for your plugin:

```typescript
// tests/plugin.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import myPlugin from '../src/index';

describe('MyPlugin', () => {
  beforeEach(async () => {
    await myPlugin.initialize({
      apiKey: 'test-key',
      enableNotifications: true,
      maxRetries: 3,
    });
  });

  afterEach(async () => {
    await myPlugin.deactivate();
  });

  it('should initialize successfully', async () => {
    expect(myPlugin.state.isReady).toBe(true);
  });

  it('should execute actions', async () => {
    const result = await myPlugin.execute('doSomething', {});
    expect(result.success).toBe(true);
  });

  it('should handle errors', async () => {
    expect(async () => {
      await myPlugin.execute('unknownAction', {});
    }).rejects.toThrow();
  });
});
```

### Documentation

Document your plugin thoroughly:

```markdown
# My Plugin

A custom plugin for FlexiPlatform that provides [functionality].

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

```bash
npm install my-plugin
```

## Configuration

```json
{
  "apiKey": "your-api-key",
  "enableNotifications": true,
  "maxRetries": 3
}
```

## Usage

```typescript
const result = await myPlugin.execute('doSomething', { param: 'value' });
```

## API Reference

### doSomething(params)

Description of the action.

**Parameters:**
- `param` (string): Parameter description

**Returns:** Promise<Result>
```

---

## Examples

### Example 1: Analytics Plugin

This plugin tracks user actions and generates analytics reports:

```typescript
export const analyticsPlugin: FlexiPlatformPlugin = {
  name: 'analytics',
  version: '1.0.0',
  displayName: 'Analytics Plugin',
  description: 'Track user actions and generate reports',
  author: 'Your Name',

  async initialize(config) {
    this.events = [];
    platform.events.on('user:action', (event) => {
      this.events.push({
        timestamp: Date.now(),
        ...event,
      });
    });
  },

  async execute(action, params) {
    if (action === 'getReport') {
      return {
        totalEvents: this.events.length,
        eventsByType: this.groupEventsByType(),
        timeRange: params.timeRange,
      };
    }
  },

  groupEventsByType() {
    const grouped = {};
    for (const event of this.events) {
      grouped[event.type] = (grouped[event.type] || 0) + 1;
    }
    return grouped;
  },
};
```

### Example 2: Email Notification Plugin

This plugin sends email notifications on specific events:

```typescript
export const emailPlugin: FlexiPlatformPlugin = {
  name: 'email',
  version: '1.0.0',
  displayName: 'Email Notifications',
  description: 'Send email notifications on events',
  author: 'Your Name',

  async initialize(config) {
    this.emailService = new EmailService(config.smtpServer);
    platform.events.on('alert', (alert) => {
      this.sendAlert(alert);
    });
  },

  async sendAlert(alert) {
    try {
      await this.emailService.send({
        to: alert.recipient,
        subject: alert.subject,
        body: alert.message,
      });
    } catch (error) {
      this.log('error', 'Failed to send email', { error: error.message });
    }
  },

  async execute(action, params) {
    if (action === 'sendEmail') {
      return await this.sendAlert(params);
    }
  },
};
```

---

## Troubleshooting

### Plugin fails to initialize

**Problem**: Plugin initialization throws an error.

**Solution**: Check the error message in the logs. Ensure all required configuration is provided and valid. Verify that external services are accessible.

```bash
# Check logs
tail -f /var/log/flexiplatform/plugin.log

# Validate configuration
pnpm run validate-config
```

### Plugin not appearing in the UI

**Problem**: Plugin is installed but not visible in the management interface.

**Solution**: Ensure the plugin is registered in the database. Check that the plugin metadata is valid.

```bash
# Check plugin registry
curl http://localhost:3000/api/plugins

# Verify plugin.config.json
pnpm run validate-plugin-config
```

### Plugin actions not executing

**Problem**: Plugin execute() method is called but actions don't work.

**Solution**: Ensure the action name matches the case-sensitive switch statement. Check that all dependencies are initialized.

```typescript
// Debug: Log all incoming actions
async execute(action, params) {
  console.log('Executing action:', action, 'with params:', params);
  // ... rest of implementation
}
```

### Memory leaks in plugin

**Problem**: Plugin consumes increasing memory over time.

**Solution**: Ensure all resources are cleaned up in the deactivate() method. Check for event listener leaks.

```typescript
async deactivate() {
  // Remove all event listeners
  platform.events.removeAllListeners();

  // Close all connections
  for (const conn of this.connections) {
    await conn.close();
  }

  // Clear all timers
  for (const timer of this.timers) {
    clearTimeout(timer);
  }
}
```

---

## FAQ

**Q: Can plugins access the database directly?**

A: Yes, plugins have access to the database through the `platform.db` API. However, it's recommended to use the platform's data access layer for consistency and security.

**Q: Can plugins communicate with each other?**

A: Yes, plugins can communicate through the event bus. Use `platform.events.emit()` to send events and `platform.events.on()` to listen for events from other plugins.

**Q: How do I distribute my plugin?**

A: Package your plugin as an npm module and publish it to npm. Users can then install it using `npm install your-plugin-name`. Alternatively, create a GitHub repository and provide installation instructions.

**Q: Can plugins modify the core platform?**

A: No, plugins run in a sandboxed environment and cannot modify the core platform code. Plugins can only extend functionality through the provided APIs.

**Q: How do I debug my plugin?**

A: Use the `platform.logger` API to log debug information. You can also use Node.js debugger with `node --inspect` and connect your IDE's debugger.

**Q: What's the maximum size for a plugin?**

A: There's no hard limit, but it's recommended to keep plugins under 10MB to ensure fast loading and installation.

**Q: Can plugins run background tasks?**

A: Yes, plugins can run background tasks using `setInterval()` or `setTimeout()`. Ensure to clean up timers in the deactivate() method.

**Q: How do I handle plugin configuration updates?**

A: Implement the `updateConfig()` method to handle configuration changes. The platform will call this method when configuration is updated through the UI.

---

## Support and Resources

- **GitHub Repository**: https://github.com/seibchristian/FlexiPlatform
- **Issue Tracker**: https://github.com/seibchristian/FlexiPlatform/issues
- **Discussions**: https://github.com/seibchristian/FlexiPlatform/discussions
- **Documentation**: https://github.com/seibchristian/FlexiPlatform/wiki

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Author**: Manus AI
