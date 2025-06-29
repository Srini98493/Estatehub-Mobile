import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Text } from "@/components/base";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useServices } from "@/hooks/queries/useServices";
import { formatDate } from '@/utils/dateUtils';
import GradientFAB from '@/components/GradientFAB';
import AuthCheck from '@/components/AuthCheck';
import { useAuthStore } from '@/store/useAuthStore';
import { Colors, Layout, Typography, Inputs, Tabs, Cards, normalize } from '@/theme/globalStyles';

const { width, height } = Dimensions.get("window");
const scale = Math.min(width, height) / 375;
const scaledSize = (size: number) => Math.round(size * scale);

type TabType = 'requests' | 'history';
type ServicesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ServiceRequest {
  serviceid: number;
  servicelistno: number;
  servicecategoryname: string;
  postquery: string;
  requestedby: string;
  areacode: string;
  contactno: string;
  email: string;
  createdby: number;
  createddate: string;
  updatedby: number;
  updateddate: string;
}

// Helper function to get icon based on service category
const getServiceIcon = (categoryName: string) => {
  const categoryMap: Record<string, any> = {
    'Full Management (End-to-End)': require('../../theme/assets/images/plumbing.png'),
    'Property Management': require('../../theme/assets/images/property.png'),
    'Tenant Placement': require('../../theme/assets/images/property.png'),
    'Rental Management': require('../../theme/assets/images/property.png'),
    'Maintenance': require('../../theme/assets/images/property.png'),
    'Inspection': require('../../theme/assets/images/property.png'),
    'Cleaning': require('../../theme/assets/images/property.png'),
    'Gardening': require('../../theme/assets/images/property.png'),
    'Security': require('../../theme/assets/images/property.png')
  };

  return categoryMap[categoryName] || require('../../theme/assets/images/logo.png');
};

// Helper function to get background color based on service category
const getServiceColor = (categoryName: string) => {
  const colorMap: Record<string, string> = {
    'Full Management (End-to-End)': '#E8F5FF',
    'Property Management': '#F0F8FF',
    'Tenant Placement': '#FFF0F5',
    'Rental Management': '#F5F5DC',
    'Maintenance': '#F0FFF0',
    'Inspection': '#FFF8DC',
    'Cleaning': '#E0FFFF',
    'Gardening': '#F0FFF0',
    'Security': '#FFE4E1'
  };

  return colorMap[categoryName] || '#F5F5F5';
};

const Services = () => {
  const navigation = useNavigation<ServicesScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const { services, isLoading } = useServices();
  const { checkAndHandleTokenExpiry } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');



  useFocusEffect(
    useCallback(() => {
      // Set white status bar with dark content for all non-Home screens
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('#FFFFFF');
      
      return () => {
        // No need to clean up as other screens will set their own status bar
      };
    }, [])
  );
  useEffect(() => {

    
    // Check token validity when the component mounts
    checkAndHandleTokenExpiry();
    
    
    // Set up interval to periodically check token validity
    const tokenCheckInterval = setInterval(() => {
      checkAndHandleTokenExpiry();
    }, 60000); // Check every minute
    
    return () => clearInterval(tokenCheckInterval);
    
  }, [checkAndHandleTokenExpiry]);

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim() || !services?.data) return services?.data;

    const query = searchQuery.toLowerCase();
    return services.data.filter((service: ServiceRequest) => 
      service.postquery.toLowerCase().includes(query) ||
      service.servicecategoryname.toLowerCase().includes(query)
    );
  }, [services?.data, searchQuery]);

  const renderServiceCard = ({ item: service }: { item: ServiceRequest }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestInfo}>
        <View style={[
          styles.iconContainer, 
          { backgroundColor: getServiceColor(service.servicecategoryname) }
        ]}>
          <Image 
            source={getServiceIcon(service.servicecategoryname)} 
            style={styles.serviceIcon} 
          />
        </View>
        <View style={styles.requestDetails}>
          <View>
            <Text style={styles.requestTitle}>{service.postquery}</Text>
            <Text style={styles.categoryName}>{service.servicecategoryname}</Text>
          </View>
          {/* <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => {
              // Handle chat button press
              console.log(`Chat with ${service.requestedby} about service #${service.serviceid}`);
            }}
          >
            <Image 
              source={require('@/theme/assets/images/Chat.png')} 
              style={styles.chatIcon} 
            />
          </TouchableOpacity> */}
        </View>
      </View>
      <View style={styles.requestMeta}>
        <Text style={styles.metaText}>Requested By: {service.requestedby}</Text>
        <Text style={styles.metaText}>
          Requested Date: {formatDate(service.createddate, 'MMM DD, YYYY')}
        </Text>
      </View>
      
      {/* Contact info */}
      <View style={styles.contactInfo}>
        <View style={styles.contactItem}>
          <Icon name="call-outline" size={14} color={Colors.primary} />
          <Text style={styles.contactText}>{service.areacode} {service.contactno}</Text>
        </View>
        <View style={styles.contactItem}>
          <Icon name="mail-outline" size={14} color={Colors.primary} />
          <Text style={styles.contactText}>{service.email}</Text>
        </View>
      </View>
    </View>
  );

  const renderTab = (tab: TabType, label: string) => (
    <TouchableOpacity 
      style={[styles.tab, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      {activeTab === tab ? (
        <LinearGradient 
          colors={Colors.gradientPrimary} 
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.gradientButton}
        >
          <Text style={styles.activeTabText}>{label}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.inactiveButton}>
          <Text style={styles.tabText}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No {activeTab === 'requests' ? 'active requests' : 'service history'} found
      </Text>
    </View>
  );

  return (
    <AuthCheck>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Text style={styles.headerTitle}>Services</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Image source={require('@/theme/assets/images/Search.png')} style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search Here"
              placeholderTextColor={Colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Icon 
                  name="close-circle" 
                  size={20} 
                  color={Colors.textLight}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {renderTab('requests', 'Requests')}
          {renderTab('history', 'History')}
        </View>

        {/* Service Requests List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredServices}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item?.serviceid.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={ListEmptyComponent}
          />
        )}

        {/* FAB */}
        <GradientFAB 
          onPress={() => navigation.navigate('AddService')} 
        />
      </SafeAreaView>
    </AuthCheck>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.container,
    marginTop: normalize(20),
    
  },
  headerTitle: {
    ...Typography.headerTitle,
    marginHorizontal: 16,
    marginTop:Platform.OS === 'android' ? 24 : 0
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: Colors.textLight,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    color: Colors.textPrimary,
    fontSize: 14,
    padding: 0,
  },
  clearButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    ...Tabs.container
  },
  tab: {
    ...Tabs.tab,
    flex: 1,
  },
  activeTab: {
    ...Tabs.activeTab,
  },
  gradientButton: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  inactiveButton: {
    borderRadius: 8,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  tabText: {
    ...Tabs.tabText,
    color: Colors.textPrimary,
  },
  activeTabText: {
    ...Tabs.activeTabText,
    color: Colors.textWhite,
  },
  requestsList: {
    flex: 1,
  },
  requestCard: {
    ...Cards.requestCard,
    padding: 16,
    marginBottom: 16,
  },
  requestInfo: {
    flex: 1,
    flexDirection: "row",
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
  serviceIcon: {
    width: 32,
    height: 32,
    tintColor: Colors.primary,
  },
  requestDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  categoryName: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  propertyName: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  requestMeta: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chatButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 150, 199, 0.1)',
    borderRadius: 20,
  },
  chatIcon: {
    width: 20,
    height: 20,
    tintColor: Colors.primary,
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
    ...Layout.listContainer,
    paddingBottom: 80,
    paddingHorizontal: 16, // Add padding for FAB
  },
  contactInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  }
});

export default Services;