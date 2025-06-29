import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Buttons, normalize } from "@/theme/globalStyles";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
}

export const CustomButton = ({ title, onPress, style }: CustomButtonProps) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    height: normalize(44),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.textWhite,
    fontSize: normalize(16),
    fontWeight: '600',
  },
}); 