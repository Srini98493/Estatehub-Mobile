import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/base';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '@/theme/globalStyles';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  message?: string;
  title?: string;
  buttonText?: string;
}

const { width } = Dimensions.get('window');
const scale = width / 375;
const scaledSize = (size: number) => Math.round(size * scale);

const SuccessModal = ({ 
  visible, 
  onClose, 
  message,
  title = "Success!",
  buttonText = "Okay"
}: SuccessModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.checkmarkContainer}>
            <LinearGradient
              colors={Colors.gradientPrimary}
              style={styles.checkmark}
            >
              <Text style={styles.checkmarkText}>✓</Text>
            </LinearGradient>
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>
            {message || 'Your request was completed successfully'}
          </Text>
          
          <TouchableOpacity 
            style={styles.okayButtonContainer} 
            onPress={onClose}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={Colors.gradientPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.okayButton}
            >
              <Text style={styles.okayButtonText}>{buttonText}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: scaledSize(24),
    width: '85%',
  
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  checkmarkContainer: {
    marginBottom: scaledSize(20),
  },
  checkmark: {
    width: scaledSize(70),
    height: scaledSize(70),
    borderRadius: scaledSize(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: scaledSize(36),
    fontWeight: 'bold',
  },
  title: {
    fontSize: scaledSize(22),
    fontWeight: '600',
    marginBottom: scaledSize(12),
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  message: {
    fontSize: scaledSize(16),
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: scaledSize(24),
    paddingHorizontal: scaledSize(10),
  },
  okayButtonContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    
  },
  okayButton: {
    ...(Platform.OS === 'ios' 
      ? {
          paddingVertical: scaledSize(1),
          alignItems: 'center',
          justifyContent: 'center',
          height: 60
        } 
      : {
          paddingVertical: scaledSize(14),
          alignItems: 'center',
          justifyContent: 'center',
        }
    ),
  },
  okayButtonText: {
    color: 'white',
    fontSize: scaledSize(16),
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SuccessModal;