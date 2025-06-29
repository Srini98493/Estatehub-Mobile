import React, { useState, useCallback } from 'react';
import { 
  View, 
  SectionList, 
  StyleSheet, 
  Text, 
  SafeAreaView, 
  StatusBar,
  ActivityIndicator, 
  TouchableOpacity, 
  RefreshControl,
  Platform 
} from 'react-native';
import SearchBar from '@/components/SearchBar';
import PropertyItem from '@/components/PropertyItem';
import { useMostViewedProperties } from '@/hooks/useProperties';
import { Colors, Layout, Typography, Inputs, Cards, normalize } from "@/theme/globalStyles";
import { applyShadow } from '@/utils/styleUtils';
import { useAuthStore } from '@/store/useAuthStore';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

// Add type definitions
interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  // Add other properties as needed
}

interface PropertyType {
  id: string;
  title: string;
  // Add other properties as needed
}

// Use a color constant for home screen status bar
const HOME_STATUS_BAR_COLOR = '#67D3F6';

const HomeScreen = ({ navigation }) => {
    const { data: mostViewedProperties, isLoading, error, refetch } = useMostViewedProperties();
    const { user } = useAuthStore();
    const [filterText, setFilterText] = useState('');
    const [activeType, setActiveType] = useState<string>('All');
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();

    // Set up status bar effect when screen is focused
    useFocusEffect(
        useCallback(() => {
            // Set status bar to blue color with light content when this screen is focused
            StatusBar.setBarStyle('light-content');
            StatusBar.setBackgroundColor(HOME_STATUS_BAR_COLOR);
            
            return () => {
                // No need to reset here as other screens will set their own colors
            };
        }, [])
    );

    // Refresh data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            console.log("HomeScreen focused - refreshing data");
            // Invalidate and refetch relevant queries when the screen comes into focus
            queryClient.invalidateQueries({ queryKey: ['mostViewedProperties'] });
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            
            // Refetch the properties data
            refetch();
            
            return () => {
                // Clean up if needed
            };
        }, [queryClient, refetch])
    );

    // Handle pull-to-refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            // Invalidate and refetch all relevant data
            await queryClient.invalidateQueries({ queryKey: ['mostViewedProperties'] });
            await queryClient.invalidateQueries({ queryKey: ['properties'] });
            await queryClient.invalidateQueries({ queryKey: ['bookings'] });
            await queryClient.invalidateQueries({ queryKey: ['favorites'] });
            await refetch();
        } catch (error) {
            console.error('Error refreshing home screen data:', error);
        } finally {
            setRefreshing(false);
        }
    }, [queryClient, refetch]);

    // Check if the data is available and format it for SectionList
    const formattedData = [
        {
            title: 'Top Properties For Rent',
            data: mostViewedProperties?.t_properties_get_recent_viewed_favourcnt?.rentals || [],
        },
        {
            title: 'Top Properties For Sale',
            data: mostViewedProperties?.t_properties_get_recent_viewed_favourcnt?.sales || [],
        },
    ];

    console.log("formattedData", formattedData);

    const renderItem = ({ item }: { item: Property }) => (
        <View style={styles.itemContainer}>
            <PropertyItem 
                item={item} 
                key={`property-${item?.propertyid}`} // Add explicit key for better re-rendering
            />
        </View>
    );

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    const renderTypeItem = ({ item, index }: { item: PropertyType; index: number }) => (
        <TouchableOpacity
            style={[styles.typeButton, activeType === item.title && styles.activeTypeButton]}
        >
            <Text style={[styles.typeText, activeType === item.title && styles.activeTypeText]}>
                {item.title}
            </Text>
        </TouchableOpacity>
    );

    if (isLoading && !refreshing) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <StatusBar 
                    barStyle="light-content" 
                    backgroundColor={HOME_STATUS_BAR_COLOR}
                    translucent={true}
                />
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <StatusBar 
                    barStyle="light-content" 
                    backgroundColor={HOME_STATUS_BAR_COLOR}
                    translucent={true}
                />
                <Text style={styles.errorText}>Error: {error.message}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar 
                barStyle="light-content" 
                backgroundColor={HOME_STATUS_BAR_COLOR}
                translucent={true}
            />
            
            {/* Use SafeAreaView inside the container to properly handle status bar */}
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.contentContainer}>
                    <SearchBar name={user?.fullname || ""} />
                    
                    <SectionList
                        style={styles.sectionList}
                        sections={formattedData}
                        renderItem={renderItem}
                        renderSectionHeader={renderSectionHeader}
                        keyExtractor={(item) => item?.propertyid?.toString()}
                        stickySectionHeadersEnabled={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[Colors.primary]}
                                tintColor={Colors.primary}
                            />
                        }
                        // Add empty list component
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No properties found</Text>
                            </View>
                        )}
                        // Improve performance with these props
                        initialNumToRender={4}
                        maxToRenderPerBatch={8}
                        windowSize={5}
                        removeClippedSubviews={true}
                        // Add content container style for better padding
                        contentContainerStyle={styles.listContent}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: HOME_STATUS_BAR_COLOR, // Keep the blue background for status bar area
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        // Add padding top to avoid content going under status bar on Android
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    sectionList: {
        flex: 1,
    },
    // Rest of your styles remain the same...
    background: {
        flex: 1,  
        backgroundColor: '#fff',
    },
    heading: {
        ...Typography.pageHeading,
        marginLeft: 16,
        marginVertical: 20,
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: Colors.backgroundLight,
    },
    headerTitle: {
        ...Typography.headerTitle,
        color: Colors.textPrimary,
    },
    searchContainer: {
        paddingHorizontal: 20,
        backgroundColor: Colors.backgroundLight,
    },
    searchWrapper: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    searchInputContainer: {
        ...Inputs.searchContainer,
        backgroundColor: Colors.backgroundLight,
    },
    searchIcon: {
        color: Colors.textLight,
    },
    searchInput: {
        ...Inputs.searchInput,
        color: Colors.textPrimary,
    },
    filterButton: {
        backgroundColor: Colors.backgroundLight,
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterIcon: {
        color: Colors.textLight,
    },
    typeList: {
        marginTop: 15,
    },
    typeListContent: {
        paddingRight: 20,
    },
    typeButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#F5F5F5',
    },
    activeTypeButton: {
        backgroundColor: '#0096C7',
    },
    typeText: {
        color: '#666',
        fontSize: 14,
    },
    activeTypeText: {
        color: '#fff',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
        flexGrow: 1, // Ensure it takes up space when empty
    },
    itemContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: Colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...applyShadow(2, 'rgba(0, 0, 0, 0.25)'),
    },
    sectionTitle: {
        ...Typography.h2,
        marginLeft: 16,
        marginVertical: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        zIndex: 1000,
    },
    viewAllText: {
        color: Colors.primary,
    },
    propertyCard: {
        ...Cards.propertyCard,
    },
    propertyInfo: {
        backgroundColor: Colors.backgroundLight,
    },
    propertyTitle: {
        ...Typography.h3,
        color: Colors.textPrimary,
    },
    propertyLocation: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    propertyPrice: {
        ...Typography.h3,
        color: Colors.primary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backgroundLight,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        height: 200,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
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
        marginBottom: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: Colors.textWhite,
        fontSize: 16,
        fontWeight: '600',
    },
    listContainer: {
        backgroundColor: Colors.backgroundLight,
    },
    tabContainer: {
        borderBottomColor: Colors.border,
    },
    tab: {
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: Colors.primary,
    },
    tabText: {
        color: Colors.textSecondary,
    },
    activeTabText: {
        color: Colors.primary,
    },
});

export default HomeScreen;