import React, { useState, useEffect, useMemo, memo } from "react";
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
} from "react-native";
import { Text } from "@/components/base";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useHomeLoan, HomeLoanRequest } from "@/hooks/queries/useHomeLoan";
import { formatDate } from '@/utils/dateUtils';
import GradientFAB from '@/components/GradientFAB';
import AuthCheck from '@/components/AuthCheck';
import { useAuthStore } from '@/store/useAuthStore';
import { Colors, Layout, Typography, Inputs, Tabs, Cards, normalize } from '@/theme/globalStyles';

const { width, height } = Dimensions.get("window");
const scale = Math.min(width, height) / 375;
const scaledSize = (size: number) => Math.round(size * scale);

type TabType = 'requests' | 'history';
type HomeLoanScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Helper function to get icon based on loan category
const getLoanIcon = (categoryName: string) => {
  const categoryMap: Record<string, any> = {
    'Home Loan': require('@/theme/assets/images/plumbing.png'),
    'Personal Loan': require('@/theme/assets/images/property.png'),
    'Business Loan': require('@/theme/assets/images/property.png'),
    'Education Loan': require('@/theme/assets/images/property.png'),
    'Vehicle Loan': require('@/theme/assets/images/property.png'),
  };

  return categoryMap[categoryName] || require('@/theme/assets/images/logo.png');
};

// Helper function to get background color based on loan category
const getLoanColor = (categoryName: string) => {
  const colorMap: Record<string, string> = {
    'Home Loan': '#E8F5FF',
    'Personal Loan': '#F0F8FF',
    'Business Loan': '#FFF0F5',
    'Education Loan': '#F5F5DC',
    'Vehicle Loan': '#F0FFF0',
  };

  return colorMap[categoryName] || '#F5F5F5';
};

// Memoized Loan Card component
interface LoanCardProps {
  loan: HomeLoanRequest;
}

const LoanCard = memo(({ loan }: LoanCardProps) => (
  <View style={styles.requestCard}>
    <View style={styles.requestInfo}>
      <View style={[
        styles.iconContainer, 
        { backgroundColor: getLoanColor(loan.loancategoryname) }
      ]}>
        <Image 
          source={getLoanIcon(loan.loancategoryname)} 
          style={styles.serviceIcon} 
        />
      </View>
      <View style={styles.requestDetails}>
        <View>
          <Text style={styles.requestTitle}>{loan.postquery}</Text>
          <Text style={styles.categoryName}>{loan.loancategoryname}</Text>
        </View>
        {/* <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => {
            console.log(`Chat about loan #${loan.loanid}`);
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
      <Text style={styles.metaText}>Requested By: {loan.requestedby}</Text>
      <Text style={styles.metaText}>
        Requested Date: {formatDate(loan.createddate, 'MMM DD, YYYY')}
      </Text>
    </View>
    
    {/* Contact info */}
    <View style={styles.contactInfo}>
      <View style={styles.contactItem}>
        <Icon name="call-outline" size={14} color={Colors.primary} />
        <Text style={styles.contactText}>{loan.areacode} {loan.contactno}</Text>
      </View>
      <View style={styles.contactItem}>
        <Icon name="mail-outline" size={14} color={Colors.primary} />
        <Text style={styles.contactText}>{loan.email}</Text>
      </View>
    </View>
  </View>
));

// Tab component
interface TabProps {
  tab: TabType;
  label: string;
  activeTab: TabType;
  onPress: (tab: TabType) => void;
}

const Tab = memo(({ tab, label, activeTab, onPress }: TabProps) => (
  <TouchableOpacity 
    style={[styles.tab, activeTab === tab && styles.activeTab]}
    onPress={() => onPress(tab)}
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
));

const ApplyHomeLoan = () => {
  const navigation = useNavigation<HomeLoanScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const { homeLoans, isLoading } = useHomeLoan();
  const { checkAndHandleTokenExpiry } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check token validity when the component mounts
    checkAndHandleTokenExpiry();
    
    // Set up interval to periodically check token validity
    const tokenCheckInterval = setInterval(() => {
      checkAndHandleTokenExpiry();
    }, 60000); // Check every minute
    
    return () => clearInterval(tokenCheckInterval);
  }, [checkAndHandleTokenExpiry]);

  const filteredLoans = useMemo(() => {
    if (!searchQuery.trim() || !homeLoans?.data) return homeLoans?.data;

    const query = searchQuery.toLowerCase();
    return homeLoans.data.filter((loan: HomeLoanRequest) => 
      loan?.postquery?.toLowerCase().includes(query) ||
      loan?.loancategoryname?.toLowerCase().includes(query)
    );
  }, [homeLoans?.data, searchQuery]);

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No {activeTab === 'requests' ? 'active requests' : 'loan history'} found
      </Text>
    </View>
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <AuthCheck>
      <SafeAreaView style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
            <Text style={[styles.headerTitle]}>Home Loans</Text>
          <View style={styles.headerRight} />
        </View>

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
          <Tab 
            tab="requests" 
            label="Requests" 
            activeTab={activeTab} 
            onPress={setActiveTab} 
          />
          <Tab 
            tab="history" 
            label="History" 
            activeTab={activeTab} 
            onPress={setActiveTab} 
          />
        </View>

        {/* Loan Requests List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredLoans}
            renderItem={({ item }) => <LoanCard loan={item} />}
            keyExtractor={(item) => item?.loanid?.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={ListEmptyComponent}
          />
        )}

        {/* FAB */}
        <GradientFAB 
          onPress={() => navigation.navigate('AddHomeLoan' as any)} 
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    zIndex: 1
  },
  headerRight: {
    width: 40, // To balance the header layout
  },
  headerTitle: {
    ...Typography.headerTitle,
    flex: 1,
    textAlign: 'center',
    marginTop: 12,
    marginLeft: -50,
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

export default ApplyHomeLoan;