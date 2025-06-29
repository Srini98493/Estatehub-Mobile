import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text } from '@/components/base';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuthStore } from '@/store/useAuthStore';
import { Colors, Typography, Layout, Buttons, normalize } from '@/theme/globalStyles';
import { applyShadow } from '@/utils/styleUtils';

const { width, height } = Dimensions.get('window');

// Define the navigation type
type RootStackParamList = {
  Login: undefined;
  // Add other screens as needed
};

type AuthNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface AuthCheckProps {
  children: React.ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image 
            source={require('@/theme/assets/images/logo_4.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          
          <Text style={styles.title}>Login Required</Text>
          
          <Text style={styles.message}>
            Please login to access this feature and enjoy all the benefits of our app.
          </Text>
          
          <TouchableOpacity 
            style={styles.buttonContainer}
            onPress={() => navigation.navigate('Auth')}
          >
            <LinearGradient 
              colors={Colors.gradientPrimary} 
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    ...Layout.safeContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    ...Typography.pageHeading,
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    ...Buttons.buttonContainer,
  },
  button: {
    ...Buttons.gradientButton,
  },
  buttonText: {
    ...Typography.buttonText,
  },
  shadowContainer: {
    shadowColor: Colors.textPrimary,
  },
  card: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    ...applyShadow(2),
  },
});

export default AuthCheck; 