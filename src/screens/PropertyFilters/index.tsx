import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Layout, Typography, Inputs, Buttons, normalize } from "@/theme/globalStyles";
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';

type PropertyFiltersProps = {
  navigation: StackNavigationProp<any>;
};

type FeaturesState = {
  parking: boolean;
  pool: boolean;
  garden: boolean;
  security: boolean;
  furnished: boolean;
};

const PropertyFiltersScreen: React.FC<PropertyFiltersProps> = ({ navigation }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [features, setFeatures] = useState<FeaturesState>({
    parking: false,
    pool: false,
    garden: false,
    security: false,
    furnished: false,
  });

  const toggleFeature = (feature: keyof FeaturesState) => {
    setFeatures({
      ...features,
      [feature]: !features[feature],
    });
  };

  const resetFilters = () => {
    setPriceRange([0, 1000000]);
    setBedrooms(0);
    setBathrooms(0);
    setFeatures({
      parking: false,
      pool: false,
      garden: false,
      security: false,
      furnished: false,
    });
  };

  const applyFilters = () => {
    // Apply filters logic here
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.rangeContainer}>
            <Text style={styles.rangeLabel}>Min: ${priceRange[0].toLocaleString()}</Text>
            <Text style={styles.rangeLabel}>Max: ${priceRange[1].toLocaleString()}</Text>
          </View>
          {/* Price slider would go here */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bedrooms</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={bedrooms.toString()}
              onChangeText={(text) => setBedrooms(parseInt(text) || 0)}
              placeholder="Number of bedrooms"
              placeholderTextColor={Colors.textLight}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bathrooms</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={bathrooms.toString()}
              onChangeText={(text) => setBathrooms(parseInt(text) || 0)}
              placeholder="Number of bathrooms"
              placeholderTextColor={Colors.textLight}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          {(Object.keys(features) as Array<keyof FeaturesState>).map((feature) => (
            <TouchableOpacity
              key={feature}
              style={styles.checkboxContainer}
              onPress={() => toggleFeature(feature)}
            >
              <View style={[styles.checkbox, features[feature] && styles.checkedBox]}>
                {features[feature] && <Icon name="checkmark" size={16} color={Colors.textWhite} />}
              </View>
              <Text style={styles.checkboxLabel}>
                {feature.charAt(0).toUpperCase() + feature.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.container,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  inputContainer: {
    marginTop: 8,
  },
  input: {
    ...Inputs.input,
    borderColor: Colors.border,
    color: Colors.textPrimary,
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rangeLabel: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
  },
  rangeValue: {
    fontSize: normalize(14),
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  slider: {
    marginTop: 12,
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: normalize(14),
    color: Colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  resetButton: {
    ...Buttons.secondary,
    borderColor: Colors.border,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  resetButtonText: {
    ...Typography.buttonText,
    color: Colors.textPrimary,
  },
  applyButton: {
    ...Buttons.primary,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  applyButtonText: {
    ...Typography.buttonText,
    color: Colors.textWhite,
  },
});

export default PropertyFiltersScreen; 