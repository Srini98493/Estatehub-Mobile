import React, { useState, useRef } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image,
  Platform
} from 'react-native';
import { Colors, Typography } from "@/theme/globalStyles";
import { Ionicons } from '@expo/vector-icons'; // Make sure you have this installed
import GradientButton from '@/components/atoms/GradientButton/GradientButton';

interface PrivacyPolicyModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const PrivacyPolicyModal = ({ open, onClose, onAccept }: PrivacyPolicyModalProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollThreshold = 0.8; // User needs to scroll through 80% of content
  
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const scrollPercentage = (layoutMeasurement.height + contentOffset.y) / contentSize.height;
    setScrollPosition(scrollPercentage);
  };

  const hasScrolledEnough = scrollPosition > scrollThreshold;

  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Image 
                source={require('@/theme/assets/images/logo_2.png')} 
                style={styles.logo} 
                resizeMode="contain"
              />
              <Text style={styles.modalTitle}>Privacy Policy</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.scrollView}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <Text style={styles.dateInfo}>
              <Text style={styles.bold}>Effective Date:</Text> 30-03-2025 | <Text style={styles.bold}>Last Updated:</Text> 30-03-2025
            </Text>

            <Text style={styles.paragraph}>
              Welcome to estateshub ("we," "our," or "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application estateshub on Android or iOS devices.
            </Text>

            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            
            <Text style={styles.subsectionTitle}>a) Personal Data</Text>
            <Text style={styles.paragraph}>
              We may collect personal information that you voluntarily provide when registering, such as:
            </Text>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>Name</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>Email address</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>Phone number</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>Profile picture (if applicable)</Text>
            </View>

            <Text style={styles.subsectionTitle}>b) Automatically Collected Data</Text>
            <Text style={styles.paragraph}>
              When you use our app, we may automatically collect:
            </Text>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>Device Information (model, OS version, unique device identifier)</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>Usage Data (features used, time spent in the app)</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>IP Address</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>Cookies and tracking technologies</Text>
            </View>

            <Text style={styles.subsectionTitle}>c) Location Data (if applicable)</Text>
            <Text style={styles.paragraph}>
              With your permission, we may collect and process location data to enhance certain features (e.g., nearby services).
            </Text>

            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.paragraph}>
              We use collected data for the following purposes:
            </Text>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>To provide and maintain the app's functionality</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>To personalize user experience</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>To improve app performance and security</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>To send updates, promotions, or important notifications</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>To comply with legal obligations</Text>
            </View>

            <Text style={styles.sectionTitle}>3. Sharing Your Information</Text>
            <Text style={styles.paragraph}>
              We do not sell or rent your personal data. However, we may share it with:
            </Text>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>Service Providers (e.g., cloud storage, analytics tools)</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>Legal Authorities (if required by law or to prevent fraud)</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.listIcon} />
              <Text style={styles.listText}>Business Partners (only with user consent)</Text>
            </View>

            <Text style={styles.sectionTitle}>4. Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions, contact us at:
            </Text>
            <Text style={styles.paragraph}>
              Estates Hub Private Ltd{'\n'}
              estateshub4u@gmail.com
            </Text>
            
            <Text style={styles.classification}>
              Classification: Controlled
            </Text>
            
            <View style={styles.spacer} />
          </ScrollView>
          
          <View style={styles.footer}>
            <Text style={styles.scrollMessage}>
              {hasScrolledEnough 
                ? "Thank you for reviewing our privacy policy" 
                : "Please scroll through the entire policy to continue"}
            </Text>
            <GradientButton
              title="I Accept"
              onPress={onAccept}
              disabled={!hasScrolledEnough}
              style={hasScrolledEnough ? styles.acceptButton : styles.disabledButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  scrollView: {
    maxHeight: 400,
    padding: 16,
  },
  dateInfo: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  listIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  classification: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    marginTop: 24,
  },
  spacer: {
    height: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollMessage: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: 10,
  },
  acceptButton: {
    width: 120,
  },
  disabledButton: {
    width: 120,
    opacity: 0.7,
  },
});

export default PrivacyPolicyModal;