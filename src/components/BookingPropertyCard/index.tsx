import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/base';
import { Colors, Typography, normalize } from '@/theme/globalStyles';
import { applyShadow } from '@/utils/styleUtils';
import LinearGradient from 'react-native-linear-gradient';

interface BookingPropertyCardProps {
  booking: {
    bookingid: number;
    property_details: {
      propertyid: number;
      propertytitle: string;
      generallocation: string;
      price: number;
      bedrooms: number;
      bathrooms: number;
      propertyarea: number;
      propertyimages: Array<{ imageurl: string }>;
    };
  };
  onCancelBooking: (bookingId: number) => void;
}

const BookingPropertyCard: React.FC<BookingPropertyCardProps> = ({ booking, onCancelBooking }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: booking.property_details?.propertyimages[0]?.imageurl }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{booking.property_details?.propertytitle}</Text>
        <Text style={styles.location}>{booking.property_details?.generallocation}</Text>
        <Text style={styles.price}>₹{booking.property_details?.price}</Text>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>
            {booking.property_details?.bedrooms} Beds • {booking.property_details?.bathrooms} Baths
          </Text>
          <Text style={styles.detailText}>
            {booking.property_details?.propertyarea} sq.ft
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={() => {/* Handle support */}}
          >
            <Text style={styles.supportButtonText}>Support</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => onCancelBooking(booking.bookingid)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...applyShadow(2),
  },
  imageContainer: {
    height: 200,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    ...Typography.h3,
    marginBottom: 4,
  },
  location: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  price: {
    ...Typography.h2,
    color: Colors.primary,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  supportButton: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  supportButtonText: {
    ...Typography.buttonText,
    color: Colors.primary,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.error,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.buttonText,
    color: Colors.textWhite,
  },
});

export default BookingPropertyCard; 