import React from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image,
  Linking,
  Dimensions
} from 'react-native';
import { Text } from '@/components/base';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Typography } from "@/theme/globalStyles";

interface SupportModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const SupportModal: React.FC<SupportModalProps> = ({ visible, onClose }) => {
  
  const handleEmailPress = () => {
    Linking.openURL('mailto:Support@estateshub.co.in');
  };
  
  const handlePhonePress = () => {
    Linking.openURL('tel:+919000062299');
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
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
            onPress={onClose}
          >
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    ...Typography.h2,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    ...Typography.body,
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
    ...Typography.subtitle,
    marginBottom: 4,
  },
  optionValue: {
    ...Typography.body,
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
    ...Typography.buttonText,
    color: Colors.textWhite,
  },
});

export default SupportModal;