# Production Planning Plugin for FlexiPlatform

A comprehensive production planning plugin for FlexiPlatform that provides complete customer, product, and order management functionality with integrated printing capabilities.

## Features

### 🧑‍💼 Customer Management
- Create, read, update, and delete customers
- Archive and unarchive customers for organizational purposes
- Store customer details including address, contact person, email, and phone
- Unique customer numbering system

### 📦 Product Database
- Maintain a comprehensive product catalog
- Store product details including name, description, article number, price, and category
- Easy product lookup and filtering by category
- Support for product updates and deletion

### 📋 Order Management
- Create orders by selecting customers and adding products
- Track order status (Neu, In Bearbeitung, Fertig)
- Manage order items with quantity and pricing information
- Automatic total amount calculation
- Update order status and items
- Delete orders when needed

### 🖨️ Printing & PDF Generation
- Generate printable order sheets with all relevant information
- Include customer details, order items, and company information
- Professional formatting for printing or PDF export
- Customizable company information in settings

## Installation

1. Copy the plugin directory to your FlexiPlatform plugins folder:
```bash
cp -r production-planning-plugin /path/to/FlexiPlatform/plugins/
```

2. Install dependencies:
```bash
cd /path/to/FlexiPlatform/plugins/production-planning-plugin
pnpm install
```

3. Build the plugin:
```bash
pnpm build
```

4. Restart FlexiPlatform to load the plugin.

## Configuration

The plugin can be configured through the FlexiPlatform settings interface. Available settings include:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `enableCustomerArchiving` | boolean | true | Enable customer archiving functionality |
| `defaultOrderStatus` | string | Neu | Default status for new orders |
| `currencySymbol` | string | € | Currency symbol for price display |
| `enablePdfGeneration` | boolean | true | Enable PDF generation for order sheets |
| `companyName` | string | Your Company Name | Company name for order sheet header |
| `companyAddress` | string | - | Company address for order sheet footer |
| `companyPhone` | string | - | Company phone number for order sheet footer |
| `companyEmail` | string | - | Company email for order sheet footer |

## API Reference

### Customer Management

#### List Customers
```
GET /api/trpc/productionPlanning.customers.list
Parameters:
  - includeArchived (boolean, optional): Include archived customers in results
```

#### Get Customer by ID
```
GET /api/trpc/productionPlanning.customers.getById
Parameters:
  - id (number, required): Customer ID
```

#### Create Customer
```
POST /api/trpc/productionPlanning.customers.create
Body:
  {
    "customerNumber": "CUST-001",
    "name": "John Doe",
    "address": "123 Main Street",
    "contactPerson": "John Doe",
    "email": "john@example.com",
    "phone": "+49 123 456789"
  }
```

#### Update Customer
```
PUT /api/trpc/productionPlanning.customers.update
Body:
  {
    "id": 1,
    "name": "Updated Name",
    "email": "newemail@example.com"
  }
```

#### Archive Customer
```
DELETE /api/trpc/productionPlanning.customers.archive
Parameters:
  - id (number, required): Customer ID
```

#### Unarchive Customer
```
DELETE /api/trpc/productionPlanning.customers.unarchive
Parameters:
  - id (number, required): Customer ID
```

### Product Management

#### List Products
```
GET /api/trpc/productionPlanning.products.list
Parameters:
  - category (string, optional): Filter by category
```

#### Get Product by ID
```
GET /api/trpc/productionPlanning.products.getById
Parameters:
  - id (number, required): Product ID
```

#### Create Product
```
POST /api/trpc/productionPlanning.products.create
Body:
  {
    "articleNumber": "ART-001",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "category": "Electronics"
  }
```

#### Update Product
```
PUT /api/trpc/productionPlanning.products.update
Body:
  {
    "id": 1,
    "name": "Updated Product Name",
    "price": 109.99
  }
```

#### Delete Product
```
DELETE /api/trpc/productionPlanning.products.delete
Parameters:
  - id (number, required): Product ID
```

### Order Management

#### List Orders
```
GET /api/trpc/productionPlanning.orders.list
Parameters:
  - customerId (number, optional): Filter by customer
  - status (string, optional): Filter by status (Neu, In Bearbeitung, Fertig)
```

#### Get Order by ID
```
GET /api/trpc/productionPlanning.orders.getById
Parameters:
  - id (number, required): Order ID
```

#### Create Order
```
POST /api/trpc/productionPlanning.orders.create
Body:
  {
    "customerId": 1,
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "unitPrice": 99.99
      }
    ]
  }
```

#### Update Order
```
PUT /api/trpc/productionPlanning.orders.update
Body:
  {
    "id": 1,
    "status": "In Bearbeitung",
    "items": [
      {
        "productId": 1,
        "quantity": 3,
        "unitPrice": 99.99
      }
    ]
  }
```

#### Update Order Status
```
PUT /api/trpc/productionPlanning.orders.updateStatus
Body:
  {
    "id": 1,
    "status": "Fertig"
  }
```

#### Delete Order
```
DELETE /api/trpc/productionPlanning.orders.delete
Parameters:
  - id (number, required): Order ID
```

### Printing & PDF

#### Generate Printable Order
```
GET /api/trpc/productionPlanning.orders.generatePrintableOrder
Parameters:
  - id (number, required): Order ID

Response:
  {
    "orderNumber": "ORD-1234567890",
    "orderDate": "20.02.2026",
    "customer": {
      "name": "John Doe",
      "address": "123 Main Street",
      "contactPerson": "John Doe",
      "email": "john@example.com",
      "phone": "+49 123 456789"
    },
    "items": [
      {
        "articleNumber": "ART-001",
        "productName": "Product Name",
        "quantity": 2,
        "unitPrice": 99.99,
        "totalPrice": 199.98
      }
    ],
    "totalAmount": 199.98,
    "status": "In Bearbeitung",
    "companyInfo": {
      "name": "Your Company Name",
      "address": "Company Address",
      "phone": "Company Phone",
      "email": "Company Email"
    }
  }
```

## Usage Examples

### Create a Customer
```typescript
const result = await pluginAPI.execute('customers.create', {
  customerNumber: 'CUST-001',
  name: 'Acme Corporation',
  address: '123 Business Ave',
  email: 'contact@acme.com',
  phone: '+49 123 456789'
});
```

### Create a Product
```typescript
const result = await pluginAPI.execute('products.create', {
  articleNumber: 'ART-001',
  name: 'Industrial Widget',
  description: 'High-quality industrial widget',
  price: 149.99,
  category: 'Industrial'
});
```

### Create an Order
```typescript
const result = await pluginAPI.execute('orders.create', {
  customerId: 1,
  items: [
    {
      productId: 1,
      quantity: 5,
      unitPrice: 149.99
    },
    {
      productId: 2,
      quantity: 3,
      unitPrice: 99.99
    }
  ]
});
```

### Generate Printable Order
```typescript
const result = await pluginAPI.execute('orders.generatePrintableOrder', {
  id: 1
});

// Use result.data to render PDF or print
```

## Data Model

### Customer
```typescript
{
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
```

### Product
```typescript
{
  id: number;
  articleNumber: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order
```typescript
{
  id: number;
  orderNumber: string;
  customerId: number;
  orderDate: Date;
  status: 'Neu' | 'In Bearbeitung' | 'Fertig';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer;
  items?: OrderItem[];
}
```

### OrderItem
```typescript
{
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
}
```

## Development

### Build
```bash
pnpm build
```

### Development Mode
```bash
pnpm dev
```

### Run Tests
```bash
pnpm test
```

### Run Tests in Watch Mode
```bash
pnpm test:watch
```

### Lint Code
```bash
pnpm lint
```

### Format Code
```bash
pnpm format
```

## Testing

The plugin includes comprehensive unit tests covering:
- Customer management (create, read, update, archive)
- Product management (create, read, update, delete)
- Order management (create, read, update, delete)
- Order printing functionality
- Error handling and validation

Run tests with:
```bash
pnpm test
```

## Permissions

This plugin requires the following permissions:
- `read:database` - Read access to database
- `write:database` - Write access to database
- `read:users` - Read user information
- `write:storage` - Write to storage

## Hooks

The plugin supports the following hooks:
- `onPluginInitialize` - Called when the plugin is initialized
- `onDataChange` - Called when data is modified

## License

MIT

## Author

Manus AI

## Support

For issues, feature requests, or contributions, please visit the [FlexiPlatform GitHub repository](https://github.com/seibchristian/FlexiPlatform).
