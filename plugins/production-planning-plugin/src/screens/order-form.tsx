/**
 * Order Form Screen
 * React Native screen for creating and editing orders
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
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Customer {
  id: number;
  name: string;
  customerNumber: string;
}

interface Product {
  id: number;
  name: string;
  articleNumber: string;
  price: number;
}

interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export const OrderFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { mode = 'create', order } = route.params || {};

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const customersResponse = await api.execute('customers.list', {});
      // setCustomers(customersResponse.data.customers);
      // const productsResponse = await api.execute('products.list', {});
      // setProducts(productsResponse.data.products);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrderItem = () => {
    if (!selectedProduct || !quantity) {
      Alert.alert('Error', 'Please select a product and enter quantity');
      return;
    }

    const newItem: OrderItem = {
      productId: selectedProduct.id,
      quantity: parseInt(quantity),
      unitPrice: selectedProduct.price,
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedProduct(null);
    setQuantity('1');
    setShowProductModal(false);
  };

  const handleRemoveOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const handleSaveOrder = async () => {
    if (!selectedCustomer) {
      Alert.alert('Error', 'Please select a customer');
      return;
    }

    if (orderItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item to the order');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create') {
        // TODO: Replace with actual API call
        // await api.execute('orders.create', {
        //   customerId: selectedCustomer.id,
        //   items: orderItems,
        // });
        Alert.alert('Success', 'Order created successfully');
      } else {
        // TODO: Replace with actual API call
        // await api.execute('orders.update', {
        //   id: order.id,
        //   items: orderItems,
        // });
        Alert.alert('Success', 'Order updated successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save order');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.customerNumber.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.articleNumber.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          {mode === 'create' ? 'Create Order' : 'Edit Order'}
        </Text>

        {/* Customer Selection */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Customer *</Text>
          <TouchableOpacity
            onPress={() => setShowCustomerModal(true)}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              padding: 12,
              backgroundColor: selectedCustomer ? '#f0f0f0' : '#fff',
            }}
          >
            <Text style={{ fontSize: 14, color: selectedCustomer ? '#000' : '#999' }}>
              {selectedCustomer ? selectedCustomer.name : 'Select a customer...'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Order Items */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Order Items *</Text>

          {orderItems.length > 0 && (
            <View style={{ marginBottom: 12 }}>
              {orderItems.map((item, index) => {
                const product = products.find((p) => p.id === item.productId);
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 4,
                      marginBottom: 8,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                        {product?.name} ({product?.articleNumber})
                      </Text>
                      <Text style={{ fontSize: 11, color: '#666' }}>
                        Qty: {item.quantity} × €{item.unitPrice.toFixed(2)} = €
                        {(item.quantity * item.unitPrice).toFixed(2)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveOrderItem(index)}
                      style={{ padding: 8, backgroundColor: '#F44336', borderRadius: 4 }}
                    >
                      <Text style={{ color: 'white', fontSize: 11 }}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          <TouchableOpacity
            onPress={() => setShowProductModal(true)}
            style={{
              borderWidth: 1,
              borderColor: '#2196F3',
              borderRadius: 4,
              padding: 12,
              backgroundColor: '#E3F2FD',
            }}
          >
            <Text style={{ fontSize: 14, color: '#2196F3', textAlign: 'center', fontWeight: 'bold' }}>
              + Add Product
            </Text>
          </TouchableOpacity>
        </View>

        {/* Total Amount */}
        {orderItems.length > 0 && (
          <View
            style={{
              padding: 12,
              backgroundColor: '#f5f5f5',
              borderRadius: 4,
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total Amount:</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4CAF50' }}>
                €{calculateTotal().toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: '#999',
              borderRadius: 4,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSaveOrder}
            disabled={loading}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              borderRadius: 4,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              {loading ? 'Saving...' : 'Save Order'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Customer Selection Modal */}
      <Modal
        visible={showCustomerModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCustomerModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select Customer</Text>
            </View>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 4,
                padding: 8,
                margin: 12,
              }}
              placeholder="Search customers..."
              value={customerSearch}
              onChangeText={setCustomerSearch}
            />
            <FlatList
              data={filteredCustomers}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCustomer(item);
                    setShowCustomerModal(false);
                  }}
                  style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                >
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.name}</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>{item.customerNumber}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              style={{ maxHeight: 300 }}
            />
          </View>
        </View>
      </Modal>

      {/* Product Selection Modal */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select Product</Text>
            </View>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 4,
                padding: 8,
                margin: 12,
              }}
              placeholder="Search products..."
              value={productSearch}
              onChangeText={setProductSearch}
            />
            <FlatList
              data={filteredProducts}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedProduct(item)}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                    backgroundColor: selectedProduct?.id === item.id ? '#E3F2FD' : '#fff',
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.name}</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>
                    {item.articleNumber} - €{item.price.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              style={{ maxHeight: 250 }}
            />
            {selectedProduct && (
              <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: '#ddd' }}>
                <Text style={{ fontSize: 12, marginBottom: 8 }}>Quantity:</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 4,
                    padding: 8,
                    marginBottom: 12,
                  }}
                  placeholder="Enter quantity"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="number-pad"
                />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => setShowProductModal(false)}
                    style={{
                      flex: 1,
                      padding: 10,
                      backgroundColor: '#999',
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddOrderItem}
                    style={{
                      flex: 1,
                      padding: 10,
                      backgroundColor: '#4CAF50',
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                      Add Item
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrderFormScreen;
