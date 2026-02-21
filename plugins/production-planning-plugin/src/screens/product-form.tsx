/**
 * Product Form Screen
 * React Native screen for creating and editing products with image upload support
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
  Image,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Product {
  id: number;
  articleNumber: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { mode = 'create', product } = route.params || {};

  const [articleNumber, setArticleNumber] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && product) {
      setArticleNumber(product.articleNumber);
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price.toString());
      setCategory(product.category || '');
      setImageUrl(product.imageUrl || '');
    }
  }, [mode, product]);

  const handleSelectImage = async () => {
    // TODO: Implement image picker
    // In a real app, you would use react-native-image-picker or similar
    Alert.alert('Image Picker', 'Image selection would be implemented here');
  };

  const handleRemoveImage = () => {
    setImageUrl('');
  };

  const validateForm = (): boolean => {
    if (!articleNumber.trim()) {
      Alert.alert('Error', 'Article number is required');
      return false;
    }

    if (!name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return false;
    }

    if (!price.trim() || isNaN(parseFloat(price))) {
      Alert.alert('Error', 'Valid price is required');
      return false;
    }

    return true;
  };

  const handleSaveProduct = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const productData = {
        articleNumber: articleNumber.trim(),
        name: name.trim(),
        description: description.trim() || undefined,
        price: parseFloat(price),
        category: category.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      };

      if (mode === 'create') {
        // TODO: Replace with actual API call
        // await api.execute('products.create', productData);
        Alert.alert('Success', 'Product created successfully');
      } else {
        // TODO: Replace with actual API call
        // await api.execute('products.update', {
        //   id: product.id,
        //   ...productData,
        // });
        Alert.alert('Success', 'Product updated successfully');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          {mode === 'create' ? 'Create Product' : 'Edit Product'}
        </Text>

        {/* Image Section */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Product Image</Text>

          {imageUrl ? (
            <View>
              <TouchableOpacity onPress={() => setShowImageModal(true)}>
                <Image
                  source={{ uri: imageUrl }}
                  style={{
                    width: '100%',
                    height: 200,
                    borderRadius: 8,
                    marginBottom: 8,
                    backgroundColor: '#f0f0f0',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRemoveImage}
                style={{
                  padding: 10,
                  backgroundColor: '#F44336',
                  borderRadius: 4,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                  Remove Image
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                width: '100%',
                height: 150,
                borderRadius: 8,
                backgroundColor: '#e0e0e0',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: '#999' }}>No image selected</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSelectImage}
            style={{
              padding: 12,
              backgroundColor: '#2196F3',
              borderRadius: 4,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              {imageUrl ? 'Change Image' : 'Select Image'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              padding: 12,
              marginTop: 8,
              fontSize: 12,
              color: '#666',
            }}
            placeholder="Or paste image URL here..."
            value={imageUrl}
            onChangeText={setImageUrl}
            multiline={true}
          />
        </View>

        {/* Article Number */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Article Number *</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              padding: 12,
            }}
            placeholder="Enter article number..."
            value={articleNumber}
            onChangeText={setArticleNumber}
          />
        </View>

        {/* Product Name */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Product Name *</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              padding: 12,
            }}
            placeholder="Enter product name..."
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Description */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Description</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              padding: 12,
              minHeight: 100,
              textAlignVertical: 'top',
            }}
            placeholder="Enter product description..."
            value={description}
            onChangeText={setDescription}
            multiline={true}
          />
        </View>

        {/* Price */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Price (€) *</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              padding: 12,
            }}
            placeholder="Enter price..."
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Category */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Category</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 4,
              padding: 12,
            }}
            placeholder="Enter category..."
            value={category}
            onChangeText={setCategory}
          />
        </View>

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
            onPress={handleSaveProduct}
            disabled={loading}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              borderRadius: 4,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              {loading ? 'Saving...' : 'Save Product'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        onRequestClose={() => setShowImageModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: '90%', height: '80%', resizeMode: 'contain' }}
            />
          )}
          <TouchableOpacity
            onPress={() => setShowImageModal(false)}
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              padding: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 20,
            }}
          >
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>×</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ProductFormScreen;
