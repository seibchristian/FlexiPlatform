/**
 * Plugin Integration for Production Planning Plugin
 * Provides integration points with FlexiPlatform
 */

import type { FlexiPlatformPlugin } from '@flexiplatform/types';
import { productionPlanningPlugin } from './index';
import type { ProductionPlanningPluginConfig } from './types';

/**
 * Export the plugin as a FlexiPlatform compatible plugin
 */
export const plugin: FlexiPlatformPlugin<ProductionPlanningPluginConfig> = {
  // Plugin metadata
  name: productionPlanningPlugin.name,
  version: productionPlanningPlugin.version,
  displayName: productionPlanningPlugin.displayName,
  description: productionPlanningPlugin.description,
  author: productionPlanningPlugin.author,

  // Lifecycle methods
  async initialize(config: ProductionPlanningPluginConfig) {
    return await productionPlanningPlugin.initialize(config);
  },

  async activate() {
    return await productionPlanningPlugin.activate();
  },

  async deactivate() {
    return await productionPlanningPlugin.deactivate();
  },

  async shutdown() {
    return await productionPlanningPlugin.shutdown();
  },

  // Execute plugin actions
  async execute(action: string, params: Record<string, any>) {
    return await productionPlanningPlugin.execute(action, params);
  },
};

/**
 * Plugin routes for React Navigation
 * These screens should be registered in the FlexiPlatform navigation stack
 */
export const pluginRoutes = {
  'ProductionPlanning/Customers': {
    name: 'ProductionPlanning/Customers',
    title: 'Customers',
    icon: 'people',
  },
  'ProductionPlanning/Products': {
    name: 'ProductionPlanning/Products',
    title: 'Products',
    icon: 'box',
  },
  'ProductionPlanning/Orders': {
    name: 'ProductionPlanning/Orders',
    title: 'Orders',
    icon: 'receipt',
  },
  'ProductionPlanning/CustomerForm': {
    name: 'ProductionPlanning/CustomerForm',
    title: 'Customer Form',
    options: { headerShown: true },
  },
  'ProductionPlanning/ProductForm': {
    name: 'ProductionPlanning/ProductForm',
    title: 'Product Form',
    options: { headerShown: true },
  },
  'ProductionPlanning/OrderForm': {
    name: 'ProductionPlanning/OrderForm',
    title: 'Order Form',
    options: { headerShown: true },
  },
  'ProductionPlanning/OrderDetail': {
    name: 'ProductionPlanning/OrderDetail',
    title: 'Order Detail',
    options: { headerShown: true },
  },
};

/**
 * Plugin menu items for the main navigation
 */
export const pluginMenuItems = [
  {
    id: 'production-planning',
    title: 'Production Planning',
    icon: 'factory',
    description: 'Manage customers, products, and orders',
    items: [
      {
        id: 'customers',
        title: 'Customers',
        route: 'ProductionPlanning/Customers',
        icon: 'people',
      },
      {
        id: 'products',
        title: 'Products',
        route: 'ProductionPlanning/Products',
        icon: 'box',
      },
      {
        id: 'orders',
        title: 'Orders',
        route: 'ProductionPlanning/Orders',
        icon: 'receipt',
      },
    ],
  },
];

/**
 * Plugin settings schema
 * Defines the configuration UI for the plugin
 */
export const pluginSettingsSchema = {
  sections: [
    {
      id: 'general',
      title: 'General Settings',
      fields: [
        {
          id: 'enableCustomerArchiving',
          type: 'boolean',
          label: 'Enable Customer Archiving',
          description: 'Allow customers to be archived instead of deleted',
          default: true,
        },
        {
          id: 'defaultOrderStatus',
          type: 'select',
          label: 'Default Order Status',
          description: 'Default status for newly created orders',
          options: [
            { value: 'Neu', label: 'New' },
            { value: 'In Bearbeitung', label: 'In Progress' },
            { value: 'Fertig', label: 'Completed' },
          ],
          default: 'Neu',
        },
        {
          id: 'currencySymbol',
          type: 'text',
          label: 'Currency Symbol',
          description: 'Currency symbol for price display',
          default: '€',
        },
        {
          id: 'enablePdfGeneration',
          type: 'boolean',
          label: 'Enable PDF Generation',
          description: 'Generate PDF order sheets',
          default: true,
        },
      ],
    },
    {
      id: 'company',
      title: 'Company Information',
      fields: [
        {
          id: 'companyName',
          type: 'text',
          label: 'Company Name',
          description: 'Your company name for order sheets',
          default: 'Your Company Name',
        },
        {
          id: 'companyAddress',
          type: 'textarea',
          label: 'Company Address',
          description: 'Your company address for order sheets',
          default: '',
        },
        {
          id: 'companyPhone',
          type: 'text',
          label: 'Company Phone',
          description: 'Your company phone number for order sheets',
          default: '',
        },
        {
          id: 'companyEmail',
          type: 'email',
          label: 'Company Email',
          description: 'Your company email for order sheets',
          default: '',
        },
      ],
    },
  ],
};

/**
 * Plugin permissions required
 */
export const pluginPermissions = [
  'read:database',
  'write:database',
  'read:users',
  'write:storage',
];

/**
 * Plugin hooks that can be triggered
 */
export const pluginHooks = [
  'onPluginInitialize',
  'onDataChange',
  'onOrderCreated',
  'onOrderStatusChanged',
  'onCustomerCreated',
  'onProductCreated',
];

/**
 * Export plugin for registration
 */
export default plugin;
