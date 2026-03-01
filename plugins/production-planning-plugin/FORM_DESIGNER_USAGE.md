# Using Form Designer in Production Planning Plugin

This document explains how to integrate the Form Designer into the Production Planning Plugin for managing Customer, Product, and Order forms.

## Overview

The Production Planning Plugin manages three main entities:
- **Customers**: Customer information and contact details
- **Products**: Product catalog with pricing and descriptions
- **Orders**: Order management with items and status tracking

Each of these can now use the Form Designer to customize their forms without code changes.

## Integration Steps

### 1. Customer Form Integration

**File**: `src/screens/customers.tsx`

```typescript
import { FormBuilder, FormRenderer } from '@/components/form-builder';
import { trpc } from '@/lib/trpc';

export const CustomersScreen: React.FC = () => {
  const [designMode, setDesignMode] = useState(false);
  const [fields, setFields] = useState<any[]>([]);

  // Fetch customer form definition
  const formDef = trpc.formDesigner.getDefinition.useQuery({
    entityType: 'customers',
  });

  const updateForm = trpc.formDesigner.updateDefinition.useMutation();

  useEffect(() => {
    if (formDef.data?.fields) {
      setFields(formDef.data.fields);
    }
  }, [formDef.data]);

  if (designMode) {
    return (
      <FormBuilder
        fields={fields}
        onFieldsChange={setFields}
        onSave={() => {
          updateForm.mutate({
            id: formDef.data!.id,
            fields: fields,
          });
          setDesignMode(false);
        }}
        onCancel={() => setDesignMode(false)}
      />
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setDesignMode(true)}>
        <Text>Design Customer Form</Text>
      </TouchableOpacity>
      <FormRenderer
        fields={fields}
        onSubmit={handleCreateCustomer}
      />
    </View>
  );
};
```

### 2. Product Form Integration

**File**: `src/screens/products.tsx`

```typescript
export const ProductsScreen: React.FC = () => {
  const [designMode, setDesignMode] = useState(false);
  const [fields, setFields] = useState<any[]>([]);

  // Fetch product form definition
  const formDef = trpc.formDesigner.getDefinition.useQuery({
    entityType: 'products',
  });

  // ... similar implementation as customers
};
```

### 3. Order Form Integration

**File**: `src/screens/order-form.tsx`

```typescript
export const OrderFormScreen: React.FC = () => {
  const [designMode, setDesignMode] = useState(false);
  const [fields, setFields] = useState<any[]>([]);

  // Fetch order form definition
  const formDef = trpc.formDesigner.getDefinition.useQuery({
    entityType: 'orders',
  });

  // ... similar implementation as customers
};
```

## Default Form Configurations

### Customer Form

```typescript
{
  entityType: 'customers',
  displayName: 'Customer Information',
  description: 'Form for managing customer data',
  fields: [
    {
      fieldName: 'customerNumber',
      fieldLabel: 'Customer Number',
      fieldType: 'text',
      position: 0,
      width: 100,
      height: 40,
      isRequired: true,
      placeholder: 'e.g., CUST-001'
    },
    {
      fieldName: 'name',
      fieldLabel: 'Customer Name',
      fieldType: 'text',
      position: 1,
      width: 100,
      height: 40,
      isRequired: true,
      placeholder: 'Enter customer name'
    },
    {
      fieldName: 'email',
      fieldLabel: 'Email Address',
      fieldType: 'email',
      position: 2,
      width: 100,
      height: 40,
      isRequired: false,
      placeholder: 'Enter email address'
    },
    {
      fieldName: 'phone',
      fieldLabel: 'Phone Number',
      fieldType: 'phone',
      position: 3,
      width: 100,
      height: 40,
      isRequired: false,
      placeholder: 'Enter phone number'
    },
    {
      fieldName: 'address',
      fieldLabel: 'Address',
      fieldType: 'textarea',
      position: 4,
      width: 100,
      height: 80,
      isRequired: false,
      placeholder: 'Enter full address'
    },
    {
      fieldName: 'contactPerson',
      fieldLabel: 'Contact Person',
      fieldType: 'text',
      position: 5,
      width: 100,
      height: 40,
      isRequired: false,
      placeholder: 'Enter contact person name'
    }
  ]
}
```

### Product Form

```typescript
{
  entityType: 'products',
  displayName: 'Product Information',
  description: 'Form for managing product data',
  fields: [
    {
      fieldName: 'articleNumber',
      fieldLabel: 'Article Number',
      fieldType: 'text',
      position: 0,
      width: 100,
      height: 40,
      isRequired: true,
      placeholder: 'e.g., ART-001'
    },
    {
      fieldName: 'name',
      fieldLabel: 'Product Name',
      fieldType: 'text',
      position: 1,
      width: 100,
      height: 40,
      isRequired: true,
      placeholder: 'Enter product name'
    },
    {
      fieldName: 'description',
      fieldLabel: 'Description',
      fieldType: 'textarea',
      position: 2,
      width: 100,
      height: 100,
      isRequired: false,
      placeholder: 'Enter product description'
    },
    {
      fieldName: 'price',
      fieldLabel: 'Price (€)',
      fieldType: 'number',
      position: 3,
      width: 100,
      height: 40,
      isRequired: true,
      placeholder: 'Enter price'
    },
    {
      fieldName: 'category',
      fieldLabel: 'Category',
      fieldType: 'select',
      position: 4,
      width: 100,
      height: 40,
      isRequired: false,
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'food', label: 'Food' },
        { value: 'other', label: 'Other' }
      ]
    }
  ]
}
```

### Order Form

```typescript
{
  entityType: 'orders',
  displayName: 'Order Information',
  description: 'Form for managing order data',
  fields: [
    {
      fieldName: 'orderNumber',
      fieldLabel: 'Order Number',
      fieldType: 'text',
      position: 0,
      width: 100,
      height: 40,
      isRequired: true,
      placeholder: 'Auto-generated'
    },
    {
      fieldName: 'orderDate',
      fieldLabel: 'Order Date',
      fieldType: 'date',
      position: 1,
      width: 100,
      height: 40,
      isRequired: true,
      placeholder: 'Select date'
    },
    {
      fieldName: 'customerId',
      fieldLabel: 'Customer',
      fieldType: 'select',
      position: 2,
      width: 100,
      height: 40,
      isRequired: true,
      placeholder: 'Select customer'
    },
    {
      fieldName: 'status',
      fieldLabel: 'Status',
      fieldType: 'select',
      position: 3,
      width: 100,
      height: 40,
      isRequired: true,
      options: [
        { value: 'Neu', label: 'New' },
        { value: 'In Bearbeitung', label: 'In Progress' },
        { value: 'Fertig', label: 'Completed' }
      ]
    },
    {
      fieldName: 'notes',
      fieldLabel: 'Notes',
      fieldType: 'textarea',
      position: 4,
      width: 100,
      height: 80,
      isRequired: false,
      placeholder: 'Enter order notes'
    }
  ]
}
```

## Initialization Script

Create a script to initialize default form definitions:

```typescript
// scripts/init-form-definitions.ts
import * as db from '../server/db';

async function initializeFormDefinitions() {
  const definitions = [
    {
      entityType: 'customers',
      displayName: 'Customer Information',
      // ... customer fields
    },
    {
      entityType: 'products',
      displayName: 'Product Information',
      // ... product fields
    },
    {
      entityType: 'orders',
      displayName: 'Order Information',
      // ... order fields
    },
  ];

  for (const def of definitions) {
    const existing = await db.getFormDefinitionByEntityType(def.entityType);
    if (!existing) {
      await db.createFormDefinition(def);
      console.log(`Created form definition for ${def.entityType}`);
    }
  }
}

initializeFormDefinitions().catch(console.error);
```

## Benefits for Production Planning Plugin

1. **Customizable Forms**: Users can customize customer, product, and order forms without code changes
2. **Consistency**: All forms use the same design system and validation
3. **Audit Trail**: Track all form design changes with design history
4. **Flexibility**: Easy to add or remove fields based on business needs
5. **Reusability**: Form definitions can be shared across different parts of the application

## Usage Workflow

1. **Admin creates form definition** via Form Designer screen
2. **Sets up fields** for customers, products, or orders
3. **Saves the form** to the database
4. **Users access forms** through the respective screens
5. **Forms render** based on the saved configuration
6. **Admin can modify** forms anytime without redeploying

## Future Enhancements

- Form templates for quick setup
- Import/export form definitions
- Form versioning and rollback
- Multi-language support
- Advanced validation rules
- Conditional field visibility
- Custom field types
- Form analytics

## Support

For questions about integrating Form Designer with the Production Planning Plugin, refer to:
- `FORM_DESIGNER_GUIDE.md` - Complete Form Designer documentation
- `FORM_DESIGNER_INTEGRATION.md` - Integration guide for other screens
