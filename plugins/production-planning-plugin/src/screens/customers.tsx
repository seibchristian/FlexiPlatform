/**
 * Customers Management Screen
 * React Native screen for managing customers
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Customer {
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

export const CustomersScreen: React.FC = () => {
  const navigation = useNavigation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, [showArchived]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.execute('customers.list', { includeArchived: showArchived });
      // setCustomers(response.data.customers);
      setCustomers([]); // Placeholder
    } catch (error) {
      Alert.alert('Error', 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.customerNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomer = () => {
    navigation.navigate('CustomerForm', { mode: 'create' });
  };

  const handleEditCustomer = (customer: Customer) => {
    navigation.navigate('CustomerForm', { mode: 'edit', customer });
  };

  const handleArchiveCustomer = (customerId: number) => {
    Alert.alert(
      'Archive Customer',
      'Are you sure you want to archive this customer?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Archive',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // await api.execute('customers.archive', { id: customerId });
              loadCustomers();
              Alert.alert('Success', 'Customer archived successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to archive customer');
            }
          },
        },
      ]
    );
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
          <Text style={{ fontSize: 12, color: '#666' }}>{item.customerNumber}</Text>
          {item.email && <Text style={{ fontSize: 12, color: '#666' }}>{item.email}</Text>}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => handleEditCustomer(item)}
            style={{ padding: 8, backgroundColor: '#2196F3', borderRadius: 4 }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleArchiveCustomer(item.id)}
            style={{ padding: 8, backgroundColor: '#FF9800', borderRadius: 4 }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Archive</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Customers</Text>

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 4,
            padding: 8,
            marginBottom: 8,
          }}
          placeholder="Search customers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => setShowArchived(!showArchived)}
            style={{
              padding: 8,
              backgroundColor: showArchived ? '#4CAF50' : '#ddd',
              borderRadius: 4,
              flex: 1,
              marginRight: 8,
            }}
          >
            <Text style={{ color: showArchived ? 'white' : 'black', textAlign: 'center' }}>
              {showArchived ? 'Showing Archived' : 'Hide Archived'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddCustomer}
            style={{
              padding: 8,
              backgroundColor: '#4CAF50',
              borderRadius: 4,
              flex: 1,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              + Add Customer
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <FlatList
          data={filteredCustomers}
          renderItem={renderCustomerItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <Text style={{ fontSize: 16, color: '#999' }}>No customers found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default CustomersScreen;
