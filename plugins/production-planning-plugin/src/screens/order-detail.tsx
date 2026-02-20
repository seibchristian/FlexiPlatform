/**
 * Order Detail Screen
 * React Native screen for viewing order details and printing
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { generateOrderSheetHTML, generateOrderSheetText } from '../pdf-generator';
import type { Order, PrintableOrder } from '../types';

export const OrderDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { orderId } = route.params || {};

  const [order, setOrder] = useState<Order | null>(null);
  const [printableOrder, setPrintableOrder] = useState<PrintableOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.execute('orders.getById', { id: orderId });
      // setOrder(response.data);
      // const printResponse = await api.execute('orders.generatePrintableOrder', { id: orderId });
      // setPrintableOrder(printResponse.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (newStatus: string) => {
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
              loadOrderDetails();
              Alert.alert('Success', 'Order status updated');
            } catch (error) {
              Alert.alert('Error', 'Failed to update order status');
            }
          },
        },
      ]
    );
  };

  const handlePrint = async () => {
    if (!printableOrder) {
      Alert.alert('Error', 'Order data not available');
      return;
    }

    try {
      // In a real app, you would use a printing library like react-native-print
      // For now, we'll show the preview
      setShowPrintPreview(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to print order');
    }
  };

  const handleShare = async () => {
    if (!printableOrder) {
      Alert.alert('Error', 'Order data not available');
      return;
    }

    try {
      const textContent = generateOrderSheetText(printableOrder);
      await Share.share({
        message: textContent,
        title: `Order ${printableOrder.orderNumber}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share order');
    }
  };

  const handleExportPDF = async () => {
    if (!printableOrder) {
      Alert.alert('Error', 'Order data not available');
      return;
    }

    try {
      // In a real app, you would use a PDF library to generate and save the PDF
      // For now, we'll just show an alert
      Alert.alert('PDF Export', 'PDF export functionality would be implemented here');
    } catch (error) {
      Alert.alert('Error', 'Failed to export PDF');
    }
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!order || !printableOrder) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#999' }}>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Order Header */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{order.orderNumber}</Text>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: getStatusColor(order.status),
                borderRadius: 4,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                {order.status}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: '#666' }}>
            Date: {new Date(order.orderDate).toLocaleDateString('de-DE')}
          </Text>
        </View>

        {/* Customer Information */}
        <View style={{ marginBottom: 20, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Customer</Text>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{printableOrder.customer.name}</Text>
          {printableOrder.customer.contactPerson && (
            <Text style={{ fontSize: 12, color: '#666' }}>
              Contact: {printableOrder.customer.contactPerson}
            </Text>
          )}
          {printableOrder.customer.address && (
            <Text style={{ fontSize: 12, color: '#666' }}>{printableOrder.customer.address}</Text>
          )}
          {printableOrder.customer.email && (
            <Text style={{ fontSize: 12, color: '#666' }}>{printableOrder.customer.email}</Text>
          )}
          {printableOrder.customer.phone && (
            <Text style={{ fontSize: 12, color: '#666' }}>{printableOrder.customer.phone}</Text>
          )}
        </View>

        {/* Order Items */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>Order Items</Text>
          {printableOrder.items.map((item, index) => (
            <View
              key={index}
              style={{
                padding: 12,
                backgroundColor: '#f5f5f5',
                borderRadius: 4,
                marginBottom: 8,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                  {item.productName}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#4CAF50' }}>
                  €{item.totalPrice.toFixed(2)}
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: '#666' }}>
                Article: {item.articleNumber}
              </Text>
              <Text style={{ fontSize: 11, color: '#666' }}>
                Qty: {item.quantity} × €{item.unitPrice.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Total Amount */}
        <View
          style={{
            padding: 16,
            backgroundColor: '#E8F5E9',
            borderRadius: 4,
            marginBottom: 20,
            borderLeftWidth: 4,
            borderLeftColor: '#4CAF50',
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total Amount:</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4CAF50' }}>
              €{printableOrder.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Status Update Buttons */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#666' }}>
            Update Status
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['Neu', 'In Bearbeitung', 'Fertig'].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => handleUpdateStatus(status)}
                disabled={order.status === status}
                style={{
                  flex: 1,
                  padding: 8,
                  backgroundColor: order.status === status ? '#ddd' : '#2196F3',
                  borderRadius: 4,
                  opacity: order.status === status ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    color: order.status === status ? '#999' : 'white',
                    textAlign: 'center',
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handlePrint}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: '#4CAF50',
              borderRadius: 4,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              🖨️ Print
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleExportPDF}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: '#FF9800',
              borderRadius: 4,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              📄 PDF
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: '#2196F3',
              borderRadius: 4,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              📤 Share
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Print Preview Modal */}
      <Modal
        visible={showPrintPreview}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowPrintPreview(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ padding: 16, backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Print Preview</Text>
              <TouchableOpacity
                onPress={() => setShowPrintPreview(false)}
                style={{ padding: 8, backgroundColor: '#999', borderRadius: 4 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={{ flex: 1, padding: 16 }}>
            <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 4 }}>
              <Text style={{ fontSize: 12, color: '#666' }}>
                {generateOrderSheetText(printableOrder)}
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default OrderDetailScreen;
