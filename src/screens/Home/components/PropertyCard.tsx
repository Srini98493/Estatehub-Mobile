import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "@/components/base";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useAuthStore } from "@/store/useAuthStore";
import { Colors, Typography, Cards, normalize } from "@/theme/globalStyles";
import Toast from 'react-native-toast-message';
import { useFavorites } from '@/hooks/queries/useFavorites';
import { useBookings } from '@/hooks/queries/useBookings';
import type { PropertyDetails } from '@/hooks/queries/useFavorites';

interface PropertyCardProps {
  item: PropertyDetails & {
    is_favourite?: boolean;
    isbooked?: boolean;
  };
  navigation: any;
  onRefresh?: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  item,
  navigation,
  onRefresh,
}) => {
  const { isAuthenticated } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(item.is_favourite || false);
  const [isPropertyBooked, setIsPropertyBooked] = useState(item.isbooked || false);

  const { addFavorite: addToFavorites, removeFavorite: removeFromFavorites, isAddingFavorite, isRemovingFavorite } = useFavorites();
  const { bookProperty, isBooking, isBooked } = useBookings();

  useEffect(() => {
    // Update local state when item props change
    setIsFavorite(item.is_favourite || false);
    setIsPropertyBooked(item.isbooked || false);
  }, [item.is_favourite, item.isbooked]);

  const showLoginToast = () => {
    Toast.show({
      type: 'info',
      text1: 'Please Login',
      text2: 'Please login to continue',
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      showLoginToast();
      return;
    }

    if (isAddingFavorite || isRemovingFavorite) return;

    try {
      if (isFavorite) {
        await removeFromFavorites(item.propertyid);
      } else {
        await addToFavorites(item.propertyid);
      }
      setIsFavorite(prev => !prev);
      Toast.show({
        type: 'success',
        text1: isFavorite ? 'Removed from favorites' : 'Added to favorites',
        position: 'bottom',
        visibilityTime: 2000,
      });
      onRefresh?.();
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

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      showLoginToast();
      return;
    }

    if (isPropertyBooked) {
      navigation.navigate('Bookings');
      return;
    }

    // Check if booking is in progress
    if (isBooking) return;

    // Check if property is already booked using the hook function
    if (isBooked(item.propertyid)) {
      setIsPropertyBooked(true);
      return;
    }

    try {
      await bookProperty({
        propertyId: item.propertyid,
        bookingData: {
          bookedDate: new Date().toISOString(),
          cancelledDate: null,
          isBooked: true,
          isCancelled: false,
          reasonForCancellation: '',
        },
      });
      setIsPropertyBooked(true);
      Toast.show({
        type: 'success',
        text1: 'Property Booked',
        text2: 'Your booking has been confirmed',
        position: 'bottom',
        visibilityTime: 2000,
      });
      onRefresh?.();
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
  
  // Determine if the button should be disabled
  const isBookButtonDisabled = isBooking || isPropertyBooked || isBooked(item.propertyid);

  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.propertyid })} activeOpacity={0.8}>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image
            source={item?.attachments?.length > 0 ? { uri: item?.attachments?.[0]?.attachmenturl } : require('@/theme/assets/images/logo_4.png')}
            style={styles.propertyImage}
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{item.propertytitle}</Text>
          </View>
          
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>{item.bedrooms} BHK</Text>
            <Text style={styles.detailText}>{item.propertytype}</Text>
            <Text style={styles.detailText}>{item.generallocation}</Text>
           
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {item.currencytype} {item.price.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFavorite && styles.favoriteButtonActive,
            (isAddingFavorite || isRemovingFavorite) && styles.buttonDisabled
          ]}
          onPress={handleFavorite}
          disabled={isAddingFavorite || isRemovingFavorite}
        >
          <Icon 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={20} 
            color={Colors.error} 
          />
          <Text style={styles.favoriteButtonText}>
            {isAddingFavorite || isRemovingFavorite ? 'Updating...' : isFavorite ? 'Unsave' : 'Save'}
          </Text>
        </TouchableOpacity>
        <LinearGradient
          colors={Colors.gradientPrimary}
          style={[styles.bookNowButton, isBookButtonDisabled && styles.buttonDisabled]}
        >
          <TouchableOpacity
            onPress={handleBookNow}
            style={styles.bookNowButtonContent}
            disabled={isBookButtonDisabled}
          >
           
            <Text style={styles.bookNowButtonText}>
              {isBooking ? 'Booking...' : isPropertyBooked || isBooked(item.propertyid) ? 'Booked' : 'Book Now'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...Cards.cardShadow,
  },
  cardContent: {
    padding: 12,
    flexDirection: "row",
    gap: 12,
  },
  imageContainer: {
    width: 100,
  },
  propertyImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  detailsRow: {
    flexDirection: "column",
    marginTop: 4,
    flexWrap: 'wrap',
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  dot: {
    marginHorizontal: 4,
    color: Colors.textSecondary,
  },
  priceContainer: {
    marginTop: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: '#0096C7',
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 12,
  },
  favoriteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    padding: 12,
  },
  favoriteButtonText: {
    marginLeft: 8,
    color: Colors.error,
    fontWeight: "bold",
  },
  bookNowButton: {
    flex: 1,
  },
  bookNowButtonContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  bookNowButtonText: {
    color: Colors.textWhite,
    fontWeight: "bold",
  },
  statusBadge: {
    position: "absolute",
    left: 12,
    bottom: 12,
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: Colors.textWhite,
    fontWeight: "500",
  },
  propertyName: {
    color: Colors.textPrimary,
  },
  propertyLocation: {
    color: Colors.textSecondary,
  },
  propertyPrice: {
    color: Colors.textSecondary,
  },
  propertyPriceHighlight: {
    color: Colors.primary,
  },
  statusChip: {
    backgroundColor: Colors.error,
  },
  featuredChip: {
    backgroundColor: Colors.warning,
  },
  featuredText: {
    color: Colors.textPrimary,
  },
  favoriteButtonActive: {
    backgroundColor: '#FFE6E6',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default PropertyCard;