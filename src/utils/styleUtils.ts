import { StyleSheet } from 'react-native';
import { Colors, Cards } from '@/theme/globalStyles';

/**
 * Applies standardized shadow styles to a component
 * @param customStyles Additional styles to merge with the shadow styles
 * @returns StyleSheet object with shadow styles and custom styles
 */
export const applyCardShadow = (customStyles = {}) => {
  return StyleSheet.create({
    card: {
      ...Cards.cardShadow,
      ...customStyles,
    },
  }).card;
};

/**
 * Shadow configuration type
 */
type ShadowConfig = {
  offsetY: number;
  blurRadius: number;
  opacity: number;
  boxShadow: string;
};

/**
 * Applies standardized shadow styles using boxShadow for React Native 0.77+
 * @param depth Shadow depth (1-5)
 * @param color Shadow color (default: rgba(0, 0, 0, 0.1))
 * @param customStyles Additional styles to merge with the shadow styles
 * @returns StyleSheet object with shadow styles and custom styles
 */
export const applyShadow = (depth = 2, color = 'rgba(0, 0, 0, 0.1)', customStyles = {}) => {
  // Define shadow properties based on depth
  const shadowConfig: Record<number, ShadowConfig> = {
    1: {
      offsetY: 1,
      blurRadius: 2,
      opacity: 0.1,
      boxShadow: `0px 1px 2px ${color}`,
    },
    2: {
      offsetY: 2,
      blurRadius: 4,
      opacity: 0.1,
      boxShadow: `0px 2px 4px ${color}`,
    },
    3: {
      offsetY: 3,
      blurRadius: 6,
      opacity: 0.15,
      boxShadow: `0px 3px 6px ${color}`,
    },
    4: {
      offsetY: 4,
      blurRadius: 8,
      opacity: 0.2,
      boxShadow: `0px 4px 8px ${color}`,
    },
    5: {
      offsetY: 5,
      blurRadius: 10,
      opacity: 0.25,
      boxShadow: `0px 5px 10px ${color}`,
    },
  };

  // Get shadow config based on depth (default to level 2 if invalid depth)
  const config = shadowConfig[depth] || shadowConfig[2];

  return StyleSheet.create({
    shadow: {
      // Legacy shadow props for backward compatibility
      shadowColor: color,
      shadowOffset: {
        width: 0,
        height: config.offsetY,
      },
      shadowOpacity: config.opacity,
      shadowRadius: config.blurRadius,
      // Use boxShadow for React Native 0.77+
      boxShadow: config.boxShadow,
      ...customStyles,
    },
  }).shadow;
};

/**
 * Standardized card styles that can be used across the application
 */
export const cardStyles = StyleSheet.create({
  standardCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Cards.cardShadow,
  },
  listCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    ...Cards.cardShadow,
  },
  gridCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    ...Cards.cardShadow,
  },
}); 