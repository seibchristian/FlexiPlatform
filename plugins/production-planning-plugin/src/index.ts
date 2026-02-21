/**
 * Production Planning Plugin for FlexiPlatform
 *
 * This plugin provides comprehensive production planning functionality including:
 * - Customer management (create, read, update, archive)
 * - Product database (create, read, update, delete)
 * - Order management (create, read, update, delete)
 * - Order printing (PDF generation)
 */

import type {
  ProductionPlanningPluginConfig,
  PluginState,
  Customer,
  Product,
  Order,
  OrderItem,
  CreateCustomerDTO,
  UpdateCustomerDTO,
  CreateProductDTO,
  UpdateProductDTO,
  CreateOrderDTO,
  UpdateOrderDTO,
  ExecuteParams,
  ExecuteResult,
  OrderSummary,
  PrintableOrder,
} from './types';

/**
 * Production Planning Plugin
 * Main plugin class implementing the FlexiPlatform plugin interface
 */
class ProductionPlanningPlugin {
  // Plugin metadata
  name = 'production-planning-plugin';
  version = '1.0.0';
  displayName = 'Production Planning Plugin';
  description = 'Comprehensive production planning plugin for customer, product, and order management';
  author = 'Manus AI';

  // Configuration and state
  private config: ProductionPlanningPluginConfig | null = null;
  private state: PluginState = {
    isReady: false,
    startTime: 0,
    customersCount: 0,
    productsCount: 0,
    ordersCount: 0,
    isProcessing: false,
  };

  // In-memory data storage (in production, this would be a database)
  private customers: Map<number, Customer> = new Map();
  private products: Map<number, Product> = new Map();
  private orders: Map<number, Order> = new Map();
  private orderItems: Map<number, OrderItem> = new Map();

  // Auto-increment IDs
  private customerIdCounter = 1;
  private productIdCounter = 1;
  private orderIdCounter = 1;
  private orderItemIdCounter = 1;

  /**
   * Initialize the plugin with configuration
   * Called when the plugin is first loaded
   */
  async initialize(config: ProductionPlanningPluginConfig): Promise<void> {
    try {
      // Validate configuration
      this.validateConfig(config);

      // Store configuration
      this.config = config;

      // Initialize state
      this.state = {
        isReady: true,
        startTime: Date.now(),
        customersCount: 0,
        productsCount: 0,
        ordersCount: 0,
        isProcessing: false,
      };

      this.log('info', 'Plugin initialized successfully', {
        config: this.config,
        startTime: this.state.startTime,
      });
    } catch (error) {
      this.log('error', 'Plugin initialization failed', { error: (error as Error).message });
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

      this.log('info', 'Plugin activated', {
        customersCount: this.state.customersCount,
        productsCount: this.state.productsCount,
        ordersCount: this.state.ordersCount,
      });
    } catch (error) {
      this.log('error', 'Plugin activation failed', { error: (error as Error).message });
      throw error;
    }
  }

  /**
   * Deactivate the plugin
   * Called when the plugin is deactivated
   */
  async deactivate(): Promise<void> {
    try {
      this.log('info', 'Plugin deactivated', {
        totalCustomers: this.state.customersCount,
        totalProducts: this.state.productsCount,
        totalOrders: this.state.ordersCount,
      });
    } catch (error) {
      this.log('error', 'Plugin deactivation failed', { error: (error as Error).message });
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
      this.customers.clear();
      this.products.clear();
      this.orders.clear();
      this.orderItems.clear();

      this.log('info', 'Plugin shut down', {
        customersCleared: true,
        productsCleared: true,
        ordersCleared: true,
      });
    } catch (error) {
      this.log('error', 'Plugin shutdown failed', { error: (error as Error).message });
    }
  }

  /**
   * Execute plugin actions
   * Main entry point for plugin operations
   */
  async execute(action: string, params: ExecuteParams): Promise<ExecuteResult> {
    try {
      this.log('info', 'Executing action', { action });

      switch (action) {
        // Customer Management
        case 'customers.list':
          return await this.handleCustomersList(params);
        case 'customers.getById':
          return await this.handleCustomersGetById(params);
        case 'customers.create':
          return await this.handleCustomersCreate(params);
        case 'customers.update':
          return await this.handleCustomersUpdate(params);
        case 'customers.archive':
          return await this.handleCustomersArchive(params);
        case 'customers.unarchive':
          return await this.handleCustomersUnarchive(params);

        // Product Management
        case 'products.list':
          return await this.handleProductsList(params);
        case 'products.getById':
          return await this.handleProductsGetById(params);
        case 'products.create':
          return await this.handleProductsCreate(params);
        case 'products.update':
          return await this.handleProductsUpdate(params);
        case 'products.delete':
          return await this.handleProductsDelete(params);

        // Order Management
        case 'orders.list':
          return await this.handleOrdersList(params);
        case 'orders.getById':
          return await this.handleOrdersGetById(params);
        case 'orders.create':
          return await this.handleOrdersCreate(params);
        case 'orders.update':
          return await this.handleOrdersUpdate(params);
        case 'orders.updateStatus':
          return await this.handleOrdersUpdateStatus(params);
        case 'orders.delete':
          return await this.handleOrdersDelete(params);

        // Printing/PDF
        case 'orders.generatePrintableOrder':
          return await this.handleGeneratePrintableOrder(params);

        // Status
        case 'getStatus':
          return await this.handleGetStatus();

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      this.log('error', 'Action execution failed', {
        action,
        error: (error as Error).message,
      });

      return {
        success: false,
        error: (error as Error).message,
        timestamp: Date.now(),
      };
    }
  }

  // ============================================================================
  // CUSTOMER MANAGEMENT HANDLERS
  // ============================================================================

  private async handleCustomersList(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { includeArchived = false } = params;

      let customers = Array.from(this.customers.values());

      if (!includeArchived) {
        customers = customers.filter((c) => !c.isArchived);
      }

      return {
        success: true,
        data: {
          customers,
          count: customers.length,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleCustomersGetById(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { id } = params;

      if (!id) {
        throw new Error('Customer ID is required');
      }

      const customer = this.customers.get(id);

      if (!customer) {
        return {
          success: true,
          data: null,
          timestamp: Date.now(),
        };
      }

      return {
        success: true,
        data: customer,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleCustomersCreate(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const dto: CreateCustomerDTO = {
        customerNumber: params.customerNumber,
        name: params.name,
        address: params.address,
        contactPerson: params.contactPerson,
        email: params.email,
        phone: params.phone,
      };

      // Validate required fields
      if (!dto.customerNumber || !dto.name) {
        throw new Error('customerNumber and name are required');
      }

      // Check for duplicate customer number
      const existingCustomer = Array.from(this.customers.values()).find(
        (c) => c.customerNumber === dto.customerNumber
      );

      if (existingCustomer) {
        throw new Error(`Customer with number ${dto.customerNumber} already exists`);
      }

      const customer: Customer = {
        id: this.customerIdCounter++,
        ...dto,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.customers.set(customer.id, customer);
      this.state.customersCount++;

      this.log('info', 'Customer created', { customerId: customer.id, customerNumber: dto.customerNumber });

      return {
        success: true,
        data: customer,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleCustomersUpdate(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { id } = params;
      const dto: UpdateCustomerDTO = {
        name: params.name,
        address: params.address,
        contactPerson: params.contactPerson,
        email: params.email,
        phone: params.phone,
      };

      if (!id) {
        throw new Error('Customer ID is required');
      }

      const customer = this.customers.get(id);

      if (!customer) {
        throw new Error(`Customer with ID ${id} not found`);
      }

      const updatedCustomer: Customer = {
        ...customer,
        ...Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined)),
        updatedAt: new Date(),
      };

      this.customers.set(id, updatedCustomer);

      this.log('info', 'Customer updated', { customerId: id });

      return {
        success: true,
        data: updatedCustomer,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleCustomersArchive(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { id } = params;

      if (!id) {
        throw new Error('Customer ID is required');
      }

      const customer = this.customers.get(id);

      if (!customer) {
        throw new Error(`Customer with ID ${id} not found`);
      }

      customer.isArchived = true;
      customer.updatedAt = new Date();
      this.customers.set(id, customer);

      this.log('info', 'Customer archived', { customerId: id });

      return {
        success: true,
        data: customer,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleCustomersUnarchive(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { id } = params;

      if (!id) {
        throw new Error('Customer ID is required');
      }

      const customer = this.customers.get(id);

      if (!customer) {
        throw new Error(`Customer with ID ${id} not found`);
      }

      customer.isArchived = false;
      customer.updatedAt = new Date();
      this.customers.set(id, customer);

      this.log('info', 'Customer unarchived', { customerId: id });

      return {
        success: true,
        data: customer,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  // ============================================================================
  // PRODUCT MANAGEMENT HANDLERS
  // ============================================================================

  private async handleProductsList(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { category } = params;

      let products = Array.from(this.products.values());

      if (category) {
        products = products.filter((p) => p.category === category);
      }

      return {
        success: true,
        data: {
          products,
          count: products.length,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleProductsGetById(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { id } = params;

      if (!id) {
        throw new Error('Product ID is required');
      }

      const product = this.products.get(id);

      if (!product) {
        return {
          success: true,
          data: null,
          timestamp: Date.now(),
        };
      }

      return {
        success: true,
        data: product,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleProductsCreate(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const dto: CreateProductDTO = {
        articleNumber: params.articleNumber,
        name: params.name,
        description: params.description,
        price: params.price,
        category: params.category,
        imageUrl: params.imageUrl,
      };

      // Validate required fields
      if (!dto.articleNumber || !dto.name || dto.price === undefined) {
        throw new Error('articleNumber, name, and price are required');
      }

      // Check for duplicate article number
      const existingProduct = Array.from(this.products.values()).find(
        (p) => p.articleNumber === dto.articleNumber
      );

      if (existingProduct) {
        throw new Error(`Product with article number ${dto.articleNumber} already exists`);
      }

      const product: Product = {
        id: this.productIdCounter++,
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.products.set(product.id, product);
      this.state.productsCount++;

      this.log('info', 'Product created', { productId: product.id, articleNumber: dto.articleNumber });

      return {
        success: true,
        data: product,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleProductsUpdate(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { id } = params;
      const dto: UpdateProductDTO = {
        name: params.name,
        description: params.description,
        price: params.price,
        category: params.category,
        imageUrl: params.imageUrl,
      };

      if (!id) {
        throw new Error('Product ID is required');
      }

      const product = this.products.get(id);

      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }

      const updatedProduct: Product = {
        ...product,
        ...Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined)),
        updatedAt: new Date(),
      };

      this.products.set(id, updatedProduct);

      this.log('info', 'Product updated', { productId: id });

      return {
        success: true,
        data: updatedProduct,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleProductsDelete(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { id } = params;

      if (!id) {
        throw new Error('Product ID is required');
      }

      const product = this.products.get(id);

      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }

      this.products.delete(id);
      this.state.productsCount--;

      this.log('info', 'Product deleted', { productId: id });

      return {
        success: true,
        data: { deleted: true },
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  // ============================================================================
  // ORDER MANAGEMENT HANDLERS
  // ============================================================================

  private async handleOrdersList(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { customerId, status } = params;

      let orders = Array.from(this.orders.values());

      if (customerId) {
        orders = orders.filter((o) => o.customerId === customerId);
      }

      if (status) {
        orders = orders.filter((o) => o.status === status);
      }

      return {
        success: true,
        data: {
          orders,
          count: orders.length,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleOrdersGetById(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { id } = params;

      if (!id) {
        throw new Error('Order ID is required');
      }

      const order = this.orders.get(id);

      if (!order) {
        return {
          success: true,
          data: null,
          timestamp: Date.now(),
        };
      }

      // Populate customer and items
      const customer = this.customers.get(order.customerId);
      const items = Array.from(this.orderItems.values()).filter((oi) => oi.orderId === id);

      const enrichedOrder: Order = {
        ...order,
        customer,
        items: items.map((item) => ({
          ...item,
          product: this.products.get(item.productId),
        })),
      };

      return {
        success: true,
        data: enrichedOrder,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleOrdersCreate(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const dto: CreateOrderDTO = {
        customerId: params.customerId,
        items: params.items || [],
      };

      // Validate required fields
      if (!dto.customerId) {
        throw new Error('customerId is required');
      }

      if (!Array.isArray(dto.items) || dto.items.length === 0) {
        throw new Error('At least one order item is required');
      }

      // Verify customer exists
      const customer = this.customers.get(dto.customerId);
      if (!customer) {
        throw new Error(`Customer with ID ${dto.customerId} not found`);
      }

      // Verify all products exist and calculate total
      let totalAmount = 0;
      const createdOrderItems: OrderItem[] = [];

      for (const itemDto of dto.items) {
        const product = this.products.get(itemDto.productId);
        if (!product) {
          throw new Error(`Product with ID ${itemDto.productId} not found`);
        }

        const itemTotal = itemDto.quantity * itemDto.unitPrice;
        totalAmount += itemTotal;

        const orderItem: OrderItem = {
          id: this.orderItemIdCounter++,
          orderId: this.orderIdCounter, // Will be set after order creation
          productId: itemDto.productId,
          quantity: itemDto.quantity,
          unitPrice: itemDto.unitPrice,
          totalPrice: itemTotal,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        createdOrderItems.push(orderItem);
      }

      // Create order
      const order: Order = {
        id: this.orderIdCounter++,
        orderNumber: `ORD-${Date.now()}`,
        customerId: dto.customerId,
        orderDate: new Date(),
        status: this.config?.defaultOrderStatus || 'Neu',
        totalAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Update order ID in order items
      createdOrderItems.forEach((item) => {
        item.orderId = order.id;
        this.orderItems.set(item.id, item);
      });

      this.orders.set(order.id, order);
      this.state.ordersCount++;

      this.log('info', 'Order created', { orderId: order.id, orderNumber: order.orderNumber });

      return {
        success: true,
        data: {
          ...order,
          items: createdOrderItems,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleOrdersUpdate(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { id, status, items } = params;

      if (!id) {
        throw new Error('Order ID is required');
      }

      const order = this.orders.get(id);

      if (!order) {
        throw new Error(`Order with ID ${id} not found`);
      }

      // Update status if provided
      if (status) {
        order.status = status;
      }

      // Update items if provided
      if (items && Array.isArray(items)) {
        // Delete existing items
        Array.from(this.orderItems.values())
          .filter((oi) => oi.orderId === id)
          .forEach((oi) => this.orderItems.delete(oi.id));

        // Create new items
        let totalAmount = 0;
        for (const itemDto of items) {
          const product = this.products.get(itemDto.productId);
          if (!product) {
            throw new Error(`Product with ID ${itemDto.productId} not found`);
          }

          const itemTotal = itemDto.quantity * itemDto.unitPrice;
          totalAmount += itemTotal;

          const orderItem: OrderItem = {
            id: this.orderItemIdCounter++,
            orderId: id,
            productId: itemDto.productId,
            quantity: itemDto.quantity,
            unitPrice: itemDto.unitPrice,
            totalPrice: itemTotal,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          this.orderItems.set(orderItem.id, orderItem);
        }

        order.totalAmount = totalAmount;
      }

      order.updatedAt = new Date();
      this.orders.set(id, order);

      this.log('info', 'Order updated', { orderId: id });

      // Fetch updated order with items
      const updatedOrderItems = Array.from(this.orderItems.values()).filter((oi) => oi.orderId === id);

      return {
        success: true,
        data: {
          ...order,
          items: updatedOrderItems,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleOrdersUpdateStatus(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { id, status } = params;

      if (!id) {
        throw new Error('Order ID is required');
      }

      if (!status) {
        throw new Error('Status is required');
      }

      const validStatuses = ['Neu', 'In Bearbeitung', 'Fertig'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const order = this.orders.get(id);

      if (!order) {
        throw new Error(`Order with ID ${id} not found`);
      }

      order.status = status;
      order.updatedAt = new Date();
      this.orders.set(id, order);

      this.log('info', 'Order status updated', { orderId: id, status });

      return {
        success: true,
        data: order,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleOrdersDelete(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { id } = params;

      if (!id) {
        throw new Error('Order ID is required');
      }

      const order = this.orders.get(id);

      if (!order) {
        throw new Error(`Order with ID ${id} not found`);
      }

      // Delete associated order items
      Array.from(this.orderItems.values())
        .filter((oi) => oi.orderId === id)
        .forEach((oi) => this.orderItems.delete(oi.id));

      this.orders.delete(id);
      this.state.ordersCount--;

      this.log('info', 'Order deleted', { orderId: id });

      return {
        success: true,
        data: { deleted: true },
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  // ============================================================================
  // PRINTING/PDF HANDLERS
  // ============================================================================

  private async handleGeneratePrintableOrder(params: ExecuteParams): Promise<ExecuteResult> {
    try {
      const { id } = params;

      if (!id) {
        throw new Error('Order ID is required');
      }

      const order = this.orders.get(id);

      if (!order) {
        throw new Error(`Order with ID ${id} not found`);
      }

      const customer = this.customers.get(order.customerId);
      if (!customer) {
        throw new Error(`Customer with ID ${order.customerId} not found`);
      }

      const items = Array.from(this.orderItems.values())
        .filter((oi) => oi.orderId === id)
        .map((oi) => {
          const product = this.products.get(oi.productId);
          return {
            articleNumber: product?.articleNumber || 'N/A',
            productName: product?.name || 'Unknown Product',
            quantity: oi.quantity,
            unitPrice: oi.unitPrice,
            totalPrice: oi.totalPrice,
          };
        });

      const printableOrder: PrintableOrder = {
        orderNumber: order.orderNumber,
        orderDate: order.orderDate.toLocaleDateString('de-DE'),
        customer: {
          name: customer.name,
          address: customer.address,
          contactPerson: customer.contactPerson,
          email: customer.email,
          phone: customer.phone,
        },
        items,
        totalAmount: order.totalAmount,
        status: order.status,
        companyInfo: {
          name: this.config?.companyName || 'Your Company',
          address: this.config?.companyAddress || '',
          phone: this.config?.companyPhone || '',
          email: this.config?.companyEmail || '',
        },
      };

      this.log('info', 'Printable order generated', { orderId: id, orderNumber: order.orderNumber });

      return {
        success: true,
        data: printableOrder,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  // ============================================================================
  // STATUS AND UTILITY HANDLERS
  // ============================================================================

  private async handleGetStatus(): Promise<ExecuteResult> {
    try {
      const uptime = Date.now() - this.state.startTime;

      return {
        success: true,
        data: {
          status: 'active',
          uptime,
          customersCount: this.state.customersCount,
          productsCount: this.state.productsCount,
          ordersCount: this.state.ordersCount,
          config: this.config,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private validateConfig(config: ProductionPlanningPluginConfig): void {
    if (!config) {
      throw new Error('Configuration is required');
    }

    const validStatuses = ['Neu', 'In Bearbeitung', 'Fertig'];
    if (!validStatuses.includes(config.defaultOrderStatus)) {
      throw new Error(`Invalid defaultOrderStatus. Must be one of: ${validStatuses.join(', ')}`);
    }
  }

  private log(level: 'info' | 'error' | 'warn', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${this.name}] ${message}`;

    if (data) {
      console.log(logMessage, JSON.stringify(data, null, 2));
    } else {
      console.log(logMessage);
    }
  }
}

// Export plugin instance
export const productionPlanningPlugin = new ProductionPlanningPlugin();

export default productionPlanningPlugin;
