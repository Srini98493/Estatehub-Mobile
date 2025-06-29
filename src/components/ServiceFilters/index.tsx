import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/base';
import { useNavigation } from '@react-navigation/native';

const ServiceFilters = () => {
  const navigation = useNavigation();
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const serviceTypes = ['Plumber', 'Electrician', 'Carpenter', 'Painting'];
  const propertyNames = ['Astral Heights', 'City View', 'Lake Side', 'Heights Arcade'];
  const dateRanges = ['Today', 'Last 7 Days', 'This Month'];

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const toggleProperty = (property: string) => {
    setSelectedProperties(prev => 
      prev.includes(property) 
        ? prev.filter(p => p !== property)
        : [...prev, property]
    );
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleReset = () => {
    setSelectedPriority('All');
    setSelectedDateRange('');
    setSelectedServices([]);
    setSelectedProperties([]);
    handleClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Service Filter</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset all</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text>{selectedPriority}</Text>
            <Text>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Type</Text>
          {serviceTypes.map((service) => (
            <TouchableOpacity 
              key={service}
              style={styles.checkboxRow}
              onPress={() => toggleService(service)}
            >
              <View style={[
                styles.checkbox,
                selectedServices.includes(service) && styles.checkboxSelected
              ]} />
              <Text style={styles.checkboxLabel}>{service}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Name</Text>
          {propertyNames.map((property) => (
            <TouchableOpacity 
              key={property}
              style={styles.checkboxRow}
              onPress={() => toggleProperty(property)}
            >
              <View style={[
                styles.checkbox,
                selectedProperties.includes(property) && styles.checkboxSelected
              ]} />
              <Text style={styles.checkboxLabel}>{property}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date Range</Text>
          <View style={styles.dateRangeButtons}>
            {dateRanges.map((range) => (
              <TouchableOpacity 
                key={range}
                style={[
                  styles.dateRangeButton,
                  selectedDateRange === range && styles.dateRangeButtonSelected
                ]}
                onPress={() => setSelectedDateRange(range)}
              >
                <Text style={[
                  styles.dateRangeText,
                  selectedDateRange === range && styles.dateRangeTextSelected
                ]}>{range}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.dateInputContainer}>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateInputText}>From</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateInputText}>To</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.applyButton}
        onPress={() => {
          // Add your apply logic here
        }}
      >
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  resetText: {
    color: '#0096C7',
    fontSize: 14,
  },
  closeText: {
    fontSize: 20,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 4,
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#0096C7',
    borderColor: '#0096C7',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  dateRangeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  dateRangeButtonSelected: {
    backgroundColor: '#0096C7',
  },
  dateRangeText: {
    color: '#666',
  },
  dateRangeTextSelected: {
    color: 'white',
  },
  dateInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
  },
  dateInputText: {
    color: '#666',
  },
  applyButton: {
    backgroundColor: '#0096C7',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServiceFilters; 