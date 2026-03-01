/**
 * Form Renderer Component
 * Renders forms based on configuration from the Form Designer
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Picker,
} from 'react-native';

export interface FormFieldConfig {
  id?: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date' | 'phone';
  position: number;
  width: number;
  height: number;
  isRequired: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: Array<{ value: string; label: string }>;
}

interface FormRendererProps {
  fields: FormFieldConfig[];
  onSubmit: (data: Record<string, any>) => void;
  submitButtonText?: string;
  isLoading?: boolean;
}

export const FormRenderer: React.FC<FormRendererProps> = ({
  fields,
  onSubmit,
  submitButtonText = 'Submit',
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(
    fields.reduce((acc, field) => {
      acc[field.fieldName] = field.defaultValue || '';
      return acc;
    }, {} as Record<string, any>)
  );

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const validateForm = (): boolean => {
    for (const field of fields) {
      if (field.isRequired && !formData[field.fieldName]) {
        Alert.alert('Validation Error', `${field.fieldLabel} is required`);
        return false;
      }

      // Email validation
      if (field.fieldType === 'email' && formData[field.fieldName]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.fieldName])) {
          Alert.alert('Validation Error', `${field.fieldLabel} must be a valid email`);
          return false;
        }
      }

      // Phone validation
      if (field.fieldType === 'phone' && formData[field.fieldName]) {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(formData[field.fieldName])) {
          Alert.alert('Validation Error', `${field.fieldLabel} must be a valid phone number`);
          return false;
        }
      }

      // Number validation
      if (field.fieldType === 'number' && formData[field.fieldName]) {
        if (isNaN(parseFloat(formData[field.fieldName]))) {
          Alert.alert('Validation Error', `${field.fieldLabel} must be a number`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormFieldConfig) => {
    const fieldValue = formData[field.fieldName];

    switch (field.fieldType) {
      case 'textarea':
        return (
          <TextInput
            key={field.id}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              padding: 12,
              minHeight: field.height,
              textAlignVertical: 'top',
              fontSize: 14,
            }}
            placeholder={field.placeholder}
            value={fieldValue}
            onChangeText={(text) => handleFieldChange(field.fieldName, text)}
            multiline={true}
            editable={!isLoading}
          />
        );

      case 'select':
        return (
          <View
            key={field.id}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              overflow: 'hidden',
              height: field.height,
            }}
          >
            <Picker
              selectedValue={fieldValue}
              onValueChange={(value) => handleFieldChange(field.fieldName, value)}
              enabled={!isLoading}
            >
              <Picker.Item label={field.placeholder || 'Select an option'} value="" />
              {field.options?.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        );

      case 'checkbox':
        return (
          <View
            key={field.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
            }}
          >
            <Switch
              value={fieldValue === 'true' || fieldValue === true}
              onValueChange={(value) =>
                handleFieldChange(field.fieldName, value ? 'true' : 'false')
              }
              disabled={isLoading}
            />
            <Text style={{ marginLeft: 12, fontSize: 14 }}>{field.fieldLabel}</Text>
          </View>
        );

      case 'date':
        return (
          <TextInput
            key={field.id}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              padding: 12,
              height: field.height,
              fontSize: 14,
            }}
            placeholder={field.placeholder || 'YYYY-MM-DD'}
            value={fieldValue}
            onChangeText={(text) => handleFieldChange(field.fieldName, text)}
            editable={!isLoading}
          />
        );

      case 'number':
        return (
          <TextInput
            key={field.id}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              padding: 12,
              height: field.height,
              fontSize: 14,
            }}
            placeholder={field.placeholder}
            value={fieldValue}
            onChangeText={(text) => handleFieldChange(field.fieldName, text)}
            keyboardType="decimal-pad"
            editable={!isLoading}
          />
        );

      case 'email':
        return (
          <TextInput
            key={field.id}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              padding: 12,
              height: field.height,
              fontSize: 14,
            }}
            placeholder={field.placeholder}
            value={fieldValue}
            onChangeText={(text) => handleFieldChange(field.fieldName, text)}
            keyboardType="email-address"
            editable={!isLoading}
          />
        );

      case 'phone':
        return (
          <TextInput
            key={field.id}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              padding: 12,
              height: field.height,
              fontSize: 14,
            }}
            placeholder={field.placeholder}
            value={fieldValue}
            onChangeText={(text) => handleFieldChange(field.fieldName, text)}
            keyboardType="phone-pad"
            editable={!isLoading}
          />
        );

      case 'text':
      default:
        return (
          <TextInput
            key={field.id}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              padding: 12,
              height: field.height,
              fontSize: 14,
            }}
            placeholder={field.placeholder}
            value={fieldValue}
            onChangeText={(text) => handleFieldChange(field.fieldName, text)}
            editable={!isLoading}
          />
        );
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <View style={{ gap: 16 }}>
        {fields
          .sort((a, b) => a.position - b.position)
          .map((field) => (
            <View key={field.id} style={{ gap: 6 }}>
              {field.fieldType !== 'checkbox' && (
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {field.fieldLabel}
                  {field.isRequired && <Text style={{ color: '#F44336' }}>*</Text>}
                </Text>
              )}
              {renderField(field)}
            </View>
          ))}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#ccc' : '#4CAF50',
            padding: 16,
            borderRadius: 4,
            marginTop: 8,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
            }}
          >
            {isLoading ? 'Submitting...' : submitButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FormRenderer;
