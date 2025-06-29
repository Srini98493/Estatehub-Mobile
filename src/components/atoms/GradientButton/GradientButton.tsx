import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Typography, normalize } from '@/theme/globalStyles';

interface GradientButtonProps {
  onPress: () => void;
  title: string;
  colors?: string[];
  style?: any;
  textStyle?: any;
  disabled?: boolean;
  isLoading?: boolean;
}

const GradientButton = ({ 
  onPress, 
  title, 
  colors = Colors.gradientPrimary,
  style,
  textStyle,
  disabled = false,
  isLoading = false
}: GradientButtonProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || isLoading}
      style={[disabled && styles.disabled]}
    >
      <LinearGradient
        colors={disabled ? [Colors.borderLight, Colors.borderLight] : colors}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={[styles.button, style]}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.textWhite} />
        ) : (
          <Text style={[
            styles.buttonText, 
            textStyle,
            disabled && styles.disabledText
          ]}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: normalize(44),
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: Colors.textWhite,
    fontSize: normalize(16),
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.7,
  },
  disabledText: {
    color: Colors.textLight,
  },
});

export default GradientButton; 