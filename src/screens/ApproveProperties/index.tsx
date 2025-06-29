import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { useApprovalProperties } from '@/hooks/useProperties';
import { Colors, Typography, normalize } from '@/theme/globalStyles';
import { api } from '@/services/api/apiConfig';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import { MyProperty } from '@/hooks/queries/useMyProperties';
import ApprovalPropertyCard from './components/ApprovalPropertyCard';
import AuthCheck from '@/components/AuthCheck';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store/useAuthStore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const ApproveProperties = () => {
  const { data: properties, isLoading, isError, refetch } = useApprovalProperties();
  const queryClient = useQueryClient();
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const handleApprove = async (propertyId: number) => {
    
    try {
      setProcessingIds(prev => [...prev, propertyId]);
      await api.post(`${API_ENDPOINTS.PROPERTIES.approve(propertyId)}`, {
        userId: user?.userid,
        action: 'approve'
      });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Property approved successfully',
        position: 'bottom',
      });
      queryClient.invalidateQueries({ queryKey: ["approvalProperties"] });
    } catch (error) {
      console.error('Error approving property:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to approve property'
      });
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== propertyId));
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Call your fetch favorites function here
      refetch();
      
      return () => {
        // Optional cleanup if needed
      };
    }, [refetch])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing properties:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const renderItem = ({ item }: { item: MyProperty }) => {
    const isProcessing = processingIds.includes(item.propertyid);
    
    return (
      <View style={styles.propertyContainer}>
        <ApprovalPropertyCard
          item={item}
          isProcessing={isProcessing}
          onApprove={() => handleApprove(item.propertyid)}
          navigation={navigation}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load properties</Text>
      </View>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No properties pending approval</Text>
      </View>
    );
  }

  return (
    <AuthCheck>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}>Approve Properties</Text>
        <FlatList
          data={properties}
          renderItem={renderItem}
          keyExtractor={(item) => item.propertyid.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </SafeAreaView>
    </AuthCheck>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: normalize(16),
    backgroundColor: Colors.background,
  },
  title: {
    ...Typography.pageHeading,
    marginHorizontal: normalize(16),
    marginVertical: normalize(16),
  },
  propertyContainer: {
    marginBottom: normalize(16),
    marginHorizontal: normalize(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  listContainer: {
    paddingBottom: normalize(20),
  },
});

export default ApproveProperties; 