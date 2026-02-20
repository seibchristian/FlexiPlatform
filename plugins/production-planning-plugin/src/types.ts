/**
 * Type definitions for Production Planning Plugin
 */

// Plugin Configuration
export interface ProductionPlanningPluginConfig {
  enabled: boolean;
  enableCustomerArchiving: boolean;
  defaultOrderStatus: 'Neu' | 'In Bearbeitung' | 'Fertig';
  currencySymbol: string;
  enablePdfGeneration: boolean;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
}

// Plugin State
export interface PluginState {
  isReady: boolean;
  startTime: number;
  customersCount: number;
  productsCount: number;
  ordersCount: number;
  isProcessing: boolean;
}

// Customer Entity
export interface Customer {
  id: number;
  customerNumber: string;
  name: string;
  address?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Product Entity
export interface Product {
  id: number;
  articleNumber: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order Item (OrderItems table)
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  product?: Product; // Optional: populated when fetching order details
}

// Order Entity
export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  orderDate: Date;
  status: 'Neu' | 'In Bearbeitung' | 'Fertig';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer; // Optional: populated when fetching order details
  items?: OrderItem[]; // Optional: populated when fetching order details
}

// Create/Update DTOs
export interface CreateCustomerDTO {
  customerNumber: string;
  name: string;
  address?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
}

export interface UpdateCustomerDTO {
  name?: string;
  address?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
}

export interface CreateProductDTO {
  articleNumber: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
}

export interface CreateOrderItemDTO {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderDTO {
  customerId: number;
  items: CreateOrderItemDTO[];
}

export interface UpdateOrderDTO {
  status?: 'Neu' | 'In Bearbeitung' | 'Fertig';
  items?: CreateOrderItemDTO[];
}

// Execute Parameters and Results
export interface ExecuteParams {
  [key: string]: any;
}

export interface ExecuteResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: number;
}

// Analytics/Reporting
export interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: {
    'Neu': number;
    'In Bearbeitung': number;
    'Fertig': number;
  };
  topCustomers: Array<{
    customerId: number;
    customerName: string;
    orderCount: number;
    totalSpent: number;
  }>;
  topProducts: Array<{
    productId: number;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
}

// PDF/Print related
export interface PrintableOrder {
  orderNumber: string;
  orderDate: string;
  customer: {
    name: string;
    address?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
  };
  items: Array<{
    articleNumber: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  status: string;
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}
