import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from '@/components/base';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import SuccessModal from '@/components/SuccessModal';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/services/api/apiConfig';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import { Colors, Typography, normalize } from '@/theme/globalStyles';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '@/types/navigation';
import Dropdown from '@/components/Dropdown';

interface HomeLoanCategory {
  servicecategoryid: number;
  servicecategoryname: string;
}

interface Option {
  id: number;
  name: string;
}

type AddHomeLoanProps = StackScreenProps<RootStackParamList, 'AddHomeLoans'>;

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375;
const scaledSize = (size: number) => Math.round(size * scale);

const AddHomeLoans: React.FC<AddHomeLoanProps> = ({ navigation, route }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState<HomeLoanCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    serviceCategoryId: 0,
    email: user?.useremail || "",
    contactNo: user?.contactno || "",
    areaCode: user?.areacode || "",
    postQuery: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.useremail || "",
        contactNo: user.contactno || "",
        areaCode: user.areacode || "",
      }));
    }
    fetchHomeLoanCategories();
  }, [user]);

  const fetchHomeLoanCategories = async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.SERVICES.HOME_LOAN_CATEGORIES}`);
      if (response?.data) {
        const categoriesData = response.data?.data;
        setCategories(categoriesData);
        
        // Set the first category as default if categories exist and no category is selected yet
        if (categoriesData && categoriesData.length > 0 && formData.serviceCategoryId === 0) {
          setFormData(prev => ({
            ...prev,
            serviceCategoryId: categoriesData[0].servicecategoryid
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching home loan categories:', error);
      Alert.alert('Error', 'Failed to fetch home loan categories');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.serviceCategoryId) {
      newErrors.serviceCategoryId = "Please select a home loan type";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }


    if (!formData.contactNo) {
      newErrors.contactNo = "Phone number is required";
    } else if (!/^\d{6,15}$/.test(formData.contactNo)) {
      newErrors.contactNo = "Invalid phone number";
    }

    if (!formData.areaCode) {
      newErrors.areaCode = "Country code is required";
    } else if (!/^\+\d{2,4}$/.test(formData.areaCode)) {
      newErrors.areaCode = "Invalid country code. Format: +XX";
    }
    if (!formData.postQuery.trim()) {
      newErrors.postQuery = "Please describe your home loan requirement";
    }

    setErrorMessages(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        userId: user?.userid,
        serviceListNo: formData.serviceCategoryId,
        postQuery: formData.postQuery,
        areaCode: formData.areaCode,
        contactNo: formData.contactNo,
        email: formData.email,
      };

      await api.post(API_ENDPOINTS.SERVICES.CREATE, payload);
      await queryClient.invalidateQueries({ queryKey: ["homeLoans"] });
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting home loan request:', error);
      Alert.alert('Error', 'Failed to submit home loan request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle text input key press event
  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      // Dismiss keyboard when Enter key is pressed
      Keyboard.dismiss();
      e.preventDefault?.(); // Prevent default behavior if supported
      return true; // Return true to indicate the event was handled
    }
    return false; // Return false to let the default behavior happen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply Home Loan</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <Dropdown
              label="Select Home Loan Type"
              value={formData.serviceCategoryId ?
                {
                  id: formData.serviceCategoryId,
                  name: categories?.find(c => c.servicecategoryid === formData.serviceCategoryId)?.servicecategoryname || ''
                } : undefined}
              options={categories.length > 0 ? categories?.map(cat => ({
                id: cat.servicecategoryid,
                name: cat.servicecategoryname
              })) : []}
              onSelect={(option: Option | Option[]) => {
                if (!Array.isArray(option)) {
                  setFormData(prev => ({ ...prev, serviceCategoryId: option.id }));
                  setErrorMessages(prev => ({ ...prev, serviceCategoryId: "" }));
                }
              }}
              error={errorMessages.serviceCategoryId}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  style={[styles.input, errorMessages.areaCode ? styles.inputError : null]}
                  placeholder="Country Code"
                  maxLength={4}
                  value={formData.areaCode}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, areaCode: text }));

                    // Real-time validation
                    if (!text) {
                      setErrorMessages(prev => ({ ...prev, areaCode: "Country code is required" }));
                    } else if (!/^\+\d{2,4}$/.test(text)) {
                      setErrorMessages(prev => ({ ...prev, areaCode: "Invalid country code. Format: +XX" }));
                    } else {
                      setErrorMessages(prev => ({ ...prev, areaCode: "" }));
                    }
                  }}
                  keyboardType="phone-pad"
                />
                {errorMessages.areaCode && (
                  <Text style={styles.errorText}>{errorMessages.areaCode}</Text>
                )}
              </View>

              <View style={styles.halfInput}>
                <TextInput
                  style={[styles.input, errorMessages.contactNo ? styles.inputError : null]}
                  placeholder="Phone Number"
                  value={formData.contactNo}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, contactNo: text }));
                    setErrorMessages(prev => ({ ...prev, contactNo: "" }));
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {errorMessages.contactNo && (
                  <Text style={styles.errorText}>{errorMessages.contactNo}</Text>
                )}
              </View>
            </View>

            <TextInput
              style={[styles.input, errorMessages.email ? styles.inputError : null]}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, email: text }));
                setErrorMessages(prev => ({ ...prev, email: "" }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errorMessages.email && (
              <Text style={styles.errorText}>{errorMessages.email}</Text>
            )}

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errorMessages.postQuery ? styles.inputError : null
              ]}
              placeholder="Enter details about home loan you needed"
              value={formData.postQuery}
              onChangeText={(text) => {
                // Remove line breaks from input
                const sanitizedText = text.replace(/\r?\n|\r/g, ' ');
                if (sanitizedText.length <= 2000) {
                  setFormData(prev => ({ ...prev, postQuery: sanitizedText }));
                  setErrorMessages(prev => ({ ...prev, postQuery: "" }));
                }
              }}
              multiline={true}
              numberOfLines={4}
              blurOnSubmit={true}
              onKeyPress={handleKeyPress}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <Text style={styles.charCount}>
              {formData.postQuery.length}/2000
            </Text>
            {errorMessages.postQuery && (
              <Text style={styles.errorText}>{errorMessages.postQuery}</Text>
            )}

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitText}>
                {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigation.goBack();
        }}
        message="Home Loan Enquiry created successfully"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scaledSize(20),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h2,
  },
  form: {
    padding: scaledSize(20),
    gap: scaledSize(15),
  },
  input: {
    height: scaledSize(50),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: scaledSize(15),
    fontSize: scaledSize(16),
    backgroundColor: Colors.backgroundLight,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: scaledSize(12),
    marginTop: scaledSize(4),
  },
  textArea: {
    height: scaledSize(120),
    textAlignVertical: 'top',
    paddingTop: scaledSize(15),
  },
  row: {
    flexDirection: 'row',
    gap: scaledSize(10),
  },
  halfInput: {
    flex: 1,
  },
  charCount: {
    textAlign: 'right',
    fontSize: scaledSize(12),
    color: Colors.textSecondary,
    marginTop: scaledSize(-10),
  },
  submitButton: {
    height: scaledSize(50),
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaledSize(20),
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: Colors.textWhite,
    fontSize: scaledSize(16),
    fontWeight: '500',
  },
  cancelButton: {
    height: scaledSize(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textSecondary,
    fontSize: scaledSize(16),
  },
});

export default AddHomeLoans;