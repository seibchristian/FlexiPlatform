# Form Designer Integration Guide

This guide explains how to integrate the Form Designer into existing form screens in the FlexiPlatform.

## Quick Start

### Step 1: Import Components

```typescript
import { FormBuilder, FormRenderer } from '@/components/form-builder';
import { trpc } from '@/lib/trpc';
```

### Step 2: Add Design Mode State

```typescript
const [designMode, setDesignMode] = useState(false);
const [fields, setFields] = useState<FormField[]>([]);

// Fetch form definition
const formDef = trpc.formDesigner.getDefinition.useQuery({ 
  entityType: 'customers' 
});

useEffect(() => {
  if (formDef.data?.fields) {
    setFields(formDef.data.fields);
  }
}, [formDef.data]);
```

### Step 3: Add Design Button

```typescript
<TouchableOpacity
  onPress={() => setDesignMode(true)}
  style={{ padding: 8, backgroundColor: '#FF9800', borderRadius: 4 }}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>🎨 Design Form</Text>
</TouchableOpacity>
```

### Step 4: Render Appropriate Component

```typescript
if (designMode) {
  return (
    <FormBuilder
      fields={fields}
      onFieldsChange={setFields}
      onSave={handleSaveFormDesign}
      onCancel={() => setDesignMode(false)}
    />
  );
}

return (
  <FormRenderer
    fields={fields}
    onSubmit={handleFormSubmit}
    submitButtonText="Save Customer"
  />
);
```

## Complete Example: Customer Form Integration

### Before (Hardcoded Form)

```typescript
export const CustomerFormScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 12 }}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 12 }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 12 }}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity style={{ backgroundColor: '#4CAF50', padding: 12 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
```

### After (Using Form Designer)

```typescript
import { FormBuilder, FormRenderer, FormFieldConfig } from '@/components/form-builder';
import { trpc } from '@/lib/trpc';

export const CustomerFormScreen: React.FC = () => {
  const [designMode, setDesignMode] = useState(false);
  const [fields, setFields] = useState<FormFieldConfig[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch form definition from database
  const formDef = trpc.formDesigner.getDefinition.useQuery({
    entityType: 'customers',
  });

  // Update form definition
  const updateForm = trpc.formDesigner.updateDefinition.useMutation({
    onSuccess: () => {
      Alert.alert('Success', 'Form design saved');
      setDesignMode(false);
      formDef.refetch();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to save form design');
    },
  });

  // Load fields from form definition
  useEffect(() => {
    if (formDef.data?.fields) {
      setFields(formDef.data.fields);
    }
  }, [formDef.data]);

  const handleSaveFormDesign = () => {
    if (!formDef.data) return;
    updateForm.mutate({
      id: formDef.data.id,
      fields: fields,
    });
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    setIsSubmitting(true);
    try {
      // Handle form submission
      console.log('Customer data:', data);
      Alert.alert('Success', 'Customer saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show form designer
  if (designMode) {
    return (
      <FormBuilder
        fields={fields}
        onFieldsChange={setFields}
        onSave={handleSaveFormDesign}
        onCancel={() => setDesignMode(false)}
      />
    );
  }

  // Show form renderer
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Design Button */}
      <View style={{ padding: 12, backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
        <TouchableOpacity
          onPress={() => setDesignMode(true)}
          style={{
            padding: 12,
            backgroundColor: '#FF9800',
            borderRadius: 4,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
            🎨 Design Form
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      {formDef.isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <FormRenderer
          fields={fields}
          onSubmit={handleFormSubmit}
          submitButtonText="Create Customer"
          isLoading={isSubmitting}
        />
      )}
    </View>
  );
};
```

## Integration for Multiple Entity Types

### Products Form

```typescript
export const ProductFormScreen: React.FC = () => {
  // ... same pattern as above, but with entityType: 'products'
  const formDef = trpc.formDesigner.getDefinition.useQuery({
    entityType: 'products',
  });
  // ...
};
```

### Orders Form

```typescript
export const OrderFormScreen: React.FC = () => {
  // ... same pattern as above, but with entityType: 'orders'
  const formDef = trpc.formDesigner.getDefinition.useQuery({
    entityType: 'orders',
  });
  // ...
};
```

## Handling Form Validation

The FormRenderer automatically validates fields based on their configuration:

```typescript
// Email validation
{
  fieldType: 'email',
  isRequired: true,
  // Automatically validates email format
}

// Phone validation
{
  fieldType: 'phone',
  isRequired: true,
  // Automatically validates phone format
}

// Number validation
{
  fieldType: 'number',
  isRequired: true,
  // Automatically validates numeric input
}

// Custom validation can be added via metadata
{
  fieldType: 'text',
  fieldName: 'zipCode',
  validation: {
    pattern: '^[0-9]{5}$',
    message: 'Zip code must be 5 digits'
  }
}
```

## Customization Options

### Custom Field Types

To add custom field types, extend the FormFieldConfig interface:

```typescript
export type CustomFieldType = 
  | FormFieldConfig['fieldType']
  | 'currency'
  | 'percentage'
  | 'rating'
  | 'color';
```

Then update the FormRenderer to handle new types:

```typescript
const renderField = (field: FormFieldConfig) => {
  switch (field.fieldType) {
    case 'currency':
      // Custom currency input
      return <CurrencyInput {...field} />;
    case 'rating':
      // Custom rating component
      return <RatingInput {...field} />;
    // ...
  }
};
```

### Styling

Customize the appearance by modifying component styles:

```typescript
<FormRenderer
  fields={fields}
  onSubmit={handleSubmit}
  // Add custom styling through component props
  containerStyle={{ padding: 20 }}
  fieldStyle={{ marginBottom: 16 }}
  buttonStyle={{ backgroundColor: '#custom-color' }}
/>
```

### Pre-populated Values

Load existing data into the form:

```typescript
const [existingCustomer, setExistingCustomer] = useState(null);

useEffect(() => {
  // Fetch existing customer data
  const customer = await fetchCustomer(customerId);
  setExistingCustomer(customer);
}, [customerId]);

// Update FormRenderer to use existing data
<FormRenderer
  fields={fields.map(field => ({
    ...field,
    defaultValue: existingCustomer?.[field.fieldName] || field.defaultValue
  }))}
  onSubmit={handleSubmit}
/>
```

## Best Practices

1. **Lazy Load Form Definitions**: Use React Query to cache form definitions
2. **Error Handling**: Always handle API errors gracefully
3. **Loading States**: Show loading indicators while fetching form definitions
4. **Validation**: Validate on both client and server side
5. **Accessibility**: Ensure form fields are accessible
6. **Mobile Responsive**: Test forms on different screen sizes
7. **Performance**: Memoize components to prevent unnecessary re-renders

## Troubleshooting

### Form not loading
- Check that entityType matches exactly
- Verify form definition exists in database
- Check browser console for errors

### Fields not appearing
- Ensure fields array is not empty
- Check field positions are sequential
- Verify field types are supported

### Validation not working
- Check isRequired flag is set correctly
- Verify field type matches validation
- Check validation regex patterns

## Migration Path

To migrate existing forms to use the Form Designer:

1. **Create Form Definition**: Create a form definition for the entity type
2. **Map Fields**: Map existing fields to the new form configuration
3. **Test**: Test the new form thoroughly
4. **Deploy**: Deploy the changes
5. **Monitor**: Monitor for any issues
6. **Remove Old Code**: Remove hardcoded form code once stable

## Support

For questions or issues, refer to FORM_DESIGNER_GUIDE.md or contact the development team.
