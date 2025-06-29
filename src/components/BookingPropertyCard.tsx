import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Modal, Dimensions, Linking } from "react-native";
import { Text } from "@/components/base";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors, Typography, Cards, normalize } from "@/theme/globalStyles";

const { width, height } = Dimensions.get('window');

interface BookingProps {
  propertybookingid: number;
  propertytitle: string;
  propertytype: string;
  city: string;
  attachments: Array<{ attachmenturl: string }>;
  bookeddate: string;
}

interface BookingPropertyCardProps {
  booking: BookingProps;
  onCancelBooking: (bookingId: number) => void;
  navigation: any;
}

const BookingPropertyCard: React.FC<BookingPropertyCardProps> = ({
  booking,
  onCancelBooking,
  navigation,
}) => {
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  
  const handleEmailPress = () => {
    Linking.openURL('mailto:Support@estateshub.co.in');
  };
  
  const handlePhonePress = () => {
    Linking.openURL('tel:+919000062299');
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("PropertyDetails", {
            propertyId: booking.propertyid,
          })
        }
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <View style={styles.propertyRow}>
            <Image
              source={{ uri: booking.attachments?.[0]?.attachmenturl }}
              style={styles.image}
            />
            <View style={styles.content}>
              <Text style={styles.title}>{booking.propertytitle}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.propertyType}>{booking?.bedrooms} BHK</Text>
                <Text style={styles.propertyType}>{booking.propertytype}</Text>
                <Text style={styles.propertyType}>{booking.city}</Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingDate}>Booked on</Text>
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", paddingLeft: 10 }}
                >
                  {booking?.bookeddate}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={() => setSupportModalVisible(true)}
          >
            <Text style={styles.supportButtonText}>Need Support</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => onCancelBooking(booking.propertybookingid)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Support Modal */}
      <Modal
        visible={supportModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setSupportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSupportModalVisible(false)}
            >
              <Icon name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Get in Touch</Text>
            <Text style={styles.modalSubtitle}>We're here to help and answer any questions you might have.</Text>
            
            <View style={styles.supportOptions}>
              <TouchableOpacity 
                style={styles.supportOption} 
                onPress={handleEmailPress}
              >
                <View style={styles.iconContainer}>
                  <Icon name="mail" size={28} color={Colors.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Email</Text>
                  <Text style={styles.optionValue}>Support@estateshub.co.in</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.supportOption}
                onPress={handlePhonePress}
              >
                <View style={styles.iconContainer}>
                  <Icon name="call" size={28} color={Colors.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Phone</Text>
                  <Text style={styles.optionValue}>+91 90000 62299</Text>
                </View>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setSupportModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 16,
    ...Cards.cardShadow,
    overflow: "hidden",
  },
  cardContent: {
    padding: 16,
  },
  propertyRow: {
    flexDirection: "row",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "column",
    marginBottom: 8,
  },
  propertyType: {
    fontSize: 12,
    color: "#666",
  },
  bookingInfo: {
    flexDirection: "row",
    marginTop: 2,
  },
  bookingDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: "auto",
  },
  supportButton: {
    flex: 1,
    backgroundColor: "#D9F2FF",
    padding: 12,
    alignItems: "center",
  },
  supportButtonText: {
    color: "#225E7D",
    fontWeight: "600",
    fontSize: 14,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F84949",
    padding: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  propertyLocation: {
    color: Colors.textSecondary,
  },
  activeStatus: {
    backgroundColor: Colors.info,
  },
  activeStatusText: {
    color: Colors.textWhite,
  },
  cancelledStatus: {
    backgroundColor: Colors.error,
  },
  cancelledStatusText: {
    color: Colors.textWhite,
  },
  
  // Modal styles
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
    width: width * 0.85,
    maxWidth: 400,
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
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  supportOptions: {
    width: '100%',
    marginVertical: 16,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(75, 107, 251, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionValue: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  closeModalButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default BookingPropertyCard;