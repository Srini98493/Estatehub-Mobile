import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { Text } from '@/components/base';
import { CustomInput } from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { Colors, Layout, Typography } from "@/theme/globalStyles";
import GradientButton from '@/components/atoms/GradientButton/GradientButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from "react-native-vector-icons/Ionicons";
import CountryCodeDropdown from './CountryCodeDropdown';
import { isValid } from 'zod';
const { width, height } = Dimensions.get('window');

interface FormData {
  fullName: string;
  email: string;
  areaCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  areaCode?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  privacyPolicy?: string;
}

type RootStackParamList = {
  PersonalDetails: {
    basicInfo: {
      fullName: string;
      email: string;
      phoneNumber: string;
      areaCode: string;
      password: string;
    };
  };
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BasicInfo = () => {
  const navigation = useNavigation<NavigationProp>();
  const emailRef = React.useRef<TextInput>(null);
  const areaCodeRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);
  const confirmPasswordRef = React.useRef<TextInput>(null);

  // Privacy policy state
  const [modalVisible, setModalVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollThreshold = 0.8; // User needs to scroll through 80% of content
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    areaCode: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Debug modal visibility
  useEffect(() => {
    console.log("Modal visibility changed:", modalVisible);
  }, [modalVisible]);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const scrollPercentage = (layoutMeasurement.height + contentOffset.y) / contentSize.height;
    setScrollPosition(scrollPercentage);
  };

  const showPrivacyPolicy = () => {
    console.log("Attempting to show privacy policy");
    setModalVisible(true);
  };

  const hidePrivacyPolicy = () => {
    console.log("Hiding privacy policy");
    setModalVisible(false);
  };

  const hasScrolledEnough = scrollPosition > scrollThreshold;

  const togglePrivacyPolicyAccepted = () => {
    setPrivacyPolicyAccepted(!privacyPolicyAccepted);
    // Clear any privacy policy error when checkbox is checked
    if (!privacyPolicyAccepted) {
      setErrors({ ...errors, privacyPolicy: undefined });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleSubmit = () => {
    // Create a new errors object to store validation errors
    const newErrors: FormErrors = {};
    let formIsValid = true;

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
      formIsValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      formIsValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      formIsValid = false;
    }

    // Area Code validation
    if (!formData.areaCode) {
      newErrors.areaCode = "Country code is required";
    } else if (!/^\+\d{2,4}$/.test(formData.areaCode)) {
      newErrors.areaCode = "Invalid country code. Format: +XX";
    }

    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      formIsValid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
      formIsValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      formIsValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      formIsValid = false;
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      formIsValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      formIsValid = false;
    }

    // Privacy Policy validation
    if (!privacyPolicyAccepted) {
      newErrors.privacyPolicy = 'You must accept the Privacy Policy to continue';
      formIsValid = false;
    }

    // Update the errors state
    setErrors(newErrors);

    // Only proceed if form is valid
    if (formIsValid) {
      const { confirmPassword, ...basicInfo } = formData;
      navigation.navigate('PersonalDetails', {
        basicInfo: {
          fullName: basicInfo.fullName,
          email: basicInfo.email,
          phoneNumber: basicInfo.phoneNumber,
          areaCode: basicInfo.areaCode,
          password: basicInfo.password,
        },
      });
    }
  };

  // Helper function to check if all fields are filled
  const areAllFieldsFilled = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.areaCode !== '' &&
      formData.phoneNumber.trim() !== '' &&
      formData.password !== '' &&
      formData.confirmPassword !== '' &&
      privacyPolicyAccepted
    );
  };

  const acceptPrivacyPolicy = () => {
    setPrivacyPolicyAccepted(true);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log("Modal closed by system back button");
          setModalVisible(false);
        }}
      >
        <View style={privacyStyles.modalOverlay}>
          <View style={privacyStyles.modalContent}>
            <View style={privacyStyles.header}>
              <View style={privacyStyles.headerTitleContainer}>
                <Image
                  source={require('@/theme/assets/images/logo_2.png')}
                  style={privacyStyles.logo}
                  resizeMode="contain"
                />
                <Text style={privacyStyles.modalTitle}>Privacy Policy</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  console.log("Close button pressed");
                  setModalVisible(false);
                }}
                style={privacyStyles.closeButton}
              >
                <Icon name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={privacyStyles.scrollView}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              <Text style={privacyStyles.dateInfo}>
                <Text style={privacyStyles.bold}>Effective Date:</Text> 30-03-2025 | <Text style={privacyStyles.bold}>Last Updated:</Text> 30-03-2025
              </Text>

              <Text style={privacyStyles.paragraph}>
                Welcome to estateshub ("we," "our," or "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application estateshub on Android or iOS devices.
              </Text>

              <Text style={privacyStyles.sectionTitle}>1. Information We Collect</Text>

              <Text style={privacyStyles.subsectionTitle}>a) Personal Data</Text>
              <Text style={privacyStyles.paragraph}>
                We may collect personal information that you voluntarily provide when registering, such as:
              </Text>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>Name</Text>
              </View>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>Email address</Text>
              </View>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>Phone number</Text>
              </View>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>Profile picture (if applicable)</Text>
              </View>

              <Text style={privacyStyles.subsectionTitle}>b) Automatically Collected Data</Text>
              <Text style={privacyStyles.paragraph}>
                When you use our app, we may automatically collect:
              </Text>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>Device Information (model, OS version, unique device identifier)</Text>
              </View>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>Usage Data (features used, time spent in the app)</Text>
              </View>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>IP Address</Text>
              </View>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>Cookies and tracking technologies</Text>
              </View>

              <Text style={privacyStyles.subsectionTitle}>c) Location Data (if applicable)</Text>
              <Text style={privacyStyles.paragraph}>
                With your permission, we may collect and process location data to enhance certain features (e.g., nearby services).
              </Text>

              <Text style={privacyStyles.sectionTitle}>2. How We Use Your Information</Text>
              <Text style={privacyStyles.paragraph}>
                We use collected data for the following purposes:
              </Text>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>To provide and maintain the app's functionality</Text>
              </View>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>To personalize user experience</Text>
              </View>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>To improve app performance and security</Text>
              </View>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>To send updates, promotions, or important notifications</Text>
              </View>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>To comply with legal obligations</Text>
              </View>

              <Text style={privacyStyles.sectionTitle}>3. Sharing Your Information</Text>
              <Text style={privacyStyles.paragraph}>
                We do not sell or rent your personal data. However, we may share it with:
              </Text>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>Service Providers (e.g., cloud storage, analytics tools)</Text>
              </View>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>Legal Authorities (if required by law or to prevent fraud)</Text>
              </View>
              <View style={privacyStyles.listItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.primary} style={privacyStyles.listIcon} />
                <Text style={privacyStyles.listText}>Business Partners (only with user consent)</Text>
              </View>

              <Text style={privacyStyles.sectionTitle}>4. Contact Us</Text>
              <Text style={privacyStyles.paragraph}>
                If you have any questions, contact us at:
              </Text>
              <Text style={privacyStyles.paragraph}>
                Estates Hub Private Ltd{'\n'}
                estateshub4u@gmail.com
              </Text>

              <Text style={privacyStyles.classification}>
                Classification: Controlled
              </Text>

              <View style={privacyStyles.spacer} />
            </ScrollView>

            <View style={privacyStyles.footer}>
              <Text style={privacyStyles.scrollMessage}>
                {hasScrolledEnough
                  ? "Thank you for reviewing our privacy policy"
                  : "Please scroll through the entire policy to continue"}
              </Text>
              <GradientButton
                title="Close"
                onPress={acceptPrivacyPolicy}
                disabled={!hasScrolledEnough}
                style={hasScrolledEnough ? privacyStyles.acceptButton : privacyStyles.disabledButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={Platform.OS === 'ios' ? 80 : 40}
        extraHeight={120}
        enableResetScrollToCoords={false}
        keyboardOpeningTime={0}
      >
        <View style={styles.content}>
          <Image
            source={require('@/theme/assets/images/logo_2.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Please fill in the details below</Text>

          <View style={[styles.inputContainer, { paddingBottom: Platform.OS === 'ios' ? 50 : 80 }]}>
            <CustomInput
              placeholder="Full Name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              error={errors.fullName}
              leftIcon="person-outline"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => emailRef.current?.focus()}
              keyboardType="default"
            />

            <CustomInput
              ref={emailRef}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              error={errors.email}
              leftIcon="mail-outline"
              returnKeyType="next"
              blurOnSubmit={false}
              autoCapitalize="none"
              onSubmitEditing={() => areaCodeRef.current?.focus()}
            />

<CustomInput
  ref={areaCodeRef}
  placeholder="Country Code (e.g. +91)"
  maxLength={5}  // Increased to 5 to fit "+XXXX" format
  value={formData.areaCode}
  onChangeText={(text) => {
    // Only allow digits and + character
    if (!/^[+\d]*$/.test(text)) {
      return;
    }
    
    // Update the value without auto-adding +
    setFormData({ ...formData, areaCode: text });
    
    // Real-time validation
    if (!text) {
      setErrors({...errors, areaCode: 'Country code is required'});
    } else if (!/^\+\d{2,4}$/.test(text)) {
      setErrors({...errors, areaCode: 'Invalid country code. Format: +XX (minimum 2 digits)'});
    } else {
      setErrors({...errors, areaCode: undefined});
    }
  }}
  keyboardType="phone-pad"
  error={errors.areaCode}
  leftIcon="location-outline"
  returnKeyType="next"
  blurOnSubmit={false}
  onSubmitEditing={() => phoneRef.current?.focus()}
/>

<CustomInput
              ref={phoneRef}
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
              keyboardType="phone-pad"
              error={errors.phoneNumber}
              maxLength={10}
              leftIcon="call-outline"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <CustomInput
              ref={passwordRef}
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChangeText={(text) => {
                setFormData({ ...formData, password: text });

                // Real-time validation for password
                if (!text) {
                  setErrors({ ...errors, password: 'Password is required' });
                } else if (text.length < 6) {
                  setErrors({ ...errors, password: 'Password must be at least 6 characters' });
                } else {
                  setErrors({ ...errors, password: undefined });

                  // If confirm password is already entered, validate it against the new password
                  if (formData.confirmPassword) {
                    if (text !== formData.confirmPassword) {
                      setErrors({ ...errors, password: undefined, confirmPassword: 'Passwords do not match' });
                    } else {
                      setErrors({ ...errors, password: undefined, confirmPassword: undefined });
                    }
                  }
                }
              }}
              secureTextEntry
              error={errors.password}
              leftIcon="lock-closed-outline"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />

            <CustomInput
              ref={confirmPasswordRef}
              placeholder="Re-Enter Password"
              value={formData.confirmPassword}
              onChangeText={(text) => {
                setFormData({ ...formData, confirmPassword: text });

                // Real-time validation for confirm password
                if (!text) {
                  setErrors({ ...errors, confirmPassword: 'Please confirm your password' });
                } else if (text !== formData.password) {
                  setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
                } else {
                  setErrors({ ...errors, confirmPassword: undefined });
                }
              }}
              secureTextEntry
              error={errors.confirmPassword}
              leftIcon="lock-closed-outline"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            {/* Privacy Policy Checkbox */}
            <View style={styles.privacyContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={togglePrivacyPolicyAccepted}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  privacyPolicyAccepted ? styles.checkboxActive : styles.checkboxInactive
                ]}>
                  {privacyPolicyAccepted && (
                    <Icon name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={showPrivacyPolicy}
                activeOpacity={0.7}
                style={styles.privacyTextContainer}
              >
                <Text style={styles.privacyNoteText}>
                  By Checking The Box, You Agree To The{' '}
                  <Text style={styles.privacyLink}>
                    Privacy Policy
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            {errors.privacyPolicy && (
              <Text style={styles.errorText}>{errors.privacyPolicy}</Text>
            )}

            <GradientButton
              title="Create Account"
              onPress={handleSubmit}
              style={styles.loginButton}
              disabled={!areAllFieldsFilled()}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.registerLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.safeContainer,
    backgroundColor: Colors.backgroundLight,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 200,
    marginTop: 30,
  },
  title: {
    ...Typography.pageHeading,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 20,
  },
  loginButton: {
    marginVertical: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: Colors.textSecondary,
  },
  registerLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxInactive: {
    backgroundColor: 'transparent',
    borderColor: Colors.textSecondary,
  },
  privacyTextContainer: {
    flex: 1,
  },
  privacyNoteContainer: {
    alignItems: 'center',
    marginTop: 10,
    padding: 5,
  },
  privacyNoteText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  privacyLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: -15,
  },
});

// Privacy policy modal styles
const privacyStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F8F8',
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
    padding: 16,
    maxHeight: height * 0.55,
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
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
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

export default BasicInfo;