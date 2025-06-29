import React from "react";
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "lucide-react-native";
import { Heart, MapPin } from "lucide-react-native";
import { Colors, Typography, Cards, normalize } from "@/theme/globalStyles";

// Function to format price according to currency type
const formatPrice = (price, currencyType) => {
  if (!price) return "0";
  
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

const PropertyItem = ({ item }) => {
  const navigation = useNavigation();
  
  return (
    <Pressable 
      style={styles.card} 
      onPress={() => {
        navigation.navigate("PropertyDetails", { propertyId: item.propertyid });
      }}
    >
      {/* Ribbon for popular properties */}
      <View style={styles.ribbonContainer}>
        <View style={styles.ribbon}>
          <View style={styles.ribbonBackground}>
            <View style={styles.ribbonContent}>
              <Text style={styles.ribbonStar}>✦</Text>
              <Text style={styles.ribbonText}>Popular</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Image Container - Full Width */}
      <View style={styles.imageContainer}>
        <Image
          source={item?.attachments?.length > 0 
            ? { uri: item.attachments?.[0]?.attachmenturl } 
            : require('@/theme/assets/images/NoImgUploaded.jpeg')}
          style={styles.image}
        />
        
        {/* Status badge */}
        {/* {item.status && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.}</Text>
          </View>
        )} */}
        
      
          <View style={styles.favoriteButton} >
            <Heart size={18} color={item?.favourite_count > 0 ? "red" : "#757575"} />
          <Text style={styles.favoriteCountTag}>{item?.favourite_count} </Text>
          </View>
          
       
      </View>
      
      {/* Content Area */}
      <View style={styles.contentContainer}>
        {/* Top Row - Title */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{item.propertytitle}</Text>
          <Text style={styles.price}>
            {item.currencytype} {formatPrice(item.price, item.currencytype)}
          </Text>
        </View>
        
        {/* Location Row */}
        <View style={styles.locationRow}>
          <MapPin size={14} color={Colors.textSecondary} style={styles.locationIcon} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.location}, {item.city}, {item.state}
          </Text>
        </View>
        
        {/* Tags Row */}
        <View style={styles.tagsRow}>
          {item.bedrooms > 0 && (
            <Text style={styles.tag}>{item.bedrooms}BHK</Text>
          )}
          <Text style={styles.propertyTypeTag}>{item.propertytype}</Text>
         
        </View>
        
        {/* Amenities Row */}
        <View style={styles.amenitiesContainer}>
          {/* Beds */}
          {item.bedrooms > 0 && (
            <View style={styles.amenityItem}>
              <Image
                source={require("../theme/assets/images/Bed.png")}
                style={styles.icon}
              />
              <Text style={styles.infoText}>{item.bedrooms} {item.bedrooms === 1 ? 'Bed' : 'Beds'}</Text>
            </View>
          )}

          {/* Bathrooms */}
          {item.bathrooms > 0 && (
            <View style={styles.amenityItem}>
              <Image
                source={require("../theme/assets/images/Bath.png")}
                style={styles.icon}
              />
              <Text style={styles.infoText}>{item.bathrooms} {item.bathrooms === 1 ? 'Bath' : 'Baths'}</Text>
            </View>
          )}

          {/* Additional Amenities */}
          {item.amenities && (
            <>
              {/* Swimming Pool */}
              {typeof item.amenities === 'string'
                ? item.amenities.includes('Swimming Pool')
                : Array.isArray(item.amenities) && item.amenities.includes('Swimming Pool') && (
                  <View style={styles.amenityItem}>
                    <Icon name="droplets" size={16} color={Colors.textPrimary} style={styles.icon} />
                    <Text style={styles.infoText}>Pool</Text>
                  </View>
                )}

              {/* Gym */}
              {typeof item.amenities === 'string'
                ? item.amenities.includes('Gym')
                : Array.isArray(item.amenities) && item.amenities.includes('Gym') && (
                  <View style={styles.amenityItem}>
                    <Icon name="dumbbell" size={16} color={Colors.textPrimary} style={styles.icon} />
                    <Text style={styles.infoText}>Gym</Text>
                  </View>
                )}

              {/* Parking */}
              {typeof item.amenities === 'string'
                ? item.amenities.includes('Parking')
                : Array.isArray(item.amenities) && item.amenities.includes('Parking') && (
                  <View style={styles.amenityItem}>
                    <Icon name="car" size={16} color={Colors.textPrimary} style={styles.icon} />
                    <Text style={styles.infoText}>Parking</Text>
                  </View>
                )}
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    ...Cards.cardShadow,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  favoriteButton: {
    position: 'absolute',
    padding: 4,
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopStartRadius: 10,
    width: 50,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  favoriteCountTag: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 4,
  },
  contentContainer: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 8,
    backgroundColor: Colors.gray100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  propertyTypeTag: {
    fontSize: 12,
    color: Colors.textSecondary,
    backgroundColor: Colors.gray100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  // Ribbon styles
  ribbonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 20,
  },
  ribbon: {
    position: 'relative',
    width: 100,
    height: 28,
  },
  ribbonBackground: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ribbonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ribbonStar: {
    color: '#8BE8E5',
    fontSize: 14,
    marginRight: 4,
  },
  ribbonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default PropertyItem;