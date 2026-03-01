/**
 * Form Designer Screen
 * Main interface for managing form definitions across the platform
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';

interface FormDefinition {
  id: number;
  entityType: string;
  displayName: string;
  description?: string;
  fields: any[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function FormDesignerScreen() {
  const colors = useColors();
  const [formDefinitions, setFormDefinitions] = useState<FormDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFormName, setNewFormName] = useState('');
  const [newFormDisplayName, setNewFormDisplayName] = useState('');
  const [newFormDescription, setNewFormDescription] = useState('');

  const listDefinitions = trpc.formDesigner.listDefinitions.useQuery();

  useEffect(() => {
    if (listDefinitions.data) {
      setFormDefinitions(listDefinitions.data as any);
      setLoading(false);
    }
  }, [listDefinitions.data]);

  const createDefinition = trpc.formDesigner.createDefinition.useMutation({
    onSuccess: () => {
      Alert.alert('Success', 'Form definition created successfully');
      setShowCreateModal(false);
      setNewFormName('');
      setNewFormDisplayName('');
      setNewFormDescription('');
      listDefinitions.refetch();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to create form definition');
    },
  });

  const handleCreateForm = () => {
    if (!newFormName.trim() || !newFormDisplayName.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    createDefinition.mutate({
      entityType: newFormName,
      displayName: newFormDisplayName,
      description: newFormDescription,
      fields: [],
    });
  };

  if (loading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Text className="text-2xl font-bold text-foreground">Form Designer</Text>
              <Text className="text-sm text-muted">Manage form definitions for all entities</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowCreateModal(true)}
              className="bg-primary px-4 py-2 rounded-lg"
            >
              <Text className="text-background font-semibold text-sm">+ New Form</Text>
            </TouchableOpacity>
          </View>

          {/* Form Definitions List */}
          <View className="gap-2">
            {formDefinitions.length === 0 ? (
              <View className="bg-surface rounded-xl p-6 border border-border items-center justify-center">
                <Text className="text-muted text-center">
                  No form definitions yet. Create one to get started!
                </Text>
              </View>
            ) : (
              formDefinitions.map((form) => (
                <View
                  key={form.id}
                  className="bg-surface rounded-xl p-4 border border-border"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-foreground">
                        {form.displayName}
                      </Text>
                      <Text className="text-xs text-muted mt-1">{form.entityType}</Text>
                      {form.description && (
                        <Text className="text-sm text-muted mt-2">{form.description}</Text>
                      )}
                    </View>
                    <View
                      className={`px-3 py-1 rounded-full ${
                        form.isActive ? 'bg-success' : 'bg-error'
                      }`}
                    >
                      <Text className="text-xs font-semibold text-white">
                        {form.isActive ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-xs text-muted mb-3">
                    {form.fields.length} fields
                  </Text>

                  <View className="flex-row gap-2">
                    <TouchableOpacity className="flex-1 bg-primary px-3 py-2 rounded-lg">
                      <Text className="text-background font-semibold text-center text-sm">
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-warning px-3 py-2 rounded-lg">
                      <Text className="text-background font-semibold text-center text-sm">
                        Preview
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-error px-3 py-2 rounded-lg">
                      <Text className="text-background font-semibold text-center text-sm">
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Create Form Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              padding: 16,
            }}
          >
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                Create New Form
              </Text>

              {/* Entity Type */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                  Entity Type (e.g., customers, products, orders)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 4,
                    padding: 8,
                  }}
                  value={newFormName}
                  onChangeText={setNewFormName}
                  placeholder="e.g., customers"
                />
              </View>

              {/* Display Name */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                  Display Name
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 4,
                    padding: 8,
                  }}
                  value={newFormDisplayName}
                  onChangeText={setNewFormDisplayName}
                  placeholder="e.g., Customer Form"
                />
              </View>

              {/* Description */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                  Description (optional)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 4,
                    padding: 8,
                    minHeight: 80,
                    textAlignVertical: 'top',
                  }}
                  value={newFormDescription}
                  onChangeText={setNewFormDescription}
                  placeholder="Describe this form..."
                  multiline={true}
                />
              </View>
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: '#999',
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateForm}
                disabled={createDefinition.isPending}
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: createDefinition.isPending ? '#ccc' : '#4CAF50',
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                  {createDefinition.isPending ? 'Creating...' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
