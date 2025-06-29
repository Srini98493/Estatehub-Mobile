import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { normalize } from '@/utils/dimensions';
import { Colors, Typography } from "@/theme/globalStyles";

interface CustomTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';
  color?: string;
}

export const Text: React.FC<CustomTextProps> = ({
  children,
  variant = 'body',
  color,
  style,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles.default,
        styles[variant],
        color ? { color } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  default: {
    color: Colors.textPrimary,
  },
  h1: {
    fontSize: normalize(24),
    fontWeight: '700',
  },
  h2: {
    fontSize: normalize(20),
    fontWeight: '600',
  },
  h3: {
    fontSize: normalize(18),
    fontWeight: '600',
  },
  body: {
    fontSize: normalize(16),
  },
  caption: {
    fontSize: normalize(14),
  },
  button: {
    fontSize: normalize(16),
    fontWeight: '600',
  },
}); 