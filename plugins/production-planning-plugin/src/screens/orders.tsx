/**
 * Orders Management Screen
 * React Native screen for managing orders
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

interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  orderDate: Date;
  status: 'Neu' | 'In Bearbeitung' | 'Fertig';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  customer?: {
    name: string;
  };
}

export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.execute('orders.list', { status: selectedStatus });
      // setOrders(response.data.orders);
      setOrders([]); // Placeholder
    } catch (error) {
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) =>
    (order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!selectedStatus || order.status === selectedStatus)
  );

  const handleAddOrder = () => {
    navigation.navigate('OrderForm', { mode: 'create' });
  };

  const handleViewOrder = (order: Order) => {
    navigation.navigate('OrderDetail', { orderId: order.id });
  };

  const handleUpdateStatus = (orderId: number, newStatus: string) => {
    Alert.alert(
      'Update Status',
      `Change order status to ${newStatus}?`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Update',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // await api.execute('orders.updateStatus', { id: orderId, status: newStatus });
              loadOrders();
              Alert.alert('Success', 'Order status updated');
            } catch (error) {
              Alert.alert('Error', 'Failed to update order status');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Neu':
        return '#FFC107';
      case 'In Bearbeitung':
        return '#2196F3';
      case 'Fertig':
        return '#4CAF50';
      default:
        return '#999';
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
      <TouchableOpacity onPress={() => handleViewOrder(item)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.orderNumber}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              Customer: {item.customer?.name || 'Unknown'}
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              Date: {new Date(item.orderDate).toLocaleDateString('de-DE')}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 4, color: '#4CAF50' }}>
              €{item.totalAmount.toFixed(2)}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 8 }}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: getStatusColor(item.status),
                borderRadius: 4,
              }}
            >
              <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                {item.status}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleViewOrder(item)}
              style={{ padding: 6, backgroundColor: '#2196F3', borderRadius: 4 }}
            >
              <Text style={{ color: 'white', fontSize: 11 }}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Orders</Text>

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 4,
            padding: 8,
            marginBottom: 8,
          }}
          placeholder="Search orders..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
        >
          <TouchableOpacity
            onPress={() => setSelectedStatus(null)}
            style={{
              padding: 8,
              backgroundColor: !selectedStatus ? '#2196F3' : '#ddd',
              borderRadius: 4,
              marginRight: 8,
            }}
          >
            <Text style={{ color: !selectedStatus ? 'white' : 'black' }}>All</Text>
          </TouchableOpacity>
          {['Neu', 'In Bearbeitung', 'Fertig'].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setSelectedStatus(status)}
              style={{
                padding: 8,
                backgroundColor: selectedStatus === status ? '#2196F3' : '#ddd',
                borderRadius: 4,
                marginRight: 8,
              }}
            >
              <Text style={{ color: selectedStatus === status ? 'white' : 'black' }}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={handleAddOrder}
          style={{
            padding: 12,
            backgroundColor: '#4CAF50',
            borderRadius: 4,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            + Create Order
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <Text style={{ fontSize: 16, color: '#999' }}>No orders found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default OrdersScreen;
