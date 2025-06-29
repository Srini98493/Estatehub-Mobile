import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import { Text } from "@/components/base";
import Icon from "react-native-vector-icons/Ionicons";
import { usePropertyDetail } from "@/hooks/useProperties";
import Carousel from "react-native-snap-carousel";
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Layout, Typography, Buttons, normalize } from "@/theme/globalStyles";
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { applyShadow } from '@/utils/styleUtils';
import { useAuthStore } from "@/store/useAuthStore";
import { useBookings } from "@/hooks/queries/useBookings";
import Toast from 'react-native-toast-message';
import { api } from "@/services/api/apiConfig";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { useFavorites } from "@/hooks/queries/useFavorites";
import { useFocusEffect } from "@react-navigation/native";
import { formatDate } from "@/utils/dateUtils";

interface PropertyDetailsParams {
  propertyId: string;
}

type PropertyDetailsProps = {
  navigation: NavigationProp<ParamListBase>;
  route: {
    params: PropertyDetailsParams;
  };
};

// Define types for property data
interface Attachment {
  attachmenturl: string;
}

const { width: viewportWidth } = Dimensions.get("window");
const scaleFactor = Platform.OS === 'ios' ? .95 : 0.90;
const ITEM_WIDTH = viewportWidth * scaleFactor;
const ITEM_HEIGHT = 250;


// Helper function to parse amenities
const parseAmenities = (amenitiesString) => {
  if (!amenitiesString) return [];

  try {
    // First, try to parse it as JSON
    if (typeof amenitiesString === 'string') {
      const parsed = JSON.parse(amenitiesString);

      // Handle case where it's {"amenities": ["Swimming Pool", "Gym"]} format
      if (parsed.amenities && Array.isArray(parsed.amenities)) {
        return parsed.amenities;
      }

      // Handle case where it's {"amenities": "Swimming Pool"} format (single string)
      if (parsed.amenities && typeof parsed.amenities === 'string') {
        return [parsed.amenities];
      }

      // Handle case where it's already an array
      if (Array.isArray(parsed)) {
        return parsed;
      }

      // Handle edge case where it's just a string that isn't in array format
      if (typeof parsed === 'string') {
        return [parsed];
      }
    }

    // If it's already an array, return it
    if (Array.isArray(amenitiesString)) {
      return amenitiesString;
    }

    return [];
  } catch (error) {
    // If JSON parsing fails, try the original regex approach for string
    if (typeof amenitiesString === 'string') {
      return amenitiesString
        .replace(/[{}"]/g, '') // Remove curly braces and quotes
        .split(',') // Split by comma
        .map(amenity => amenity.trim().replace(/'/g, '"')) // Trim whitespace and replace single quotes
        .filter(amenity => amenity !== ''); // Remove empty entries
    }

    return [];
  }
};
const formatPrice = (price: string | number, currencyType: any) => {
  if (!price && price !== 0) return "0";

  // Convert price to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Format based on currency type
  switch (currencyType) {
    case 'INR':
      // Indian format: 1,23,456.78
      return numericPrice.toLocaleString('en-IN');
    case 'USD':
    case 'EUR':
    case 'GBP':
    default:
      // Western format: 123,456.78
      return numericPrice.toLocaleString('en-US');
  }
};
const PropertyDetailsScreen: React.FC<PropertyDetailsProps> = ({ route, navigation }) => {
  const { propertyId } = route.params;
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeSlide, setActiveSlide] = useState(0);

  // Get favorites hook
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isAddingFavorite,
    isRemovingFavorite,
  } = useFavorites();

  // Get bookings hook
  const {
    bookProperty,
    isBooking,
    isBooked,
    bookings
  } = useBookings();

  // Fetch the property details from the API usePropertyDetails with stronger caching controls
  const { data: property, isLoading, error, refetch } = usePropertyDetail(propertyId, {
    // Decrease staleTime to refresh data more frequently
    staleTime: 10 * 1000, // 10 seconds
    // Force refetch on window focus
    refetchOnWindowFocus: true,
  });

  // State variables for local tracking
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPropertyBooked, setIsPropertyBooked] = useState(false);

  // Create a force refresh function to ensure we get the latest data
  const forceRefresh = useCallback(async () => {
    // Remove console.log to reduce noise
    // Invalidate the cache for this specific property
    queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
    // Then refetch
    await refetch();
  }, [queryClient, propertyId, refetch]);

  // Parse amenities from property data
  const parsedAmenities = useMemo(() => {
    if (!property?.amenities) return [];
    return parseAmenities(property.amenities);
  }, [property?.amenities]);

  // Check if specific amenities exist
  const hasSwimmingPool = useMemo(() => parsedAmenities.includes('Swimming Pool'), [parsedAmenities]);
  const hasGym = useMemo(() => parsedAmenities.includes('Gym'), [parsedAmenities]);
  const hasParking = useMemo(() => parsedAmenities.includes('Parking'), [parsedAmenities]);
  const hasSecurity = useMemo(() => parsedAmenities.includes('Security'), [parsedAmenities]);
  const hasGarden = useMemo(() => parsedAmenities.includes('Garden'), [parsedAmenities]);

  // Check if the current user is the owner of this property
  const isUserOwnProperty = useMemo(() => {
    if (!user || !property) return false;

    // Check if user ID matches property user ID
    // Make sure to handle both formats (user.id or user.userid)
    const currentUserId = user.id || user.userid;
    return currentUserId === property.userid;
  }, [user, property]);

  // Helper function to check if property is in favorites
  const checkPropertyFavoriteStatus = useCallback(() => {
    if (!favorites || !propertyId) return false;

    // Convert propertyId to number if it's a string
    const propId = typeof propertyId === 'string'
      ? parseInt(propertyId, 10)
      : propertyId;

    // Check if favorites is an array first
    const favoritesArray = Array.isArray(favorites) ? favorites : favorites?.data;
    
    if (!favoritesArray || !Array.isArray(favoritesArray)) return false;

    // Check if property exists in favorites
    return favoritesArray.some(
      favorite => favorite?.property_details?.propertyid === propId
    );
  }, [favorites, propertyId]);

  // Check if property is booked
  const checkIsPropertyBooked = useCallback(() => {
    if (!propertyId) return false;

    // Convert propertyId to number if it's a string
    const propId = typeof propertyId === 'string'
      ? parseInt(propertyId, 10)
      : propertyId;

    return isBooked(propId);
  }, [propertyId, isBooked, bookings]);

  // Refresh the favorite status when the component is focused
  useFocusEffect(
    useCallback(() => {
      console.log('PropertyDetails screen focused - refreshing data');
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.gray50);
      
      // Create a flag to track if data was refreshed
      let hasRefreshed = false;
      
      const refreshData = async () => {
        if (hasRefreshed) return;
        hasRefreshed = true;
        
        // Force a full data refresh when screen is focused
        await forceRefresh();

        // Update favorite status
        const favoriteStatus = checkPropertyFavoriteStatus();
        setIsFavorite(favoriteStatus);

        // Check booking status
        const bookingStatus = checkIsPropertyBooked();
        setIsPropertyBooked(bookingStatus);

        // Debug info - only log once
        console.log(`Property ${propertyId}: isFavorite=${favoriteStatus}, isBooked=${bookingStatus}, isUserOwn=${isUserOwnProperty}`);
      };
      
      refreshData();
      
      // Cleanup function
      return () => {
        hasRefreshed = false;
      };
    }, [propertyId, checkPropertyFavoriteStatus, checkIsPropertyBooked, isUserOwnProperty, forceRefresh])
  );

  // Update local state when property data changes
  useEffect(() => {
    if (property) {
      // Use the function to check current favorite status
      const favoriteStatus = checkPropertyFavoriteStatus();
      setIsFavorite(favoriteStatus);

      // Check booking status
      const bookingStatus = checkIsPropertyBooked();
      setIsPropertyBooked(bookingStatus);
    }
  }, [property, propertyId, checkPropertyFavoriteStatus, checkIsPropertyBooked]);

  const showLoginToast = () => {
    Toast.show({
      type: 'info',
      text1: 'Login Required',
      text2: 'Please login to continue',
      position: 'bottom',
      visibilityTime: 3000,
    });
    navigation.navigate('Auth');
  };

  const handleBookNow = async () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      showLoginToast();
      return;
    }

    // If property is already booked, navigate to bookings
    if (isPropertyBooked) {
      Toast.show({
        type: 'info',
        text1: 'Already Booked',
        text2: 'This property is already in your bookings',
        position: 'bottom',
        visibilityTime: 2000,
      });
      navigation.navigate('Bookings');
      return;
    }

    // Don't proceed if booking is in progress
    if (isBooking) return;

    // Double-check if property is already booked
    if (checkIsPropertyBooked()) {
      setIsPropertyBooked(true);
      Toast.show({
        type: 'info',
        text1: 'Already Booked',
        text2: 'This property is already in your bookings',
        position: 'bottom',
        visibilityTime: 2000,
      });
      return;
    }

    try {
      await bookProperty({
        propertyId: Number(propertyId),
        bookingData: {
          bookedDate: new Date().toISOString(),
          cancelledDate: null,
          isBooked: true,
          isCancelled: false,
          reasonForCancellation: '',
        },
      });

      // Update local state immediately
      setIsPropertyBooked(true);

      // Refresh data
      refetch();
      queryClient.invalidateQueries({ queryKey: ['bookings'] });

      Toast.show({
        type: 'success',
        text1: 'Property Booked',
        text2: 'Your booking has been confirmed',
        position: 'bottom',
        visibilityTime: 2000,
      });

      // Navigate to bookings page
      navigation.navigate('Bookings');
    } catch (error: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Booking Failed',
        text2: error instanceof Error ? error.message : 'Failed to book property',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };

  const toggleFavorite = async () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      showLoginToast();
      return;
    }

    // Don't proceed if already adding/removing favorite
    if (isAddingFavorite || isRemovingFavorite) return;

    try {
      // Toggle favorite status
      if (isFavorite) {
        await removeFavorite(Number(propertyId));
        setIsFavorite(false);
      } else {
        await addFavorite(Number(propertyId));
        setIsFavorite(true);
      }

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: isFavorite ? 'Removed from favorites' : 'Added to favorites',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } catch (error: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to update favorites',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };

  // Format date for display
  const formatAvailableDate = (dateString: string) => {
    if (!dateString) return 'Not specified';

    try {
      return formatDate(dateString, 'MMM DD, YYYY');
    } catch (e) {
      return dateString;
    }
  };

  // Determine if booking and favorite buttons should be disabled
  const shouldDisableBooking = useMemo(() => {
    return (
      isBooking ||
      isPropertyBooked ||
      property?.isbooked ||
      !property?.isapproved ||
      isUserOwnProperty
    );
  }, [isBooking, isPropertyBooked, property, isUserOwnProperty]);

  const shouldDisableFavorite = useMemo(() => {
    return (
      isAddingFavorite ||
      isRemovingFavorite ||
      !property?.isapproved ||
      isUserOwnProperty
    );
  }, [isAddingFavorite, isRemovingFavorite, property, isUserOwnProperty]);

  // Get button text
  const getBookButtonText = () => {
    if (isUserOwnProperty) return 'Your Property';
    if (!property?.isapproved) return 'Awaiting Approval';
    if (isBooking) return 'Booking...';
    if (property?.isbooked || isPropertyBooked) return 'Booked';
    return 'Book Now';
  };

  // Handle edit property
  const handleEditProperty = () => {
    // Navigate to edit screen
    navigation.navigate("AddProperty", {
      propertyId: property.propertyid,
      isEdit: true
    });

    // Set up a listener for when we return to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      // Force refresh when coming back from edit screen
      setTimeout(() => {
        forceRefresh();
      }, 300); // Small delay to ensure navigation is complete

      // Remove the listener to prevent memory leaks
      unsubscribe();
    });
  };

  // Check if property and attachments are defined
  const attachments = property?.attachments || [];

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItemContainer}>
      <Image
        source={{ uri: item.attachmenturl }}
        style={styles.propertyImage}
      />
    </View>
  );

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {attachments.map((_: any, index: React.Key | null | undefined) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeSlide && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error instanceof Error ? error.message : 'Failed to load property'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  console.log(property, "property in PropertyDetailsScreen");
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          {/* Approval Status Badge */}
          {isUserOwnProperty && (
            property.isapproved ? (
              <View style={styles.approvedBadge}>
                <Text style={styles.approvedText}>Approved</Text>
              </View>
            ) : (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Approval Pending</Text>
              </View>
            )
          )}
        </View>

        {/* Image Carousel */}
        {attachments.length > 0 ? (
          <View style={styles.carouselContainer}>
            <Carousel
              data={attachments}
              renderItem={renderCarouselItem}
              sliderWidth={viewportWidth}
              itemWidth={viewportWidth}
              layout="default"
              loop={true}
              inactiveSlideScale={0.95}
              inactiveSlideOpacity={0.7}
              activeSlideAlignment="start"
              containerCustomStyle={styles.carousel}
              contentContainerCustomStyle={styles.carouselContent}
              useScrollView={true}
              vertical={false}
              onSnapToItem={(index) => setActiveSlide(index)}
            />
            {renderPagination()}

            {/* Owner Badge if it's own property */}
            {isUserOwnProperty && (
              <View style={styles.ownerBadge}>
                <Text style={styles.ownerText}>Your Property</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.carouselContainer}>
            <Image source={require('@/theme/assets/images/NoImgUploaded.jpeg')} style={styles.defaultImage} />

            {/* Owner Badge if it's own property */}
            {isUserOwnProperty && (
              <View style={styles.ownerBadge}>
                <Text style={styles.ownerText}>Your Property</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.content}>
         
          {property?.propertycategoryname && (
            <View style={styles.categoryContainer}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{property?.propertycategoryname}</Text>
              </View>
            </View>
          )}

          <Text style={styles.title}>{property?.propertytitle}</Text>

          {/* Location */}
          <View style={styles.locationCard}>
            <Icon name="location" size={16} color="#000000" />
            <Text style={styles.locationText}>
              {property?.address}, {property?.city || ''} {property?.state || ''}
            </Text>
          </View>

          {/* Show Edit Button for Own Property */}
          {isUserOwnProperty && !property?.isapproved && (
            <View style={styles.ownerActionsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditProperty}
              >
                <LinearGradient
                  colors={Colors.gradientSecondary || ['#E6F7FF', '#0096C7']}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.editButtonContent}>
                    <Icon name="pencil" size={18} color={Colors.textWhite} />
                    <Text style={styles.editButtonText}>Edit Property</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Property Details Card */}
          <View style={styles.propertyDetailsCard}>
            {/* Row 1: Property Type and BHK */}
            <View style={styles.detailRow}>
              <View style={[styles.detailItem, { marginRight: 10 }]}>
                <Text style={styles.detailLabel}>Property Type</Text>
                <Text style={styles.detailValue} numberOfLines={2} ellipsizeMode="tail">
                  {property?.propertytype}
                </Text>
              </View>

              {property?.bedrooms > 0 && (
                <View style={[styles.detailItem, { marginLeft: 10 }]}>
                  <Text style={styles.detailLabel}>Bedrooms</Text>
                  <Text style={[styles.detailValue,{ marginLeft: 20,justifyContent:"center" }]} numberOfLines={1} ellipsizeMode="tail">
                    {property?.bedrooms} 
                  </Text>
                </View>
              )}

              {property?.bathrooms > 0 && (
                <View style={[styles.detailItem]}>
                  <Text style={styles.detailLabel}>Bathrooms</Text>
                  <Text style={[styles.detailValue, { marginLeft: 20,justifyContent:"center" }]} numberOfLines={1} ellipsizeMode="tail">
                    {property?.bathrooms}
                  </Text>
                </View>
              )}
            </View>

            {/* Row 2: Posted By and Date Available */}
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Posted By</Text>
                <Text style={styles.detailValue}>{property?.postedby || 'Not specified'}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Available From</Text>
                <Text style={styles.detailValue}>{formatAvailableDate(property?.availabledate)}</Text>
              </View>
            </View>

            {/* Row 3: Area and Status */}
            <View style={styles.detailRow}>
              {property?.area && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Area</Text>
                  <Text style={styles.detailValue}>{property?.area} </Text>
                </View>
              )}
            </View>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>
              {property?.currencytype} {formatPrice(property?.price, property?.currencytype)}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {property?.propertydescription || 'No description available for this property.'}
            </Text>
          </View>

          {/* Amenities Section */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {/* Only render amenities that exist */}
            {/* {property?.bedrooms > 0 && (
              <View style={styles.amenityItem}>
                <Icon name="bed-outline" size={24} color={Colors.textSecondary} />
                <Text style={styles.amenityLabel}>
                  {property?.bedrooms} {property?.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </Text>
              </View>
            )} */}

            {/* {property?.bathrooms > 0 && (
              <View style={styles.amenityItem}>
                <Icon name="water-outline" size={24} color={Colors.textSecondary} />
                <Text style={styles.amenityLabel}>
                  {property?.bathrooms} {property?.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                </Text>
              </View>
            )} */}

            {hasSwimmingPool && (
              <View style={styles.amenityItem}>
                <Icon name="water" size={24} color={Colors.textSecondary} />
                <Text style={styles.amenityLabel}>
                  Swimming Pool
                </Text>
              </View>
            )}

            {hasGym && (
              <View style={styles.amenityItem}>
                <Icon name="barbell-outline" size={24} color={Colors.textSecondary} />
                <Text style={styles.amenityLabel}>
                  Gym
                </Text>
              </View>
            )}

            {hasParking && (
              <View style={styles.amenityItem}>
                <Icon name="car-outline" size={24} color={Colors.textSecondary} />
                <Text style={styles.amenityLabel}>
                  Parking
                </Text>
              </View>
            )}

            {hasSecurity && (
              <View style={styles.amenityItem}>
                <Icon name="shield-checkmark-outline" size={24} color={Colors.textSecondary} />
                <Text style={styles.amenityLabel}>
                  Security
                </Text>
              </View>
            )}

            {hasGarden && (
              <View style={styles.amenityItem}>
                <Icon name="leaf-outline" size={24} color={Colors.textSecondary} />
                <Text style={styles.amenityLabel}>
                  Garden
                </Text>
              </View>
            )}

            {/* If no amenities are found, show a message */}
            {
              !hasSwimmingPool && !hasGym && !hasParking &&
              !hasSecurity && !hasGarden && (
                <Text style={styles.noAmenitiesText}>No amenities listed for this property</Text>
              )}
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar - COMPLETELY HIDE for user's own properties */}
      {!isUserOwnProperty && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.bookNowButton,
              shouldDisableBooking && styles.buttonDisabled
            ]}
            onPress={handleBookNow}
            disabled={shouldDisableBooking}
          >
            <LinearGradient
              colors={Colors.gradientPrimary}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.bookNowText}>{getBookButtonText()}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.favoriteButton,
              isFavorite && styles.favoriteButtonActive,
              shouldDisableFavorite && styles.buttonDisabled
            ]}
            onPress={toggleFavorite}
            disabled={shouldDisableFavorite}
          >
            <Icon
              name={isFavorite ? "heart" : "heart-outline"}
              size={28}
              color={Colors.error}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    ...Layout.container,
    backgroundColor: Colors.backgroundLight,
    marginTop:Platform.OS === 'android' ? 24 :0
    
  },
  scrollView: {
    backgroundColor: Colors.backgroundLight,
  },
  scrollViewContent: {
    paddingBottom: Platform.OS === 'ios' ? 80 : 80,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: Colors.backgroundLight,
    padding: 7,
    borderRadius: 10,
    marginLeft:Platform.OS === 'ios' ? -10 : -20
  },
  approvedBadge: {
    backgroundColor: 'rgba(26, 196, 142, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  approvedText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  pendingBadge: {
    backgroundColor: 'rgba(250, 173, 20, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  pendingText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode:"cover",
    marginLeft:Platform.OS === 'ios' ? 16 : 0,
   
  },
  content: {
    padding: 20,
    
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 15,
  },
  locationCard: {
    backgroundColor: '#F5F8FF',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 20 : 10,
    marginBottom: 20,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#000000',
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '500',
  },
  propertyDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 5,
    ...applyShadow(1),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    
    
  },
  bookedStatus: {
    color: Colors.error,
  },
  availableStatus: {
    color: Colors.success,
  },
  priceSection: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: Colors.textPrimary,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'flex-start',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 15,
  },
  amenityItem: {
    alignItems: "center",
    width: '30%',
    backgroundColor: Colors.gray50,
    padding: 12,
    marginHorizontal: '1.5%',
    marginBottom: 12,
    borderRadius: 10,
  },
  amenityLabel: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  noAmenitiesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    width: '100%',
    padding: 10,
  },
  bottomSpacing: {
    height: 100,
  },
  carouselContainer: {
    marginTop: 20,
    position: 'relative',
  },
  carousel: {
    flexGrow: 0,
  },
  carouselContent: {
    paddingHorizontal: 10,
  },
  carouselItemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    paddingHorizontal: 5,
  },
  bottomBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? -25 : 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: Colors.backgroundLight,
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 34 : 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...applyShadow(3),
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  bookNowButton: {
    flex: 0.90,
    height: 50,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookNowText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...applyShadow(1),
  },
  favoriteButtonActive: {
    backgroundColor: '#FFE6E6',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.backgroundLight,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  paginationDotActive: {
    backgroundColor: Colors.backgroundLight,
    opacity: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  // Additional styles for the owner actions
  ownerActionsContainer: {
    marginBottom: 15,
  },
  editButton: {
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
  },
  editButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  ownerBadge: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0, 150, 199, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    zIndex: 2,
  },
  ownerText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  defaultImage: {
    width: "100%",
    height: ITEM_HEIGHT,
    resizeMode: Platform.OS==="ios"?"cover":"contain"
  },
  // Enhanced Magic Bricks-like category styling
  categoryContainer: {
    marginBottom: 10,
    marginTop: 0,
  },
  categoryBadge: {
    backgroundColor: '#FF5A5F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 5,
    ...applyShadow(2),
  },
  categoryText: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },

});
export default PropertyDetailsScreen;