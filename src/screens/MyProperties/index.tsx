import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { Text } from '@/components/base';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMyProperties } from '@/hooks/queries/useMyProperties';
import PropertyCard from './components/PropertyCard';
import GradientFAB from '@/components/GradientFAB';
import AuthCheck from '@/components/AuthCheck';
import { useAuthStore } from '@/store/useAuthStore';
import { Colors, Layout, Typography } from '@/theme/globalStyles';
import { useQueryClient } from '@tanstack/react-query';

type RootStackParamList = {
  AddProperty: { isEdit: boolean; propertyId?: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MyProperties = () => {
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();
  const { myProperties, isLoading, refetch, error } = useMyProperties();
  const { checkAndHandleTokenExpiry } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  // Check token validity when component mounts
  useEffect(() => {
    checkAndHandleTokenExpiry();
  }, [checkAndHandleTokenExpiry]);

  // More aggressive refetch strategy that forces a complete refresh
  const forceRefresh = useCallback(async () => {
    try {
      // First invalidate the cache for my-properties query
      await queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      
      // Then refetch with fresh data
      await refetch();
      
      // Also invalidate related queries to ensure consistency
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
    } catch (err) {
      console.error('Error refreshing properties:', err);
    }
  }, [queryClient, refetch]);

  // Refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      // This will run every time the screen comes into focus
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.gray50);
      console.log('MyProperties screen focused - refreshing data');
      forceRefresh();
      
      // Return cleanup function
      return () => {
        // Any cleanup needed when screen is unfocused
      };
    }, [forceRefresh])
  );

  // Enhanced refresh that ensures a complete data reload
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await forceRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [forceRefresh]);

  // Handler for property deletion with more aggressive refresh
  const handlePropertyDeleted = useCallback(() => {
    console.log('Property deleted - forcing refresh');
    forceRefresh();
  }, [forceRefresh]);

  // Handler for property update with more aggressive refresh
  const handlePropertyUpdated = useCallback(() => {
    console.log('Property updated - forcing refresh');
    forceRefresh();
  }, [forceRefresh]);

  // Conditional rendering based on data state
  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No properties found. Add a new property using the button below.
      </Text>
    </View>
  );

  // Error renderer
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        {error instanceof Error ? error.message : 'Failed to load properties'}
      </Text>
      <Text style={styles.retryText} onPress={forceRefresh}>
        Tap to retry
      </Text>
    </View>
  );

  return (
    <AuthCheck>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>My Properties</Text>

        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          renderError()
        ) : (
          <FlatList
            data={myProperties}
            renderItem={({ item }) => (
              <PropertyCard 
                item={item}
                navigation={navigation}
                onDelete={handlePropertyDeleted}
                onUpdate={handlePropertyUpdated}
              />
            )}
            keyExtractor={(item) => `property-${item?.propertyid?.toString()}`}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
          />
        )}
        
        <GradientFAB
          onPress={() => navigation.navigate("AddProperty", { isEdit: false })}
        />
      </View>
    </AuthCheck>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.container,
    marginTop:Platform.OS === 'android' ? 36 : 30
  },
  headerTitle: {
    ...Typography.pageHeading
  },
  loadingContainer: {
    ...Layout.loadingContainer
  },
  emptyContainer: {
    ...Layout.emptyContainer
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  listContainer: {
    ...Layout.listContainer
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default MyProperties;