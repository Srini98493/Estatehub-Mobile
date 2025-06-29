import React, { useMemo } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { Text } from "@/components/base";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useAuthStore } from "@/store/useAuthStore";
import { MyProperty } from "@/hooks/queries/useMyProperties";
import { formatDate } from "@/utils/dateUtils";
import { Colors, Typography, Cards, normalize } from "@/theme/globalStyles";
import { api } from '@/services/api/apiConfig';
import { API_ENDPOINTS } from '@/services/api/endpoints';

// Function to format price according to currency type
const formatPrice = (price, currencyType) => {
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

// Helper function to parse amenities
const parseAmenities = (amenitiesString: string) => {
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

interface PropertyCardProps {
  item: MyProperty;
  navigation: any;
  onDelete?: (propertyId: number) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  item,
  navigation,
  onDelete,
}) => {
  const { isAuthenticated } = useAuthStore();

  // Parse amenities from property data
  const parsedAmenities = useMemo(() => {
    if (!item?.amenities) return [];
    return parseAmenities(item.amenities);
  }, [item?.amenities]);

  // Check if specific amenities exist
  const hasSwimmingPool = useMemo(() => parsedAmenities.includes('Swimming Pool'), [parsedAmenities]);
  const hasGym = useMemo(() => parsedAmenities.includes('Gym'), [parsedAmenities]);
  const hasParking = useMemo(() => parsedAmenities.includes('Parking'), [parsedAmenities]);
  const hasSecurity = useMemo(() => parsedAmenities.includes('Security'), [parsedAmenities]);
  const hasGarden = useMemo(() => parsedAmenities.includes('Garden'), [parsedAmenities]);
  
  // Handle property deletion with API call
  const handleDelete = () => {
    Alert.alert(
      "Delete Property",
      "Are you sure you want to delete this property? The property is still under review!",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              // Show loading alert
             
              
              // Make API call to delete property using axios
              await api.delete(API_ENDPOINTS.PROPERTIES.delete(item.propertyid));
              
              // Dismiss loading alert (if your Alert has a dismiss method)
              // Alert.dismiss(); // Note: React Native's Alert doesn't have a dismiss method by default
              
              // Show success alert
              Alert.alert(
                "Success",
                "Property has been successfully deleted",
                [{ 
                  text: "OK",
                  onPress: () => {
                    // Call the onDelete callback if provided
                    if (onDelete) {
                      onDelete(item.propertyid);
                    }
                  } 
                }]
              );
              
            } catch (error) {
              console.error("Error deleting property:", error);
              
              // Show error alert
              Alert.alert(
                "Error",
                "Failed to delete property. Please try again later.",
                [{ text: "OK" }]
              );
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.propertyid })}
    >
      {/* Image container with status badge */}
      <View style={styles.imageContainer}>
        <Image
          source={item?.attachments?.length > 0 ? { uri: item?.attachments?.[0]?.attachmenturl } : require('@/theme/assets/images/NoImgUploaded.jpeg')}
          style={styles.propertyImage}
        />
        
        {/* Status Badge */}
        <View style={[
          styles.statusBadge,
          item.isapproved ? styles.approvedBadge : styles.pendingBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.isapproved ? styles.approvedText : styles.pendingText
          ]}>
            {item.isapproved ? 'Available' : 'Approval Pending'}
          </Text>
        </View>
        
        {/* Action buttons */}
        {!item.isapproved && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate("AddProperty", { propertyId: item.propertyid, isEdit: true })}
            >
              <Icon name="pencil-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Icon name="trash-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Property details */}
      <View style={styles.detailsContainer}>
        {/* Property Title */}
        <Text style={styles.title} numberOfLines={2}>
          {item.propertytitle}
        </Text>
        
        {/* Location */}
        <View style={styles.locationContainer}>
          <Icon name="location-outline" size={14} color="#666" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.city}{item.state ? `, ${item.state}` : ''}
          </Text>
        </View>
        
        {/* Property Type & Features Row */}
        <View style={styles.featuresRow}>
          <View style={styles.propertyTypeChip}>
            <Text style={styles.propertyTypeText}>
              {item.propertytype}
            </Text>
          </View>
          
          {item.bedrooms > 0 && (
            <View style={styles.featureChip}>
              <Text style={styles.featureText}>{item.bedrooms} BHK</Text>
            </View>
          )}
        </View>
        
        {/* Amenities Icons Row */}
        <View style={styles.amenitiesRow}>
          {item.bedrooms > 0 && (
            <View style={styles.amenityItem}>
              <Icon name="bed-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.amenityText}>{item.bedrooms} Beds</Text>
            </View>
          )}
          
          {item.bathrooms > 0 && (
            <View style={styles.amenityItem}>
              <Icon name="water-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.amenityText}>{item.bathrooms} Baths</Text>
            </View>
          )}
          
          {/* Show only key amenities like in the image */}
          {hasGym && (
            <View style={styles.amenityItem}>
              <Icon name="barbell-outline" size={14} color={Colors.textSecondary} />
            </View>
          )}
          
          {hasSwimmingPool && (
            <View style={styles.amenityItem}>
              <Icon name="water" size={14} color={Colors.textSecondary} />
            </View>
          )}
        </View>
        
        {/* Price with currency-specific formatting */}
        <Text style={styles.price}>
          {item?.currencytype} {formatPrice(item?.price, item?.currencytype)}
        </Text>
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
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  propertyImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  approvedBadge: {
    backgroundColor: 'rgba(82, 196, 26, 0.9)',
  },
  pendingBadge: {
    backgroundColor: 'rgba(250, 173, 20, 0.9)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  approvedText: {
    color: '#FFFFFF',
  },
  pendingText: {
    color: '#FFFFFF',
  },
  actionsContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0096C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  featuresRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  propertyTypeChip: {
    backgroundColor: '#E6F7FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  propertyTypeText: {
    fontSize: 13,
    color: '#0096C7',
    fontWeight: '500',
  },
  featureChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featureText: {
    fontSize: 13,
    color: '#666',
  },
  amenitiesRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0096C7',
  },
});

export default PropertyCard;