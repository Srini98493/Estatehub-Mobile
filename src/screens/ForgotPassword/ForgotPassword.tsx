import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Typography, Layout, normalize } from '@/theme/globalStyles';
import { CustomInput } from '@/components/CustomInput';
import GradientButton from '@/components/atoms/GradientButton/GradientButton';
import axios from 'axios';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import Toast from 'react-native-toast-message';

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface ForgotPasswordProps {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleResetPassword = async () => {
    setError('');
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, { email });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password reset link sent to your email!',
        position: 'bottom',
        visibilityTime: 3000,
      });
      setTimeout(() => {
        navigation.navigate('Login');
      }, 3000);
    } catch (err) {
      console.error('Error sending reset link:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'We did not find an account with that email. Please try again.',
        position: 'bottom',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('@/theme/assets/images/logo_2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email address to receive a password reset link</Text>
        
        <View style={styles.inputContainer}>
          <CustomInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail"
            error={error}
          />
          
          <GradientButton
            title="Reset Password"
            onPress={handleResetPassword}
            style={styles.resetButton}
            isLoading={isLoading}
          />

          <TouchableOpacity 
            style={styles.backToLoginContainer}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.safeContainer,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 200,
    marginTop: 50,
  },
  title: {
    ...Typography.pageHeading,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  resetButton: {
    marginVertical: 20,
  },
  backToLoginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  backToLoginText: {
    ...Typography.body,
    color: Colors.primary,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
});

export default ForgotPassword; 