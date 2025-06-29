import React, { useState } from "react";
import { View, StyleSheet, Platform, SafeAreaView, TextInput, TouchableOpacity, Image, Modal } from "react-native";
import { Text } from "@/components/base";
import { CustomInput } from "@/components/CustomInput";

import { Colors, Layout, Typography, normalize } from "@/theme/globalStyles";
import GradientButton from '@/components/atoms/GradientButton/GradientButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/types/navigation";
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import Toast from 'react-native-toast-message';
import { useRoute, RouteProp } from '@react-navigation/native';

type RouteParams = {
  basicInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    areaCode: string;
  };
};

type PersonalDetailsRouteProp = RouteProp<{ PersonalDetails: RouteParams }, 'PersonalDetails'>;

type Props = NativeStackScreenProps<AuthStackParamList, "PersonalDetails">;

interface FormData {
  gender: string;
  dob: string;
  location: string;
  city: string;
  state: string;
  country: string;
}

interface FormErrors {
  gender?: string;
  dob?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  server?: string;
}

const PersonalDetails: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<PersonalDetailsRouteProp>();
  const basicInfo = route.params.basicInfo;
  const [isLoading, setIsLoading] = useState(false);

  const dobRef = React.useRef<TextInput>(null);
  const locationRef = React.useRef<TextInput>(null);
  const cityRef = React.useRef<TextInput>(null);
  const stateRef = React.useRef<TextInput>(null);
  const countryRef = React.useRef<TextInput>(null);

  const [formData, setFormData] = useState<FormData>({
    gender: '',
    dob: '',
    location: '',
    city: '',
    state: '',
    country: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setFormData(prev => ({ ...prev, dob: selectedDate.toLocaleDateString() }));
    }
  };

  const validateForm = () => {
    // No validation required since all fields are optional
    return true;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Prepare registration payload
      const registrationPayload = {
        // Basic Information (Required)
        name: basicInfo.fullName,
        username: basicInfo.email.split('@')[0], // Generate username from email
        password: basicInfo.password,
        areaCode: basicInfo.areaCode,
        contactNo: basicInfo.phoneNumber,
        email: basicInfo.email,
        
        // Personal Information (all optional)
        socialEmail: basicInfo.email, // Using primary email as social email
        gender: formData.gender || null,
        dob: formData.dob || null,
        location: formData.location || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        
        // Default values
        profileImagePath: '/uploads/profile/default.jpg',
        isNotificationEnabled: true,
        userType: 1,
        createdBy: 1
      };

      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Registration successful!',
          text2: 'Please verify your email.',
          position: 'bottom',
        });
        navigation.navigate('OTP', { email: basicInfo.email });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration failed',
          text2: data.message || 'Please try again.',
          position: 'bottom',
        });
        setErrors(prev => ({
          ...prev,
          server: data.message || 'Registration failed',
        }));
      }
    } catch (error) {
      console.error('Registration error:', error);
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: 'An error occurred. Please try again.',
        position: 'bottom',
      });
      setErrors(prev => ({
        ...prev,
        server: 'An error occurred during registration. Please try again.',
      }));
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
        extraScrollHeight={Platform.OS === 'ios' ? 80 : 40}
        extraHeight={120}
        enableResetScrollToCoords={false}
        keyboardOpeningTime={0}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Personal Information</Text>
          <Text style={styles.subtitle}>Optional details to complete your profile</Text>

          <View style={[styles.inputContainer, { paddingBottom: Platform.OS === 'ios' ? 50 : 80 }]}>
            <CustomInput
              placeholder="Gender (Optional)"
              value={formData.gender}
              onChangeText={(text) => setFormData({ ...formData, gender: text })}
              leftIcon="person-outline"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => locationRef.current?.focus()}
            />

            <TouchableOpacity 
              style={styles.datePickerButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.datePickerContent}>
                <Icon name="calendar-outline" size={20} color={Colors.textSecondary} style={styles.dateIcon} />
                <Text style={[styles.dateText, !formData.dob && styles.placeholderText]}>
                  {formData.dob || 'Date of Birth (Optional)'}
                </Text>
              </View>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}

            <CustomInput
              ref={locationRef}
              placeholder="Location (Optional)"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              leftIcon="location-outline"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => cityRef.current?.focus()}
            />

            <CustomInput
              ref={cityRef}
              placeholder="City (Optional)"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              leftIcon="business-outline"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => stateRef.current?.focus()}
            />

            <CustomInput
              ref={stateRef}
              placeholder="State (Optional)"
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
              leftIcon="map-outline"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => countryRef.current?.focus()}
            />

            <CustomInput
              ref={countryRef}
              placeholder="Country (Optional)"
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text })}
              leftIcon="globe-outline"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            <GradientButton
              title={isLoading ? "Signing up..." : "Complete Signup"}
              onPress={handleSubmit}
              style={styles.submitButton}
              isLoading={isLoading}
              disabled={isLoading}
            />

            {errors.server && (
              <Text style={styles.serverError}>{errors.server}</Text>
            )}

            {/* <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>Or continue with</Text>
              <View style={styles.orLine} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={require('@/theme/assets/images/Google.png')} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={require('@/theme/assets/images/Apple.png')} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={require('@/theme/assets/images/Facebook.png')} style={styles.socialIcon} />
              </TouchableOpacity>
            </View> */}

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 40, // Add padding at the top to prevent content from being hidden behind the back button
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    ...Typography.pageHeading,
    color: Colors.textPrimary,
    marginTop: 10, // Add margin to prevent overlap with back button
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
  submitButton: {
    marginVertical: 20,
  },
  // Fixed back button styles
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 70,
    left: 20,
    zIndex: 10, // Ensure button stays on top
   
  },
  backButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: Platform.OS === 'ios' ? 3:0,
    elevation: Platform.OS === 'ios' ? 3:0,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  orText: {
    color: Colors.textSecondary,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  socialButton: {
    width: 100,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 100,
    height: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    color: Colors.textSecondary,
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  datePickerButton: {
    height: normalize(44),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: normalize(8),
    backgroundColor: Colors.background,
    paddingHorizontal: normalize(16),
    justifyContent: 'center',
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: normalize(8),
  },
  dateText: {
    fontSize: normalize(16),
    color: Colors.textPrimary,
  },
  placeholderText: {
    color: Colors.textLight,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: normalize(12),
    marginTop: normalize(4),
  },
  serverError: {
    color: Colors.error,
    fontSize: normalize(14),
    textAlign: 'center',
    marginTop: normalize(10),
  },
});

export default PersonalDetails;