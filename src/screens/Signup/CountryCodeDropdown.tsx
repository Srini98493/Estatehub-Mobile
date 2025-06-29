import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Dimensions
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { Colors, Typography } from "@/theme/globalStyles";

const { width } = Dimensions.get('window');

// Country codes - store both display value (with +) and value for API (without +)
const COUNTRY_CODES = [
  { code: 'IN', name: 'India', dialCode: '+91', apiValue: '91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dialCode: '+1', apiValue: '1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', apiValue: '44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', apiValue: '1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', apiValue: '61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', apiValue: '49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', apiValue: '33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', apiValue: '39', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', dialCode: '+81', apiValue: '81', flag: '🇯🇵' },
  { code: 'CN', name: 'China', dialCode: '+86', apiValue: '86', flag: '🇨🇳' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', apiValue: '55', flag: '🇧🇷' },
  { code: 'RU', name: 'Russia', dialCode: '+7', apiValue: '7', flag: '🇷🇺' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', apiValue: '82', flag: '🇰🇷' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', apiValue: '971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', apiValue: '966', flag: '🇸🇦' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', apiValue: '65', flag: '🇸🇬' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', apiValue: '27', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', apiValue: '234', flag: '🇳🇬' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', apiValue: '52', flag: '🇲🇽' },
  { code: 'ES', name: 'Spain', dialCode: '+34', apiValue: '34', flag: '🇪🇸' },
];

interface Country {
  code: string;
  name: string;
  dialCode: string;
  apiValue: string;
  flag: string;
}

interface CountryCodeDropdownProps {
  selectedCountry?: Country;
  onSelect: (country: Country) => void;
  error?: string;
}

const CountryCodeDropdown: React.FC<CountryCodeDropdownProps> = ({ selectedCountry, onSelect, error }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredCountries = searchText
    ? COUNTRY_CODES.filter(country =>
      country.name.toLowerCase().includes(searchText.toLowerCase()) ||
      country.dialCode.includes(searchText))
    : COUNTRY_CODES;

  const handleSelectCountry = (country: Country) => {
    onSelect(country);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleSelectCountry(item)}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <Text style={styles.countryName}>{item.name}</Text>
      <Text style={styles.dialCode}>{item.dialCode}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          error ? styles.errorBorder : null
        ]}
        onPress={() => setModalVisible(true)}
      >
        {/* Left side - Always show globe icon */}
        <View style={styles.leftIconContainer}>
          <Icon name="globe-outline" size={20} color={Colors.textSecondary} />
        </View>
        
        {/* Middle - Country/placeholder text */}
        <View style={styles.dropdownTextContainer}>
          {selectedCountry ? (
            <View style={styles.selectedCountry}>
              <Text style={styles.flagText}>{selectedCountry.flag}</Text>
              <Text style={styles.selectedText}>{selectedCountry.dialCode}</Text>
            </View>
          ) : (
            <Text style={styles.placeholderText}>Country Code</Text>
          )}
        </View>
        
        {/* Right side - Always show dropdown icon */}
        <View style={styles.rightIconContainer}>
          <Icon name="chevron-down" size={20} color={Colors.textSecondary} />
        </View>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country Code</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search country or code"
                value={searchText}
                onChangeText={setSearchText}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchText ? (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Icon name="close-circle" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              ) : null}
            </View>

            <FlatList
              data={filteredCountries}
              renderItem={renderItem}
              keyExtractor={item => item.code}
              style={styles.countryList}
              initialNumToRender={15}
              maxToRenderPerBatch={20}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.gray50,
  },
  dropdownButton: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
  },
  leftIconContainer: {
    paddingLeft: 15,
    paddingRight: 10,
  },
  dropdownTextContainer: {
    flex: 1,
  },
  rightIconContainer: {
    paddingHorizontal: 15,
  },
  errorBorder: {
    borderColor: Colors.error,
  },
  selectedCountry: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 18,
    marginRight: 8,
  },
  selectedText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.textSecondary,
    padding: 10,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundLight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  countryList: {
    marginBottom: 16,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  flag: {
    fontSize: 22,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  dialCode: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
});

export default CountryCodeDropdown;