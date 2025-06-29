// BookingPropertyCard.tsx for the BookingPropertyCard component to display booking details, cancellation options, and status badges.

import React from "react";
import { Pressable, View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { applyShadow } from '@/utils/styleUtils';
import { Colors, Typography } from "@/theme/globalStyles";
import Icon from "react-native-vector-icons/Ionicons";

const BookingPropertyCard = ({ booking, onCancelBooking, navigation }) => {
  const handleCancelPress = () => {
    if (onCancelBooking && booking.propertybookingid) {
      onCancelBooking(booking.propertybookingid);
    }
  };

  const isBookingCancelled = booking.iscancelled;

  return (
    <Pressable 
      style={styles.card} 
      onPress={() => {
        navigation.navigate("PropertyDetails", { propertyId: booking.propertyid });
      }}
    >
      <View style={styles.cardContainer}>
        <View style={styles.details}>
          <View style={styles.imageContainer}>
            <Image
              source={
                booking.attachments?.[0]?.attachmenturl
                  ? { uri: booking.attachments[0].attachmenturl }
                  : require('@/theme/assets/images/logo_4.png')
              }
              style={styles.image}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{booking.propertytitle}</Text>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>{booking.bedrooms} BHK</Text>
              <Text style={styles.subtitle}> • </Text>
              <Text style={styles.subtitle}>{booking.propertytype}</Text>
              <Text style={styles.subtitle}> • </Text>
              <Text style={styles.subtitle}>{booking.generallocation || booking.location}</Text>
            </View>
            
            {/* Booking status badge */}
            <View style={[
              styles.statusBadge, 
              isBookingCancelled ? styles.cancelledBadge : styles.activeBadge
            ]}>
              <Text style={styles.statusText}>
                {isBookingCancelled ? 'Cancelled' : 'Active'}
              </Text>
            </View>
            
            {/* Booking date information */}
            <View style={styles.dateContainer}>
              <Icon name="calendar-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.dateText}>
                Booked on: {new Date(booking.bookeddate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Cancel button - only show if booking is not cancelled */}
        {!isBookingCancelled && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelPress}
          >
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    ...applyShadow(2),
  },
  cardContainer: {
    padding: 12,
  },
  details: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginVertical: 8,
  },
  activeBadge: {
    backgroundColor: Colors.success,
  },
  cancelledBadge: {
    backgroundColor: Colors.error,
  },
  statusText: {
    color: Colors.textWhite,
    fontSize: 12,
    fontWeight: "600",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: a12,
  },
  cancelButtonText: {
    color: Colors.error,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default BookingPropertyCard;