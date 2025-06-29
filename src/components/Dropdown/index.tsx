import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Typography, normalize } from '@/theme/globalStyles';
import { applyShadow } from '@/utils/styleUtils';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375;
const scaledSize = (size: number) => Math.round(size * scale);

interface Option {
  id: number;
  name: string;
}

interface DropdownProps {
  label: string;
  value?: Option | Option[];
  options: readonly Option[];
  onSelect: (option: Option | Option[]) => void;
  error?: string;
  isMulti?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  onSelect,
  error,
  isMulti = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleDropdown = () => {
    if (isOpen) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const isSelected = (option: Option) => {
    if (isMulti && Array.isArray(value)) {
      return value.some(v => v.id === option.id);
    }
    return !isMulti && !Array.isArray(value) && value?.id === option.id;
  };

  const handleSelect = (option: Option) => {
    if (isMulti) {
      const currentValue = Array.isArray(value) ? value : [];
      const isAlreadySelected = currentValue.some(v => v.id === option.id);
      
      if (isAlreadySelected) {
        onSelect(currentValue.filter(v => v.id !== option.id));
      } else {
        onSelect([...currentValue, option]);
      }
    } else {
      onSelect(option);
      toggleDropdown();
    }
  };

  const getDisplayText = () => {
    if (!value) return label;
    if (isMulti && Array.isArray(value)) {
      return value.length > 0 
        ? `${value.length} selected`
        : label;
    }
    return !Array.isArray(value) ? value.name : label;
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          error ? styles.dropdownButtonError : null,
        ]}
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dropdownButtonText,
          !value && styles.placeholder
        ]}>
          {getDisplayText()}
        </Text>
        <Icon
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={toggleDropdown}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleDropdown}
        >
          <Animated.View
            style={[
              styles.dropdown,
              {
                opacity: animation,
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.option,
                    isSelected(option) && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected(option) && styles.selectedOptionText,
                    ]}
                  >
                    {option.name}
                  </Text>
                  {isSelected(option) && (
                    <Icon name="checkmark" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
              {isMulti && (
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={toggleDropdown}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    height: scaledSize(50),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: scaledSize(15),
    backgroundColor: Colors.backgroundLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...applyShadow(2),
  },
  dropdownButtonError: {
    borderColor: Colors.error,
  },
  dropdownButtonText: {
    fontSize: scaledSize(16),
    color: Colors.textPrimary,
  },
  placeholder: {
    color: Colors.textSecondary,
  },
  errorText: {
    color: Colors.error,
    fontSize: scaledSize(12),
    marginTop: scaledSize(4),
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    width: width - scaledSize(40),
    maxHeight: height * 0.6,
    ...applyShadow(8),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scaledSize(15),
    paddingHorizontal: scaledSize(20),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: Colors.primaryLight,
  },
  optionText: {
    fontSize: scaledSize(16),
    color: Colors.textPrimary,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  doneButton: {
    height: scaledSize(50),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  doneButtonText: {
    color: Colors.textWhite,
    fontSize: scaledSize(16),
    fontWeight: '500',
  },
});

export default Dropdown; 