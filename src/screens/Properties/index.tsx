import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  RefreshControl
} from 'react-native';
import { Text } from '@/components/base';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { PropertyCard } from '@/screens/Home/components/PropertyCard';
import { useSearchProperties } from '@/hooks/queries/useSearchProperties';
import { useBookings } from '@/hooks/queries/useBookings';
import { applyShadow } from '@/utils/styleUtils';
import { Colors, Typography } from '@/theme/globalStyles';
import LinearGradient from "react-native-linear-gradient";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store/useAuthStore';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375;
const scaledSize = (size: number) => Math.round(size * scale);

const propertyTypes = [
  { id: 'all', label: 'All' },
  { id: 'Individual House / Villa', label: 'Individual House / Villa' },
  { id: 'Apartment', label: 'Apartment' },
  { id: 'Agriculture Land', label: 'Agriculture Land' },
  { id: 'Open Plot', label: 'Open Plot' }
];

interface PropertiesProps {
  navigation: StackNavigationProp<RootStackParamList, 'Properties'>;
  route: RouteProp<RootStackParamList, 'Properties'>;
}

interface Property {
  propertyid: number;
  generallocation: string;
  propertytype: string;
  // Add other property fields as needed
}

const Properties: React.FC<PropertiesProps> = ({ navigation, route }) => {
  const { searchParams } = route.params;
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthStore();
  const { bookProperty } = useBookings();

  const { data: searchResults, isLoading, refetch } = useSearchProperties(searchParams);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const handleSearch = () => {
    if (searchText.trim() === '') {
      return;
    }
  };

  const handleFilter = () => {
    // Implement filter modal/screen navigation here
  };

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

  const filteredResults = useMemo(() => {
    if (!searchResults) return [];

    return searchResults
      .filter((item: Property) => {
        if (!searchText.trim()) return true;
        return item.generallocation.toLowerCase().includes(searchText.toLowerCase().trim());
      })
      .filter((item: Property) => {
        return selectedType === 'all' || item.propertytype.toLowerCase().trim() === selectedType.toLowerCase();
      });
  }, [searchResults, searchText, selectedType]);

  const handleBooking = async (propertyId: number) => {
    if (!user) {
      Toast.show({
        type: 'info',
        text1: 'Login Required',
        text2: 'Please login to book a property',
        position: 'bottom',
      });
      navigation.navigate('Login');
      return;
    }

    try {
      const bookingData = {
        bookedDate: new Date().toISOString(),
        cancelledDate: null,
        isBooked: true,
        isCancelled: false,
        reasonForCancellation: "",
      };

      await bookProperty({
        propertyId,
        bookingData,
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Property booked successfully!',
        position: 'bottom',
      });

      refetch();
    } catch (error) {
      console.error('Booking error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to book property',
        position: 'bottom',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Properties</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="search-outline" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by location..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              placeholderTextColor={Colors.textSecondary}
            />
            {searchText.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchText('')}
                style={styles.clearButton}
              >
                <Icon name="close-circle" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          {/* <TouchableOpacity style={styles.filterIconButton} onPress={handleFilter}>
            <Icon name="options-outline" size={24} color={Colors.primary} />
          </TouchableOpacity> */}
        </View>

        {/* Property Type Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContainer}
        >
          {propertyTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => handleTypeChange(type.id)}
            >
              {selectedType === type.id ? (
                <LinearGradient
                  colors={Colors.gradientPrimary}
                  style={styles.filterButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.activeFilterText}>{type.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.inactiveFilterButton}>
                  <Text style={styles.inactiveFilterText}>{type.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isLoading && !refreshing ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
        ) : (
          <FlatList
            style={styles.listContainer}
            contentContainerStyle={styles.listContentContainer}
            data={filteredResults}
            renderItem={({ item }) => (
              <PropertyCard 
                item={item} 
                navigation={navigation} 
                onRefresh={refetch}
              />
            )}
            keyExtractor={item => item.propertyid.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchText.trim() ? 'No properties found for your search' : 'No properties available'}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  headerContainer: {
    backgroundColor: Colors.backgroundLight,
    zIndex: 1,
    elevation: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  heading: {
    ...Typography.pageHeading,
    marginLeft: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  filterIconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterScrollView: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  filterContainer: {
    paddingHorizontal: 20,
    gap: 12,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  filterButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
    height: '100%',
  },
  inactiveFilterButton: {
    borderRadius: 8,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 120,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterText: {
    color: Colors.textWhite,
    fontWeight: '600',
    fontSize: 14,
    paddingHorizontal: 12,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  inactiveFilterText: {
    color: Colors.textSecondary,
    fontSize: 14,
    paddingHorizontal: 12,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default Properties; 