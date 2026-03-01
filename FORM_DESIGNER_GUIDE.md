# Form Designer - Implementation Guide

## Overview

The Form Designer is a core feature of FlexiPlatform that enables users to create, configure, and manage forms visually for all entities (Customers, Products, Orders, etc.) without writing code.

## Features

### 1. Visual Form Builder
- **Drag-and-Drop Interface**: Easily arrange form fields
- **Resizable Fields**: Adjust field width and height
- **Field Configuration**: Set field properties like type, label, placeholder, and validation
- **Required Fields**: Mark fields as mandatory
- **Field Reordering**: Move fields up/down to change order

### 2. Supported Field Types
- **Text**: Single-line text input
- **Email**: Email input with validation
- **Number**: Numeric input
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Checkbox**: Boolean toggle
- **Date**: Date picker
- **Phone**: Phone number input with validation

### 3. Form Management
- **Create Forms**: Define new forms for different entity types
- **Edit Forms**: Modify existing form configurations
- **Delete Forms**: Remove forms when no longer needed
- **Activate/Deactivate**: Enable or disable forms
- **Version History**: Track changes to form definitions

## Database Schema

### form_definitions
Stores the main form configuration for each entity type.

```sql
CREATE TABLE form_definitions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entityType VARCHAR(100) NOT NULL UNIQUE,
  displayName VARCHAR(255) NOT NULL,
  description TEXT,
  fields JSON NOT NULL DEFAULT '[]',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### form_fields
Individual field configurations within a form.

```sql
CREATE TABLE form_fields (
  id INT AUTO_INCREMENT PRIMARY KEY,
  formDefinitionId INT NOT NULL,
  fieldName VARCHAR(255) NOT NULL,
  fieldLabel VARCHAR(255) NOT NULL,
  fieldType VARCHAR(50) NOT NULL,
  position INT NOT NULL,
  width INT DEFAULT 100,
  height INT DEFAULT 40,
  isRequired BOOLEAN DEFAULT FALSE,
  placeholder VARCHAR(255),
  defaultValue VARCHAR(255),
  options JSON,
  validation JSON,
  metadata JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (formDefinitionId) REFERENCES form_definitions(id) ON DELETE CASCADE
);
```

### form_design_history
Tracks all changes made to form configurations for audit purposes.

```sql
CREATE TABLE form_design_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  formDefinitionId INT NOT NULL,
  userId INT,
  action VARCHAR(50) NOT NULL,
  previousConfig JSON,
  newConfig JSON,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (formDefinitionId) REFERENCES form_definitions(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);
```

## Backend API (tRPC)

### Form Definition Endpoints

#### List all form definitions
```typescript
trpc.formDesigner.listDefinitions.useQuery()
```

#### Get form definition by entity type
```typescript
trpc.formDesigner.getDefinition.useQuery({ entityType: 'customers' })
```

#### Create new form definition
```typescript
trpc.formDesigner.createDefinition.useMutation({
  entityType: 'customers',
  displayName: 'Customer Form',
  description: 'Form for managing customers',
  fields: []
})
```

#### Update form definition
```typescript
trpc.formDesigner.updateDefinition.useMutation({
  id: 1,
  displayName: 'Updated Customer Form',
  fields: [...],
  isActive: true
})
```

#### Delete form definition
```typescript
trpc.formDesigner.deleteDefinition.useMutation({
  id: 1
})
```

### Form Field Endpoints

#### Get form fields
```typescript
trpc.formDesigner.getFields.useQuery({ formDefinitionId: 1 })
```

#### Create form field
```typescript
trpc.formDesigner.createField.useMutation({
  formDefinitionId: 1,
  fieldName: 'firstName',
  fieldLabel: 'First Name',
  fieldType: 'text',
  position: 0,
  width: 100,
  height: 40,
  isRequired: true,
  placeholder: 'Enter first name'
})
```

#### Update form field
```typescript
trpc.formDesigner.updateField.useMutation({
  id: 1,
  fieldLabel: 'Updated Label',
  isRequired: false
})
```

#### Delete form field
```typescript
trpc.formDesigner.deleteField.useMutation({
  id: 1
})
```

## Frontend Components

### FormBuilder Component
Main component for designing forms with drag-and-drop interface.

```typescript
import { FormBuilder } from '@/components/form-builder';

<FormBuilder
  fields={fields}
  onFieldsChange={setFields}
  onSave={handleSave}
  onCancel={handleCancel}
/>
```

### FormRenderer Component
Renders forms based on configuration for data entry.

```typescript
import { FormRenderer } from '@/components/form-builder';

<FormRenderer
  fields={formDefinition.fields}
  onSubmit={handleFormSubmit}
  submitButtonText="Save"
  isLoading={isSubmitting}
/>
```

## Usage Example

### 1. Create a Form Definition
```typescript
const createForm = trpc.formDesigner.createDefinition.useMutation();

createForm.mutate({
  entityType: 'customers',
  displayName: 'Customer Information',
  description: 'Form for collecting customer data',
  fields: [
    {
      fieldName: 'firstName',
      fieldLabel: 'First Name',
      fieldType: 'text',
      position: 0,
      width: 100,
      height: 40,
      isRequired: true,
      placeholder: 'Enter first name'
    },
    {
      fieldName: 'email',
      fieldLabel: 'Email Address',
      fieldType: 'email',
      position: 1,
      width: 100,
      height: 40,
      isRequired: true,
      placeholder: 'Enter email'
    }
  ]
});
```

### 2. Use Form in a Screen
```typescript
import { FormRenderer } from '@/components/form-builder';

export const CustomerFormScreen = () => {
  const formDef = trpc.formDesigner.getDefinition.useQuery({ 
    entityType: 'customers' 
  });

  const handleSubmit = (data) => {
    // Handle form submission
    console.log('Form data:', data);
  };

  if (!formDef.data) return <ActivityIndicator />;

  return (
    <FormRenderer
      fields={formDef.data.fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Customer"
    />
  );
};
```

### 3. Design Form with FormBuilder
```typescript
import { FormBuilder } from '@/components/form-builder';

export const FormDesignScreen = () => {
  const [fields, setFields] = useState([]);

  const updateForm = trpc.formDesigner.updateDefinition.useMutation();

  const handleSave = () => {
    updateForm.mutate({
      id: formId,
      fields: fields
    });
  };

  return (
    <FormBuilder
      fields={fields}
      onFieldsChange={setFields}
      onSave={handleSave}
      onCancel={() => {}}
    />
  );
};
```

## Integration with Existing Screens

The Form Designer can be integrated into existing screens by:

1. **Adding a Design Button**: Add a "Design" button to form screens that opens the FormBuilder
2. **Loading Form Configuration**: Fetch form definition from the database instead of using hardcoded fields
3. **Using FormRenderer**: Replace manual form rendering with the FormRenderer component

### Example Integration

```typescript
// Before: Hardcoded form
const CustomerFormScreen = () => {
  return (
    <ScrollView>
      <TextInput placeholder="First Name" />
      <TextInput placeholder="Last Name" />
      <TextInput placeholder="Email" />
    </ScrollView>
  );
};

// After: Using Form Designer
const CustomerFormScreen = () => {
  const [designMode, setDesignMode] = useState(false);
  const formDef = trpc.formDesigner.getDefinition.useQuery({ 
    entityType: 'customers' 
  });

  if (designMode) {
    return (
      <FormBuilder
        fields={formDef.data?.fields || []}
        onFieldsChange={setFields}
        onSave={handleSave}
        onCancel={() => setDesignMode(false)}
      />
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setDesignMode(true)}>
        <Text>Design Form</Text>
      </TouchableOpacity>
      <FormRenderer
        fields={formDef.data?.fields || []}
        onSubmit={handleSubmit}
      />
    </View>
  );
};
```

## Best Practices

1. **Field Naming**: Use camelCase for field names (e.g., `firstName`, `emailAddress`)
2. **Labels**: Use clear, user-friendly labels for fields
3. **Validation**: Set appropriate validation rules for each field type
4. **Required Fields**: Mark only essential fields as required
5. **Field Order**: Arrange fields in a logical order for better UX
6. **Width Management**: Use consistent widths for related fields
7. **Placeholder Text**: Provide helpful placeholder text for guidance

## Future Enhancements

- Conditional field visibility based on other field values
- Custom validation rules
- Field dependencies and relationships
- Multi-step forms and wizards
- Form templates and presets
- Export/import form definitions
- Form analytics and usage tracking
- Internationalization (i18n) support
- Custom CSS styling per form
- Form versioning and rollback

## Troubleshooting

### Form not loading
- Check that the entity type matches exactly
- Verify the form definition exists in the database
- Check for any validation errors in the console

### Fields not appearing
- Ensure fields have valid positions
- Check that fieldType is supported
- Verify field configuration is complete

### Validation not working
- Ensure isRequired is set correctly
- Check field type matches the validation rule
- Verify validation regex patterns are correct

## Support

For issues or questions about the Form Designer, please refer to the main README.md or contact the development team.
