/**
 * Products Management Screen
 * React Native screen for managing products
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

interface Product {
  id: number;
  articleNumber: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.execute('products.list', { category: selectedCategory });
      // setProducts(response.data.products);
      // Extract unique categories
      // setCategories([...new Set(response.data.products.map(p => p.category))]);
      setProducts([]); // Placeholder
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.articleNumber.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!selectedCategory || product.category === selectedCategory)
  );

  const handleAddProduct = () => {
    navigation.navigate('ProductForm', { mode: 'create' });
  };

  const handleEditProduct = (product: Product) => {
    navigation.navigate('ProductForm', { mode: 'edit', product });
  };

  const handleDeleteProduct = (productId: number) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // await api.execute('products.delete', { id: productId });
              loadProducts();
              Alert.alert('Success', 'Product deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ]
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
          <Text style={{ fontSize: 12, color: '#666' }}>Article: {item.articleNumber}</Text>
          {item.category && (
            <Text style={{ fontSize: 12, color: '#666' }}>Category: {item.category}</Text>
          )}
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 4, color: '#4CAF50' }}>
            €{item.price.toFixed(2)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => handleEditProduct(item)}
            style={{ padding: 8, backgroundColor: '#2196F3', borderRadius: 4 }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteProduct(item.id)}
            style={{ padding: 8, backgroundColor: '#F44336', borderRadius: 4 }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Products</Text>

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 4,
            padding: 8,
            marginBottom: 8,
          }}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 12 }}
          >
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={{
                padding: 8,
                backgroundColor: !selectedCategory ? '#2196F3' : '#ddd',
                borderRadius: 4,
                marginRight: 8,
              }}
            >
              <Text style={{ color: !selectedCategory ? 'white' : 'black' }}>All</Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={{
                  padding: 8,
                  backgroundColor: selectedCategory === category ? '#2196F3' : '#ddd',
                  borderRadius: 4,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: selectedCategory === category ? 'white' : 'black' }}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity
          onPress={handleAddProduct}
          style={{
            padding: 12,
            backgroundColor: '#4CAF50',
            borderRadius: 4,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            + Add Product
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <Text style={{ fontSize: 16, color: '#999' }}>No products found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default ProductsScreen;
