import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
  Platform,
  StatusBar
} from 'react-native';
import { Text } from '@/components/base';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import BookingPropertyCard from '@/components/BookingPropertyCard';
import { useBookings } from '@/hooks/queries/useBookings';
import AuthCheck from '@/components/AuthCheck';
import { useAuthStore } from '@/store/useAuthStore';
import { Colors, Layout, Typography, normalize } from '@/theme/globalStyles';
import { applyShadow } from '@/utils/styleUtils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

interface Booking {
  bookingid: number;
  propertybookingid: number;
  propertyid: number;
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
}

interface NavigationProps {
  navigation: NativeStackNavigationProp<any>;
}

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375;
const scaledSize = (size: number) => Math.round(size * scale);

const MyBookings: React.FC<NavigationProps> = ({ navigation }) => {
  const { bookings, cancelBooking, isBooked, isBooking, refetch } = useBookings();
  const { checkAndHandleTokenExpiry } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelledModal, setShowCancelledModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  // Filter out duplicate bookings by propertyid
  const uniqueBookings = useMemo(() => {
    if (!bookings || !Array.isArray(bookings)) return [];

    // Use a Map to track unique propertyid values
    const uniqueMap = new Map();

    // For each booking, store only the first occurrence based on propertyid
    bookings.forEach((booking) => {
      const propertyId = booking.propertyid;
      if (propertyId && !uniqueMap.has(propertyId)) {
        uniqueMap.set(propertyId, booking);
      }
    });

    // Convert Map values back to array
    return Array.from(uniqueMap.values());
  }, [bookings]);

  // Debug logging
  useEffect(() => {
    if (bookings && Array.isArray(bookings)) {
      console.log(`Original bookings count: ${bookings.length}`);
      console.log(`Unique bookings count: ${uniqueBookings.length}`);
    }
  }, [bookings, uniqueBookings]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing bookings:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  useEffect(() => {
    checkAndHandleTokenExpiry();
    const tokenCheckInterval = setInterval(() => {
      checkAndHandleTokenExpiry();
    }, 60000);
    return () => clearInterval(tokenCheckInterval);
  }, [checkAndHandleTokenExpiry]);

  const handleCancelPress = (bookingId: number) => {
    console.log('Cancel pressed for booking:', bookingId);
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  useFocusEffect(
    useCallback(() => {
      // Call your fetch favorites function here
      refetch();
  // Set white status bar with dark content
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor('#FFFFFF');
      return () => {
        // Optional cleanup if needed
      };
    }, [refetch])
  );

  const handleCancelConfirm = async () => {
    console.log(selectedBookingId, "Selected Booking ID");

    if (!selectedBookingId) return;

    const booking = bookings.find((b: Booking) => b.propertybookingid === selectedBookingId);

    console.log(booking, "Booking");

    if (!booking) return;

    try {
      await cancelBooking({
        bookingId: selectedBookingId,
        propertyId: booking.propertyid,
        reasonForCancellation: "User cancelled booking"
      });
      setShowCancelModal(false);
      setShowCancelledModal(true);
      await refetch();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  // Create a properly typed keyExtractor
  const getItemKey = (item: any) => {
    // Use a combination of propertyid and bookingid to ensure uniqueness
    return `${item.propertyid}-${item.propertybookingid || item.bookingid || Date.now()}`;
  };

  return (
    <AuthCheck>
      <>
        <SafeAreaView style={styles.container}>
          <Text style={styles.heading}>My Bookings</Text>

          {isBooking ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <FlatList
              style={{ padding: 20 }}
              data={uniqueBookings}
              renderItem={({ item }) => (
                <BookingPropertyCard
                  booking={item}
                  onCancelBooking={handleCancelPress}
                  navigation={navigation}
                />
              )}
              keyExtractor={getItemKey}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              refreshing={refreshing}
              onRefresh={onRefresh}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No bookings found</Text>
                </View>
              )}
            />
          )}
        </SafeAreaView>

        {/* Modals */}
        <Modal
          visible={showCancelModal}
          transparent
          animationType="fade"
          statusBarTranslucent
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image
                source={require('@/theme/assets/images/Alert.png')}
                style={styles.modalIcon}
                resizeMode="contain"
              />
              <Text style={styles.modalTitle}>Cancel Booking</Text>
              <Text style={styles.modalText}>Are you sure you want to remove this booking?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowCancelModal(false)}
                >
                  <Text style={styles.cancelButtonText}>No, Keep My Booking</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleCancelConfirm}
                >
                  <Text style={styles.confirmButtonText}>Yes, Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showCancelledModal}
          transparent
          animationType="fade"
          statusBarTranslucent
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image
                source={require('@/theme/assets/images/Sad.png')}
                style={styles.modalIcon}
                resizeMode="contain"
              />
              <Text style={styles.modalTitle}>Booking Cancelled</Text>
              <Text style={styles.modalText}>Sorry, that you have cancelled your booking</Text>
              <TouchableOpacity
                style={[styles.modalButton, styles.okButton]}
                onPress={() => {
                  setShowCancelledModal(false);
                  setSelectedBookingId(null);
                }}
              >
                <Text style={styles.okButtonText}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    </AuthCheck>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.safeContainer,
    marginTop:Platform.OS === 'android' ? 24 : 0
  },
  heading: {
    ...Typography.pageHeading,
    marginLeft: 20,
  },
  listContainer: {
    paddingBottom: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  modalTitle: {
    ...Typography.h2,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalText: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  okButton: {
    backgroundColor: Colors.primary,
    width: '100%',
  },
  cancelButtonText: {
    ...Typography.buttonText,
    color: Colors.textSecondary,
  },
  confirmButtonText: {
    ...Typography.buttonText,
    color: Colors.textWhite,
  },
  okButtonText: {
    ...Typography.buttonText,
    color: Colors.textWhite,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});

export default MyBookings;