/**
 * Unit tests for Production Planning Plugin
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { productionPlanningPlugin } from '../src/index';
import type { ProductionPlanningPluginConfig } from '../src/types';

describe('Production Planning Plugin', () => {
  const mockConfig: ProductionPlanningPluginConfig = {
    enabled: true,
    enableCustomerArchiving: true,
    defaultOrderStatus: 'Neu',
    currencySymbol: '€',
    enablePdfGeneration: true,
    companyName: 'Test Company',
    companyAddress: '123 Test Street',
    companyPhone: '+49 123 456789',
    companyEmail: 'info@testcompany.de',
  };

  beforeEach(async () => {
    // Initialize plugin before each test
    await productionPlanningPlugin.initialize(mockConfig);
    await productionPlanningPlugin.activate();
  });

  describe('Customer Management', () => {
    it('should create a new customer', async () => {
      const result = await productionPlanningPlugin.execute('customers.create', {
        customerNumber: 'CUST-001',
        name: 'Test Customer',
        address: '123 Test Street',
        email: 'test@example.com',
        phone: '+49 123 456789',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.name).toBe('Test Customer');
      expect(result.data.customerNumber).toBe('CUST-001');
      expect(result.data.isArchived).toBe(false);
    });

    it('should list all customers', async () => {
      // Create a customer first
      await productionPlanningPlugin.execute('customers.create', {
        customerNumber: 'CUST-001',
        name: 'Test Customer 1',
      });

      const result = await productionPlanningPlugin.execute('customers.list', {});

      expect(result.success).toBe(true);
      expect(result.data.customers).toBeDefined();
      expect(result.data.count).toBeGreaterThan(0);
    });

    it('should get customer by ID', async () => {
      // Create a customer first
      const createResult = await productionPlanningPlugin.execute('customers.create', {
        customerNumber: 'CUST-002',
        name: 'Test Customer 2',
      });

      const customerId = createResult.data.id;

      const result = await productionPlanningPlugin.execute('customers.getById', {
        id: customerId,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.id).toBe(customerId);
      expect(result.data.name).toBe('Test Customer 2');
    });

    it('should update a customer', async () => {
      // Create a customer first
      const createResult = await productionPlanningPlugin.execute('customers.create', {
        customerNumber: 'CUST-003',
        name: 'Test Customer 3',
      });

      const customerId = createResult.data.id;

      const result = await productionPlanningPlugin.execute('customers.update', {
        id: customerId,
        name: 'Updated Customer Name',
        email: 'updated@example.com',
      });

      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Updated Customer Name');
      expect(result.data.email).toBe('updated@example.com');
    });

    it('should archive a customer', async () => {
      // Create a customer first
      const createResult = await productionPlanningPlugin.execute('customers.create', {
        customerNumber: 'CUST-004',
        name: 'Test Customer 4',
      });

      const customerId = createResult.data.id;

      const result = await productionPlanningPlugin.execute('customers.archive', {
        id: customerId,
      });

      expect(result.success).toBe(true);
      expect(result.data.isArchived).toBe(true);
    });

    it('should not list archived customers by default', async () => {
      // Create and archive a customer
      const createResult = await productionPlanningPlugin.execute('customers.create', {
        customerNumber: 'CUST-005',
        name: 'Test Customer 5',
      });

      const customerId = createResult.data.id;

      await productionPlanningPlugin.execute('customers.archive', {
        id: customerId,
      });

      const listResult = await productionPlanningPlugin.execute('customers.list', {
        includeArchived: false,
      });

      const archivedCustomer = listResult.data.customers.find((c: any) => c.id === customerId);
      expect(archivedCustomer).toBeUndefined();
    });
  });

  describe('Product Management', () => {
    it('should create a new product', async () => {
      const result = await productionPlanningPlugin.execute('products.create', {
        articleNumber: 'ART-001',
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        category: 'Electronics',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.name).toBe('Test Product');
      expect(result.data.price).toBe(99.99);
    });

    it('should list all products', async () => {
      // Create a product first
      await productionPlanningPlugin.execute('products.create', {
        articleNumber: 'ART-002',
        name: 'Test Product 2',
        price: 49.99,
      });

      const result = await productionPlanningPlugin.execute('products.list', {});

      expect(result.success).toBe(true);
      expect(result.data.products).toBeDefined();
      expect(result.data.count).toBeGreaterThan(0);
    });

    it('should get product by ID', async () => {
      // Create a product first
      const createResult = await productionPlanningPlugin.execute('products.create', {
        articleNumber: 'ART-003',
        name: 'Test Product 3',
        price: 29.99,
      });

      const productId = createResult.data.id;

      const result = await productionPlanningPlugin.execute('products.getById', {
        id: productId,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.id).toBe(productId);
    });

    it('should update a product', async () => {
      // Create a product first
      const createResult = await productionPlanningPlugin.execute('products.create', {
        articleNumber: 'ART-004',
        name: 'Test Product 4',
        price: 19.99,
      });

      const productId = createResult.data.id;

      const result = await productionPlanningPlugin.execute('products.update', {
        id: productId,
        name: 'Updated Product Name',
        price: 24.99,
      });

      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Updated Product Name');
      expect(result.data.price).toBe(24.99);
    });

    it('should delete a product', async () => {
      // Create a product first
      const createResult = await productionPlanningPlugin.execute('products.create', {
        articleNumber: 'ART-005',
        name: 'Test Product 5',
        price: 9.99,
      });

      const productId = createResult.data.id;

      const result = await productionPlanningPlugin.execute('products.delete', {
        id: productId,
      });

      expect(result.success).toBe(true);
      expect(result.data.deleted).toBe(true);
    });
  });

  describe('Order Management', () => {
    it('should create a new order', async () => {
      // Create a customer and product first
      const customerResult = await productionPlanningPlugin.execute('customers.create', {
        customerNumber: 'CUST-ORD-001',
        name: 'Order Test Customer',
      });

      const productResult = await productionPlanningPlugin.execute('products.create', {
        articleNumber: 'ART-ORD-001',
        name: 'Order Test Product',
        price: 99.99,
      });

      const result = await productionPlanningPlugin.execute('orders.create', {
        customerId: customerResult.data.id,
        items: [
          {
            productId: productResult.data.id,
            quantity: 2,
            unitPrice: 99.99,
          },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.customerId).toBe(customerResult.data.id);
      expect(result.data.totalAmount).toBe(199.98);
      expect(result.data.status).toBe('Neu');
    });

    it('should list all orders', async () => {
      // Create a customer and product first
      const customerResult = await productionPlanningPlugin.execute('customers.create', {
        customerNumber: 'CUST-ORD-002',
        name: 'Order Test Customer 2',
      });

      const productResult = await productionPlanningPlugin.execute('products.create', {
        articleNumber: 'ART-ORD-002',
        name: 'Order Test Product 2',
        price: 49.99,
      });

      // Create an order
      await productionPlanningPlugin.execute('orders.create', {
        customerId: customerResult.data.id,
        items: [
          {
            productId: productResult.data.id,
            quantity: 1,
            unitPrice: 49.99,
          },
        ],
      });

      const result = await productionPlanningPlugin.execute('orders.list', {});

      expect(result.success).toBe(true);
      expect(result.data.orders).toBeDefined();
      expect(result.data.count).toBeGreaterThan(0);
    });

    it('should update order status', async () => {
      // Create a customer and product first
      const customerResult = await productionPlanningPlugin.execute('customers.create', {
        customerNumber: 'CUST-ORD-003',
        name: 'Order Test Customer 3',
      });

      const productResult = await productionPlanningPlugin.execute('products.create', {
        articleNumber: 'ART-ORD-003',
        name: 'Order Test Product 3',
        price: 29.99,
      });

      // Create an order
      const orderResult = await productionPlanningPlugin.execute('orders.create', {
        customerId: customerResult.data.id,
        items: [
          {
            productId: productResult.data.id,
            quantity: 1,
            unitPrice: 29.99,
          },
        ],
      });

      const orderId = orderResult.data.id;

      const result = await productionPlanningPlugin.execute('orders.updateStatus', {
        id: orderId,
        status: 'In Bearbeitung',
      });

      expect(result.success).toBe(true);
      expect(result.data.status).toBe('In Bearbeitung');
    });
  });

  describe('Printing/PDF', () => {
    it('should generate a printable order', async () => {
      // Create a customer and product first
      const customerResult = await productionPlanningPlugin.execute('customers.create', {
        customerNumber: 'CUST-PRINT-001',
        name: 'Print Test Customer',
        address: '123 Print Street',
        email: 'print@example.com',
      });

      const productResult = await productionPlanningPlugin.execute('products.create', {
        articleNumber: 'ART-PRINT-001',
        name: 'Print Test Product',
        price: 99.99,
      });

      // Create an order
      const orderResult = await productionPlanningPlugin.execute('orders.create', {
        customerId: customerResult.data.id,
        items: [
          {
            productId: productResult.data.id,
            quantity: 2,
            unitPrice: 99.99,
          },
        ],
      });

      const orderId = orderResult.data.id;

      const result = await productionPlanningPlugin.execute('orders.generatePrintableOrder', {
        id: orderId,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.orderNumber).toBeDefined();
      expect(result.data.customer.name).toBe('Print Test Customer');
      expect(result.data.items).toHaveLength(1);
      expect(result.data.totalAmount).toBe(199.98);
    });
  });

  describe('Plugin Status', () => {
    it('should return plugin status', async () => {
      const result = await productionPlanningPlugin.execute('getStatus', {});

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.status).toBe('active');
      expect(result.data.uptime).toBeGreaterThan(0);
      expect(result.data.customersCount).toBeGreaterThanOrEqual(0);
      expect(result.data.productsCount).toBeGreaterThanOrEqual(0);
      expect(result.data.ordersCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid customer creation', async () => {
      const result = await productionPlanningPlugin.execute('customers.create', {
        name: 'Test Customer',
        // Missing customerNumber
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle duplicate customer numbers', async () => {
      // Create a customer
      await productionPlanningPlugin.execute('customers.create', {
        customerNumber: 'CUST-DUP-001',
        name: 'Test Customer',
      });

      // Try to create another with the same number
      const result = await productionPlanningPlugin.execute('customers.create', {
        customerNumber: 'CUST-DUP-001',
        name: 'Another Customer',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('already exists');
    });

    it('should handle non-existent customer in order creation', async () => {
      const productResult = await productionPlanningPlugin.execute('products.create', {
        articleNumber: 'ART-ERR-001',
        name: 'Error Test Product',
        price: 99.99,
      });

      const result = await productionPlanningPlugin.execute('orders.create', {
        customerId: 99999, // Non-existent customer
        items: [
          {
            productId: productResult.data.id,
            quantity: 1,
            unitPrice: 99.99,
          },
        ],
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });
});
