import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { Text } from '@/components/base';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors, Layout, Typography, normalize } from '@/theme/globalStyles';
import GradientButton from '@/components/atoms/GradientButton/GradientButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import Toast from 'react-native-toast-message';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

type RouteParams = {
  email: string;
};

type OTPRouteProp = RouteProp<{ OTP: RouteParams }, 'OTP'>;

export default function OTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OTPRouteProp>();
  const email = route.params.email;
  
  // For resend cooldown functionality
  const [cooldownTime, setCooldownTime] = useState(60); // 60 seconds cooldown
  const [isResendActive, setIsResendActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize cooldown on component mount
  useEffect(() => {
    startCooldown();
    
    // Clear timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startCooldown = () => {
    setIsResendActive(true);
    setCooldownTime(60); // Reset to 60 seconds
    
    timerRef.current = setInterval(() => {
      setCooldownTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          setIsResendActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Email verified successfully!',
          text2: 'Please login to continue.',
          position: 'bottom',
        });
        navigation.navigate('Login');
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
        Toast.show({
          type: 'error',
          text1: 'Verification failed',
          text2: data.message || 'Please try again.',
          position: 'bottom',
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('An error occurred. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Verification failed',
        text2: 'An error occurred. Please try again.',
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (isResendActive) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_ENDPOINTS.AUTH.RESEND_OTP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'OTP Resent!',
          text2: 'Please check your email for the new code.',
          position: 'bottom',
        });
        
        // Reset OTP fields
        setOtp(['', '', '', '', '', '']);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
        
        // Start cooldown timer
        startCooldown();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to resend OTP',
          text2: data.message || 'Please try again later.',
          position: 'bottom',
        });
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to resend OTP',
        text2: 'An error occurred. Please try again later.',
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed back button that stays in position while scrolling */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 40}
        extraHeight={120}
        enableResetScrollToCoords={false}
        keyboardOpeningTime={0}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>Please enter the verification code sent to {email}</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  error && !digit && styles.inputError
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                returnKeyType={index === 5 ? "done" : "next"}
                blurOnSubmit={false}
              />
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <GradientButton
              title={isLoading ? "Verifying..." : "Verify Email"}
              onPress={handleVerifyOTP}
              style={styles.submitButton}
              isLoading={isLoading}
              disabled={isLoading || otp.some(digit => !digit)}
            />
          </View>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            {isResendActive ? (
              <Text style={styles.cooldownText}>Resend in {cooldownTime}s</Text>
            ) : (
              <TouchableOpacity 
                onPress={handleResendOTP}
                disabled={isLoading || isResendActive}
              >
                <Text style={[
                  styles.resendLink,
                  (isLoading || isResendActive) && styles.resendLinkDisabled
                ]}>
                  Resend
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Layout.safeContainer,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 40, // Add padding to prevent content overlap with back button
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    ...Typography.pageHeading,
    color: Colors.textPrimary,
    marginTop: 20,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 10,
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  // Fixed back button styles
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 80,
    left: 20,
    zIndex: 10, // Ensure button stays on top
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: Platform.OS === 'ios' ? 3:0,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 30,
    width: '100%',
    paddingHorizontal: 20,
  },
  otpInput: {
    width: normalize(45),
    height: normalize(50),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: normalize(8),
    fontSize: normalize(20),
    textAlign: 'center',
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: normalize(14),
    marginBottom: 20,
    textAlign: 'center',
  },
  // Container to properly align the button
  buttonContainer: {
    width: '200%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    width: 150, // Using percentage width for better responsiveness
    marginTop: 20,
    
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  resendText: {
    color: Colors.textSecondary,
  },
  resendLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  resendLinkDisabled: {
    color: Colors.textLight,
    opacity: 0.7,
  },
  cooldownText: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});