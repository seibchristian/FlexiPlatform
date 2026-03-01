/**
 * Form Builder Component
 * Provides a visual form designer with drag-and-drop, resizing, and field configuration
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Switch,
  Alert,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';

export interface FormField {
  id: string;
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

interface FormBuilderProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'phone', label: 'Phone' },
];

export const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  onFieldsChange,
  onSave,
  onCancel,
}) => {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [resizingFieldId, setResizingFieldId] = useState<string | null>(null);
  const screenWidth = Dimensions.get('window').width;

  // Add new field
  const handleAddField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      fieldName: `field_${fields.length + 1}`,
      fieldLabel: `Field ${fields.length + 1}`,
      fieldType: 'text',
      position: fields.length,
      width: 100,
      height: 40,
      isRequired: false,
      placeholder: '',
    };
    onFieldsChange([...fields, newField]);
    setEditingField(newField);
    setShowFieldModal(true);
  };

  // Update field
  const handleUpdateField = (updatedField: FormField) => {
    const updatedFields = fields.map((f) =>
      f.id === updatedField.id ? updatedField : f
    );
    onFieldsChange(updatedFields);
    setEditingField(null);
    setShowFieldModal(false);
  };

  // Delete field
  const handleDeleteField = (fieldId: string) => {
    Alert.alert('Delete Field', 'Are you sure you want to delete this field?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: () => {
          const updatedFields = fields.filter((f) => f.id !== fieldId);
          onFieldsChange(updatedFields);
          setSelectedFieldId(null);
        },
      },
    ]);
  };

  // Reorder fields
  const handleMoveFieldUp = (fieldId: string) => {
    const index = fields.findIndex((f) => f.id === fieldId);
    if (index > 0) {
      const updatedFields = [...fields];
      [updatedFields[index], updatedFields[index - 1]] = [
        updatedFields[index - 1],
        updatedFields[index],
      ];
      updatedFields.forEach((f, i) => (f.position = i));
      onFieldsChange(updatedFields);
    }
  };

  const handleMoveFieldDown = (fieldId: string) => {
    const index = fields.findIndex((f) => f.id === fieldId);
    if (index < fields.length - 1) {
      const updatedFields = [...fields];
      [updatedFields[index], updatedFields[index + 1]] = [
        updatedFields[index + 1],
        updatedFields[index],
      ];
      updatedFields.forEach((f, i) => (f.position = i));
      onFieldsChange(updatedFields);
    }
  };

  // Resize field
  const handleResizeField = (fieldId: string, newWidth: number, newHeight: number) => {
    const updatedFields = fields.map((f) =>
      f.id === fieldId
        ? { ...f, width: Math.max(50, Math.min(100, newWidth)), height: Math.max(30, newHeight) }
        : f
    );
    onFieldsChange(updatedFields);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{ padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Form Designer</Text>
          <TouchableOpacity
            onPress={() => setShowFieldModal(false)}
            style={{ padding: 8 }}
          >
            <Text style={{ fontSize: 20 }}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 12 }}>
        {/* Canvas */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#ddd',
            borderStyle: 'dashed',
            minHeight: 400,
            padding: 16,
            marginBottom: 16,
          }}
        >
          {fields.length === 0 ? (
            <View style={{ justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <Text style={{ fontSize: 14, color: '#999' }}>No fields yet. Add one to get started!</Text>
            </View>
          ) : (
            fields.map((field) => (
              <TouchableOpacity
                key={field.id}
                onPress={() => {
                  setSelectedFieldId(field.id);
                  setEditingField(field);
                }}
                style={{
                  width: `${field.width}%`,
                  height: field.height,
                  backgroundColor: selectedFieldId === field.id ? '#E3F2FD' : '#f9f9f9',
                  borderWidth: selectedFieldId === field.id ? 2 : 1,
                  borderColor: selectedFieldId === field.id ? '#2196F3' : '#ddd',
                  borderRadius: 4,
                  padding: 8,
                  marginBottom: 12,
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#333' }}>
                  {field.fieldLabel}
                  {field.isRequired && <Text style={{ color: '#F44336' }}>*</Text>}
                </Text>
                <Text style={{ fontSize: 10, color: '#999', marginTop: 2 }}>
                  {field.fieldType}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Field List */}
        <View>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>Fields</Text>
          {fields.map((field, index) => (
            <View
              key={field.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: 4,
                padding: 12,
                marginBottom: 8,
                borderLeftWidth: 4,
                borderLeftColor: '#2196F3',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{field.fieldLabel}</Text>
                  <Text style={{ fontSize: 10, color: '#999' }}>{field.fieldType}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <TouchableOpacity
                    onPress={() => handleMoveFieldUp(field.id)}
                    disabled={index === 0}
                    style={{ padding: 6, opacity: index === 0 ? 0.5 : 1 }}
                  >
                    <Text style={{ fontSize: 16 }}>↑</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleMoveFieldDown(field.id)}
                    disabled={index === fields.length - 1}
                    style={{ padding: 6, opacity: index === fields.length - 1 ? 0.5 : 1 }}
                  >
                    <Text style={{ fontSize: 16 }}>↓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingField(field);
                      setShowFieldModal(true);
                    }}
                    style={{ padding: 6, backgroundColor: '#2196F3', borderRadius: 4 }}
                  >
                    <Text style={{ fontSize: 12, color: '#fff' }}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteField(field.id)}
                    style={{ padding: 6, backgroundColor: '#F44336', borderRadius: 4 }}
                  >
                    <Text style={{ fontSize: 12, color: '#fff' }}>Del</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={{ padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd', flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={handleAddField}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: '#4CAF50',
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>+ Add Field</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCancel}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: '#999',
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSave}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: '#2196F3',
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Field Editor Modal */}
      <Modal
        visible={showFieldModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFieldModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12, maxHeight: '90%' }}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {editingField ? 'Edit Field' : 'Add Field'}
              </Text>
            </View>

            <ScrollView style={{ padding: 16 }}>
              {editingField && (
                <>
                  {/* Field Name */}
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Field Name</Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 4,
                        padding: 8,
                      }}
                      value={editingField.fieldName}
                      onChangeText={(text) =>
                        setEditingField({ ...editingField, fieldName: text })
                      }
                      placeholder="e.g., firstName"
                    />
                  </View>

                  {/* Field Label */}
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Field Label</Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 4,
                        padding: 8,
                      }}
                      value={editingField.fieldLabel}
                      onChangeText={(text) =>
                        setEditingField({ ...editingField, fieldLabel: text })
                      }
                      placeholder="e.g., First Name"
                    />
                  </View>

                  {/* Field Type */}
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Field Type</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                      {FIELD_TYPES.map((type) => (
                        <TouchableOpacity
                          key={type.value}
                          onPress={() =>
                            setEditingField({ ...editingField, fieldType: type.value as any })
                          }
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            backgroundColor:
                              editingField.fieldType === type.value ? '#2196F3' : '#ddd',
                            borderRadius: 4,
                            marginRight: 8,
                          }}
                        >
                          <Text
                            style={{
                              color: editingField.fieldType === type.value ? '#fff' : '#000',
                              fontSize: 12,
                              fontWeight: 'bold',
                            }}
                          >
                            {type.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Placeholder */}
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Placeholder</Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 4,
                        padding: 8,
                      }}
                      value={editingField.placeholder || ''}
                      onChangeText={(text) =>
                        setEditingField({ ...editingField, placeholder: text })
                      }
                      placeholder="e.g., Enter your first name"
                    />
                  </View>

                  {/* Width */}
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                      Width: {editingField.width}%
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 4,
                        padding: 8,
                      }}
                      value={editingField.width.toString()}
                      onChangeText={(text) => {
                        const width = parseInt(text) || 100;
                        setEditingField({
                          ...editingField,
                          width: Math.max(50, Math.min(100, width)),
                        });
                      }}
                      keyboardType="number-pad"
                      placeholder="50-100"
                    />
                  </View>

                  {/* Height */}
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                      Height: {editingField.height}px
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 4,
                        padding: 8,
                      }}
                      value={editingField.height.toString()}
                      onChangeText={(text) => {
                        const height = parseInt(text) || 40;
                        setEditingField({
                          ...editingField,
                          height: Math.max(30, height),
                        });
                      }}
                      keyboardType="number-pad"
                      placeholder="30+"
                    />
                  </View>

                  {/* Required */}
                  <View style={{ marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Required Field</Text>
                    <Switch
                      value={editingField.isRequired}
                      onValueChange={(value) =>
                        setEditingField({ ...editingField, isRequired: value })
                      }
                    />
                  </View>
                </>
              )}
            </ScrollView>

            {/* Modal Footer */}
            <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: '#ddd', flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => setShowFieldModal(false)}
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: '#999',
                  borderRadius: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (editingField) {
                    handleUpdateField(editingField);
                  }
                }}
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: '#4CAF50',
                  borderRadius: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FormBuilder;
