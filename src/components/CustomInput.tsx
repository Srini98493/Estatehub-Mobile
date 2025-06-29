import React, { forwardRef, useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Platform, TouchableOpacity } from 'react-native';
import { Text } from './base';
import { Colors, normalize, Inputs } from '@/theme/globalStyles';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomInputProps extends Omit<TextInputProps, 'style'> {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  leftIcon?: string;
}

export const CustomInput = forwardRef<TextInput, CustomInputProps>(({
  placeholder,
  value,
  onChangeText,
  error,
  leftIcon,
  keyboardType = 'default',
  secureTextEntry = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };
  
  const isPassword = secureTextEntry; // Check if this is a password field
  
  return (
    <View style={styles.container}>
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={Colors.textSecondary}
            style={styles.icon}
          />
        )}
        <TextInput
          ref={ref}
          style={[styles.input, isPassword ? styles.passwordInput : null]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={Colors.textLight}
          keyboardType={keyboardType}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
          autoCorrect={false}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility} 
            style={styles.eyeButton}
            activeOpacity={0.7}
          >
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: normalize(8),
    backgroundColor: Colors.background,
    minHeight: normalize(44),
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
  },
  icon: {
    marginLeft: normalize(12),
    marginRight: normalize(8),
  },
  input: {
    flex: 1,
    height: normalize(44),
    fontSize: normalize(16),
    color: Colors.textPrimary,
    paddingHorizontal: normalize(16),
  },
  passwordInput: {
    paddingRight: normalize(40), // Add padding to prevent text from going behind the eye icon
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: normalize(12),
    marginTop: normalize(4),
  },
  eyeButton: {
    padding: normalize(10),
    position: 'absolute',
    right: normalize(5),
  },
});