import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNetworkAwareAPI } from '@/hooks/useNetworkAwareAPI';
import { Colors, normalize, Typography, Layout } from '@/theme/globalStyles';

// Example API function
const fetchData = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: 'Example data' });
    }, 1000);
  });
};

const NetworkAwareAPIExample = () => {
  const { isLoading, error, callAPI } = useNetworkAwareAPI();

  const handleFetchData = async () => {
    await callAPI(
      fetchData,
      (data) => {
        // Success callback
        Alert.alert('Success', 'Data fetched successfully');
        console.log('Data:', data);
      },
      (error) => {
        // Error callback
        Alert.alert('Error', error.message);
      },
      () => {
        // No connection callback
        Alert.alert('No Connection', 'Please check your internet connection');
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network-Aware API Example</Text>
      
      <Button 
        title={isLoading ? 'Loading...' : 'Fetch Data'} 
        onPress={handleFetchData}
        disabled={isLoading}
      />
      
      {error && (
        <Text style={styles.errorText}>
          Error: {error.message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.container,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.h2,
    marginBottom: normalize(20),
  },
  errorText: {
    color: Colors.error,
    marginTop: normalize(10),
  },
});

export default NetworkAwareAPIExample; 