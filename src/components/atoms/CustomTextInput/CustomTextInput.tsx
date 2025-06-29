import React from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, normalize } from '@/theme/globalStyles';

interface CustomTextInputProps extends TextInputProps {
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  value: string;
  onChangeText: (text: string) => void;
}

const CustomTextInput = ({ 
  isPassword, 
  showPassword, 
  onTogglePassword,
  ...props 
}: CustomTextInputProps) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
      
        placeholderTextColor="#999"
        style={[styles.input, { color: '#333' }]}
        secureTextEntry={isPassword && !showPassword}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity 
          style={styles.eyeIcon} 
          onPress={onTogglePassword}
        >
          <Icon 
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: normalize(15),
  },
  input: {
    width: '100%',
    height: normalize(44),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: normalize(8),
    paddingHorizontal: normalize(16),
    fontSize: normalize(16),
  },
  eyeIcon: {
    position: 'absolute',
    right: normalize(12),
    top: normalize(10),
    padding: normalize(5),
  }
});

export default CustomTextInput; 