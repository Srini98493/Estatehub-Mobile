import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Plus } from 'lucide-react-native';
import { Colors, Buttons, normalize } from '@/theme/globalStyles';
import { applyShadow } from '@/utils/styleUtils';

interface GradientFABProps {
  onPress: () => void;
  icon?: React.ReactNode;
  colors?: string[];
  size?: number;
}

const GradientFAB: React.FC<GradientFABProps> = ({
  onPress,
  icon,
  colors = Colors.gradientPrimary,
  size = 60,
}) => {
  return (
    <TouchableOpacity style={[styles.fab, { borderRadius: size / 2 }]} onPress={onPress}>
      <LinearGradient
        colors={Colors.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.fabGradient,
          { width: size, height: size, borderRadius: size / 2 }
        ]}
      >
        {icon || <Plus size={24} color={Colors.textWhite} />}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: normalize(20),
    right: normalize(20),
    overflow: 'hidden',
    ...applyShadow(3, 'rgba(0, 0, 0, 0.25)'),
  },
  fabGradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GradientFAB; 