import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, useWindowDimensions, Platform, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomTextInput from '../../components/atoms/CustomTextInput/CustomTextInput';
import GradientButton from '../../components/atoms/GradientButton/GradientButton';
import { useLogin } from '../../hooks/useAuth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Typography, Layout, Inputs, Buttons, normalize } from '@/theme/globalStyles';

// Define navigation types
type RootStackParamList = {
  Login: undefined;
  BasicInfo: undefined;
  ForgotPassword: undefined;
  Register: undefined;
  Main: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginProps {
  navigation: LoginScreenNavigationProp;
}

const getResponsiveSize = (size: number, screenWidth: number, isTablet: boolean): number => {
  const baseWidth = 375; // Base width (e.g., iPhone X)
  const scaleFactor = isTablet ? 0.7 : 1; // Reduce size for tablets
  return (screenWidth / baseWidth) * size * scaleFactor;
};

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const login = useLogin();
  const [emailError, setEmailError] = useState<string>('');

  useEffect(() => {
    setOrientation(SCREEN_WIDTH > SCREEN_HEIGHT ? 'landscape' : 'portrait');
  }, [SCREEN_WIDTH, SCREEN_HEIGHT]);

  const isTablet = Platform.OS === 'ios' ? SCREEN_WIDTH > 768 : SCREEN_WIDTH > 600;

  const responsiveSize = (size: number) => getResponsiveSize(size, SCREEN_WIDTH, isTablet);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Reset error
    setEmailError('');

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!password.trim()) {
      Alert.alert('Error', 'Password is required');
      return;
    }

    try {
      const response = await login.mutateAsync({
        email,
        password,
      });
      console.log(response, 'Login response');
      if (response.user) {
        navigation.navigate('Main');
      }

      console.log('Login successful:', {
        userId: response.user.userid,
        name: response.user.fullname,
        email: response.user.useremail
      });

      // Let the auth state change handle navigation
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Please check your credentials and try again"
      );
    }
  };

  if (isTablet && orientation === 'landscape') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.landscapeMessage}>Please rotate your device to portrait mode</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletContent]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Image
            source={require('../../theme/assets/images/logo_2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.title}>Login into your account</Text>
          
          <View style={styles.inputContainer}>
            <CustomTextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(''); // Clear error when user types
              }}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            
            <CustomTextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              isPassword
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            <GradientButton
              title="Login"
              onPress={handleLogin}
              style={styles.loginButton}
            />

            {/* <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>Or Login with</Text>
              <View style={styles.orLine} />
            </View> */}

            {/* <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={require('../../theme/assets/images/Google.png')} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={require('../../theme/assets/images/Apple.png')} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={require('../../theme/assets/images/Facebook.png')} style={styles.socialIcon} />
              </TouchableOpacity>
            </View> */}

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('BasicInfo')}>
                <Text style={styles.registerLink}>Register Now</Text>
              </TouchableOpacity>
            </View>
            
            {/* Add some extra padding at the bottom to ensure visibility */}
            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.safeContainer,
    flex: 1,
    marginTop:Platform.OS === 'android' ? 32 : 0
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    
    paddingBottom: 30, // Extra padding at bottom
  },
  tabletContent: {
    paddingHorizontal: 40,
    
  },
  logo: {
    width: 250,
    height: 200,
    marginTop: 20,
    
  },
  title: {
    ...Typography.pageHeading,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  forgotPassword: {
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: Colors.textSecondary,
  },
  registerLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  landscapeMessage: {
    color: Colors.textPrimary,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 50,
  },
  loginButton: {
    marginVertical: 20,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  bottomPadding: {
    height: 40,
  },
});

export default Login;