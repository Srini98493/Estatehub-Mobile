import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  Platform,
  TextInput,
  NativeSyntheticEvent,
  NativeEventEmitter,
  Keyboard,
  TouchableWithoutFeedback,
  Modal
} from 'react-native';
import { Text } from '@/components/base';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import SuccessModal from '@/components/SuccessModal';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/services/api/apiConfig';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import { Colors, Typography, normalize } from '@/theme/globalStyles';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '@/types/navigation';
import Dropdown from '@/components/Dropdown';
import Toast from 'react-native-toast-message'; // Import Toast

interface Option {
  id: number;
  name: string;
}

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375;
const scaledSize = (size: number) => Math.round(size * scale);

const PROPERTY_TYPES = [
  { id: 1, name: "Open Plot" },
  { id: 2, name: "Apartment" },
  { id: 3, name: "Individual House/Villa" },
  { id: 4, name: "Agriculture Land" },
] as const;

const PROPERTY_CATEGORIES = [
  { id: 1, name: "Sell" },
  { id: 2, name: "Rent" },
] as const;

const AMENITIES_OPTIONS = [
  { id: 1, name: "Swimming Pool" },
  { id: 2, name: "Gym" },
  { id: 3, name: "Parking" },
  { id: 4, name: "Security" },
  { id: 5, name: "Garden" },
] as const;

const CURRENCY_OPTIONS = [
  { id: 1, name: "USD" },
  { id: 2, name: "EUR" },
  { id: 3, name: "INR" },
] as const;

type PropertyType = typeof PROPERTY_TYPES[number];
type PropertyCategory = typeof PROPERTY_CATEGORIES[number];
type CurrencyOption = typeof CURRENCY_OPTIONS[number];
type AmenitiesOption = typeof AMENITIES_OPTIONS[number];

type AddPropertyProps = StackScreenProps<RootStackParamList, 'AddProperty'>;


// Updated parseAmenities function to handle both array and single string formats
const parseAmenities = (amenitiesString: string): string[] => {
  if (!amenitiesString) return [];

  try {
    // First, try to parse it as JSON
    const parsed = JSON.parse(amenitiesString);

    // Handle case where it's {"amenities": ["Swimming Pool", "Gym"]} format
    if (parsed.amenities && Array.isArray(parsed.amenities)) {
      return parsed.amenities;
    }

    // Handle case where it's {"amenities": "Swimming Pool"} format (single string)
    if (parsed.amenities && typeof parsed.amenities === 'string') {
      return [parsed.amenities];
    }

    // Handle case where it's already an array
    if (Array.isArray(parsed)) {
      return parsed;
    }

    // Handle edge case where it's just a string that isn't in array format
    if (typeof parsed === 'string') {
      return [parsed];
    }

    // If we get here, it's an unknown format
    console.log("Unknown amenities format:", amenitiesString);
    return [];

  } catch (error) {
    // If JSON parsing fails, try the original regex approach
    return amenitiesString
      .replace(/[{}"]/g, '') // Remove curly braces and quotes
      .split(',') // Split by comma
      .map(amenity => amenity.trim().replace(/'/g, '"')) // Trim whitespace and replace single quotes
      .filter(amenity => amenity !== ''); // Remove empty entries
  }
};


const AddProperty: React.FC<AddPropertyProps> = ({ navigation, route }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isEdit = route.params?.isEdit || false;
  const propertyId = route.params?.propertyId;
// First, add a new state to track images to be removed
interface ImageToRemove {
  attachmentid: any;
  attachmenturl: any;
  attachmenttype: string;
  attachmentname: string;
  isprimary: boolean;
}

const [imagesToRemove, setImagesToRemove] = useState<ImageToRemove[]>([]);
  const [formData, setFormData] = useState({
    propertyTitle: "",
    propertyType: 0,
    propertyCategory: 0,
    propertyArea: "",
    bedRooms: "",
    bathRooms: "",
    propertyDescription: "",
    amenities: [] as AmenitiesOption[],
    location: "",
    price: "",
    currencyType: "",
    availableDate: new Date(),
    address: "",
    landmark: "",
    pinCode: "",
    city: "",
    state: "",
    country: "",
    propertyImages: [] as any[],
    latitude: 0,
    longitude: 0,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isEdit && propertyId) {
      fetchPropertyDetails();
    }
  }, [isEdit, propertyId]);

  const fetchPropertyDetails = async () => {
    if (!propertyId) return;

    try {
      const response = await api.get(API_ENDPOINTS.PROPERTIES.getDetail(propertyId.toString(), user?.userid || 0));
      const propertyData = response.data?.t_propertydetails_get_by_id?.[0];
      console.log("propertyData", propertyData);

      // Convert string amenities to Option format using the new parse function
      const amenitiesArray = propertyData.amenities ? parseAmenities(propertyData.amenities) : [];
      const amenitiesOptions = amenitiesArray
        .map(name => AMENITIES_OPTIONS.find(opt => opt.name === name))
        .filter((opt): opt is AmenitiesOption => opt !== undefined);

      setFormData({
        propertyTitle: propertyData?.propertytitle,
        propertyType: propertyData?.propertytypeid,
        propertyCategory: propertyData?.propertycategory,
        propertyArea: propertyData?.area != null ? propertyData.area.toString() : "",
        bedRooms: propertyData?.bedrooms != null ? propertyData.bedrooms.toString() : "0",
        bathRooms: propertyData?.bathrooms != null ? propertyData.bathrooms.toString() : "0",
        price: propertyData?.price != null ? propertyData.price.toString() : "",
        propertyDescription: propertyData?.propertydescription,
        amenities: amenitiesOptions,
        location: propertyData?.generallocation,

        currencyType: propertyData?.currencytype,
        availableDate: new Date(propertyData?.availabledate),
        address: propertyData?.address,
        landmark: propertyData?.landmark,
        pinCode: propertyData?.pincode,
        city: propertyData?.city,
        state: propertyData?.state,
        country: propertyData?.country,
        propertyImages: propertyData?.attachments || [],
        latitude: propertyData?.latitude,
        longitude: propertyData?.longitude,
      });
    } catch (error) {
      console.error('Error fetching property details:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch property details',
        position: 'bottom'
      });
    }
  };

  const handleImagePicker = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 10 - formData.propertyImages.length,
      quality: 0.4,
    };

    launchImageLibrary(options, (response: { errorCode?: string; errorMessage?: string; assets?: Asset[] }) => {
      if (response.errorCode) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.errorMessage || 'Failed to pick image',
          position: 'bottom'
        });
        return;
      }

      if (response.assets) {
        const newImages = response.assets.map((asset: Asset) => ({
          file: {
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          },
          preview: asset.uri,
        }));

        setFormData(prev => ({
          ...prev,
          propertyImages: [...prev.propertyImages, ...newImages],
        }));
      }
    });
  };

  const removeImage = (index) => {
    const imageToRemove = formData.propertyImages[index];
    
    // If it's an existing attachment (from the database), add to removal list
    if (imageToRemove.attachmentid) {
      setImagesToRemove(prev => [...prev, {
        attachmentid: imageToRemove.attachmentid,
        attachmenturl: imageToRemove.attachmenturl,
        attachmenttype: imageToRemove.attachmenttype || 'image',
        attachmentname: imageToRemove.attachmentname || 'image',
        isprimary: imageToRemove.isprimary || false
      }]);
    }
    
    // Remove from displayed images regardless of type
    setFormData(prev => ({
      ...prev,
      propertyImages: prev.propertyImages.filter((_, i) => i !== index),
    }));
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
  // Only hide the picker on Android, keep it open on iOS until dismissed
  if (Platform.OS === 'android') {
    setShowDatePicker(false);
  }
  
  if (selectedDate) {
    setFormData(prev => ({ ...prev, availableDate: selectedDate }));
  }
};

  // Update the validateForm function to handle property description properly
  const validateForm = () => {
    const newErrorMessages: { [key: string]: string } = {};
  
    if (!formData.propertyTitle) newErrorMessages.propertyTitle = "Property Title is required.";
    if (!formData.propertyType) newErrorMessages.propertyType = "Property Type is required.";
    if (!formData.propertyCategory) newErrorMessages.propertyCategory = "Property Category is required.";
    if (!formData.city) newErrorMessages.city = "City is required.";
    if (!formData.state) newErrorMessages.state = "State is required.";
    if (!formData.country) newErrorMessages.country = "Country is required.";
    if (!formData.pinCode) newErrorMessages.pinCode = "PIN Code is required.";
    if (!formData.price) newErrorMessages.price = "Price is required.";
    if (!formData.currencyType) newErrorMessages.currencyType = "Currency is required.";
    if (!formData.location) newErrorMessages.location = "Location is required.";
   
    // Only validate bedrooms and bathrooms for property types that need them
    const isPropertyTypeWithRooms = formData.propertyType !== 1 && formData.propertyType !== 4;
    if (isPropertyTypeWithRooms) {
      if (!formData.bedRooms) newErrorMessages.bedRooms = "Bedrooms is required.";
      if (!formData.bathRooms) newErrorMessages.bathRooms = "Bathrooms is required.";
    }
  
    setErrorMessages(newErrorMessages);
  
    if (Object.keys(newErrorMessages).length > 0) {
      // Show toast for validation errors
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all required fields',
        position: 'bottom'
      });
    }
  
    return Object.keys(newErrorMessages).length === 0;
  };

const handleSubmit = async () => {

  if (!user || !user.userid) {
    Toast.show({
      type: 'error',
      text1: 'Session Expired',
      text2: 'Please log in again.',
      position: 'bottom'
    });
    return
  }
  if (!validateForm()) return;

  setIsSubmitting(true);
  try {
    const formDataToSend = new FormData();
    
    // Append all form fields
    formDataToSend.append("userId", user?.userid.toString() || "");
    formDataToSend.append("propertyCategory", formData.propertyCategory.toString());
    formDataToSend.append("propertyType", formData.propertyType.toString());
    formDataToSend.append("propertyTitle", formData.propertyTitle);
    // Always provide at least an empty space string for description to avoid null/undefined errors give empty space
    formDataToSend.append("propertyDescription", formData.propertyDescription || " ");
    formDataToSend.append("address", formData.address || "");
    formDataToSend.append("location", formData.location);
    formDataToSend.append("landmark", formData.landmark || "");
    formDataToSend.append("pinCode", formData.pinCode);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("latitude", formData.latitude.toString());
    formDataToSend.append("longitude", formData.longitude.toString());
    formDataToSend.append("availableDate", formData.availableDate.toISOString());

    // Only append bedrooms and bathrooms if property type requires it
    const isPropertyTypeWithRooms = formData.propertyType !== 1 && formData.propertyType !== 4;
    if (isPropertyTypeWithRooms) {
      formDataToSend.append("bedRooms", formData.bedRooms);
      formDataToSend.append("bathRooms", formData.bathRooms);
    } else {
      // For Open Plot and Agriculture Land, set these to 0
      formDataToSend.append("bedRooms", "0");
      formDataToSend.append("bathRooms", "0");
    }

    // Fix the amenities array formatting
    const amenitiesArray = formData.amenities.map(a => a.name);



    if (isEdit && imagesToRemove.length > 0) {
      formDataToSend.append("attachmentsToRemove", JSON.stringify(imagesToRemove));
    } else {
      formDataToSend.append("attachmentsToRemove", "[]");
    }
    // Check if we're editing (updating) or creating
    if (isEdit) {
      // For updates (PUT requests): Send as direct JSON array
      formDataToSend.append("amenities", JSON.stringify(amenitiesArray));
      // formDataToSend.append("attachmentsToRemove", "[]"); // Add this line to remove existing attachments
    } else {
      // For creates (POST requests): Keep existing format with wrapper
      const amenitiesJson = JSON.stringify({ amenities: amenitiesArray });
      formDataToSend.append("amenities", amenitiesJson);
    }
    console.log(formData.propertyArea)
    formDataToSend.append("propertyArea", formData.propertyArea || "0");
    formDataToSend.append("currencyType", formData.currencyType);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("status", "Available");
    console.log(formDataToSend);
    // Append images
    formData.propertyImages.forEach((image, index) => {
      if (image.file) {
        formDataToSend.append("propertyImages", image.file);
      }
    });
    
    if (isEdit && propertyId !== undefined) {
      formDataToSend.append("propertyId", propertyId.toString());
      await api.put(
        API_ENDPOINTS.PROPERTIES.update(propertyId),
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json"
          },
        }
      );
    } else {
      await api.post(
        API_ENDPOINTS.PROPERTIES.CREATE,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json"
          },
        }
      );
    }

    await queryClient.invalidateQueries({ queryKey: ["userProperties"] });
    await queryClient.invalidateQueries({ queryKey: ["properties"] });

    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: isEdit ? 'Property updated successfully' : 'Property posted successfully',
      position: 'bottom'
    });

    setShowSuccess(true);
    // Navigate back to MyProperties screen after successful submission
    //navigation.goBack();
  } catch (error) {
    console.error('Error submitting property:', error);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Failed to submit property',
      position: 'bottom'
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const isBedroomsBathroomsDisabled = formData.propertyType === 1 || formData.propertyType === 4;

  const handleTypeChange = (option: Option | Option[]) => {
    const type = option as PropertyType;
    setFormData(prev => ({
      ...prev,
      propertyType: type.id,
      // Reset bedrooms and bathrooms when selecting plot or agriculture land
      ...(type.id === 1 || type.id === 4 ? { bedRooms: "0", bathRooms: "0" } : {})
    }));
    
    // Clear error messages when changing type
    setErrorMessages(prev => ({ 
      ...prev, 
      propertyType: "",
      // Also clear bedroom/bathroom errors if switching to a type that doesn't need them
      ...(type.id === 1 || type.id === 4 ? { bedRooms: "", bathRooms: "" } : {})
    }));
  }; 

  const handleCategoryChange = (option: Option | Option[]) => {
    const category = option as PropertyCategory;
    setFormData(prev => ({ ...prev, propertyCategory: category.id }));
    setErrorMessages(prev => ({ ...prev, propertyCategory: "" }));
  };

  const handleCurrencyChange = (option: Option | Option[]) => {
    const currency = option as CurrencyOption;
    setFormData(prev => ({ ...prev, currencyType: currency.name }));
    setErrorMessages(prev => ({ ...prev, currencyType: "" }));
  };

  const handleAmenitiesChange = (selectedOptions: Option | Option[]) => {
    const amenities = Array.isArray(selectedOptions)
      ? selectedOptions as AmenitiesOption[]
      : [];
    setFormData(prev => ({
      ...prev,
      amenities,
    }));
  };

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
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Property' : 'Add Property'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <TextInput
            style={[styles.input, errorMessages.propertyTitle ? styles.inputError : null]}
            placeholder="Property Title"
            placeholderTextColor={Colors.textSecondary}
            value={formData.propertyTitle}
            onChangeText={(text) => {
              if (text.length <= 75) {
                setFormData(prev => ({ ...prev, propertyTitle: text }));
                setErrorMessages(prev => ({ ...prev, propertyTitle: "" }));
              }
            }}
          />
          {errorMessages.propertyTitle && (
            <Text style={styles.errorText}>{errorMessages.propertyTitle}</Text>
          )}

          <Dropdown
            label="Select Category"
            value={formData.propertyCategory ?
              PROPERTY_CATEGORIES.find(c => c.id === formData.propertyCategory) as PropertyCategory :
              undefined}
            options={PROPERTY_CATEGORIES}
            onSelect={handleCategoryChange}
            error={errorMessages.propertyCategory}
          />

          <Dropdown
            label="Select Property Type"
            value={formData.propertyType ?
              PROPERTY_TYPES.find(t => t.id === formData.propertyType) as PropertyType :
              undefined}
            options={PROPERTY_TYPES}
            onSelect={handleTypeChange}
            error={errorMessages.propertyType}
          />

          <TextInput
            style={styles.input}
            placeholder="Area Size (in Sq.Ft/Sq.Yard)"

            placeholderTextColor={Colors.textSecondary}
            value={formData.propertyArea}
            onChangeText={(text) => {
              if (text.length <= 25) {
                setFormData(prev => ({ ...prev, propertyArea: text }));
              }
            }}
            keyboardType="default"
          />

          <TextInput
            style={[styles.input, isBedroomsBathroomsDisabled && styles.disabledInput]}
            placeholder="Bedrooms"
            value={formData.bedRooms}
            placeholderTextColor={Colors.textSecondary}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) {
                setFormData(prev => ({ ...prev, bedRooms: text }));
              }
            }}
            keyboardType="numeric"
            editable={!isBedroomsBathroomsDisabled}
          />

          <TextInput
            style={[styles.input, isBedroomsBathroomsDisabled && styles.disabledInput]}
            placeholder="Bathrooms"
            value={formData.bathRooms}
            placeholderTextColor={Colors.textSecondary}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) {
                setFormData(prev => ({ ...prev, bathRooms: text }));
              }
            }}
            keyboardType="numeric"
            editable={!isBedroomsBathroomsDisabled}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Property Description"
            value={formData.propertyDescription}
            placeholderTextColor={Colors.textSecondary}
            onChangeText={(text) => {
              if (text.length <= 2000) {
                setFormData(prev => ({ ...prev, propertyDescription: text }));
              }
            }}

            multiline={true}
            numberOfLines={4}
            blurOnSubmit={true}
            onKeyPress={handleKeyPress}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
            
            
          />

          <Dropdown
            label="Select Amenities"
            value={formData.amenities}
            options={AMENITIES_OPTIONS}
            onSelect={handleAmenitiesChange}
            isMulti
          />

          {formData.amenities.length > 0 && (
            <View style={styles.amenitiesContainer}>
              {formData.amenities.map((amenity) => (
                <View key={amenity.id} style={styles.amenityTag}>
                  <Text style={styles.amenityText}>{amenity.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setFormData(prev => ({
                        ...prev,
                        amenities: prev.amenities.filter(a => a.id !== amenity.id),
                      }));
                    }}
                  >
                    <Icon name="close" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TextInput
            style={[styles.input, errorMessages.location ? styles.inputError : null]}
            placeholder="Location"
            value={formData.location}
            placeholderTextColor={Colors.textSecondary}
            onChangeText={(text) => {
              if (text.length <= 75) {
                setFormData(prev => ({ ...prev, location: text }));
                setErrorMessages(prev => ({ ...prev, location: "" }));
              }
            }}
          />
          {errorMessages.location && (
            <Text style={styles.errorText}>{errorMessages.location}</Text>
          )}

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={[
                  styles.input,
                  errorMessages.price ? styles.inputError : null
                ]}
                placeholder="Price"
                value={formData.price}
                placeholderTextColor={Colors.textSecondary}
                onChangeText={(text) => {
                  if (/^\d*$/.test(text) && text.length <= 15) {
                    setFormData(prev => ({ ...prev, price: text }));
                    setErrorMessages(prev => ({ ...prev, price: "" }));
                  }
                }}
                keyboardType="numeric"
              />
              {errorMessages.price && (
                <Text style={styles.errorText}>{errorMessages.price}</Text>
              )}
            </View>

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Dropdown
                label="Currency"
                value={formData.currencyType ?
                  CURRENCY_OPTIONS.find(c => c.name === formData.currencyType) as CurrencyOption :
                  undefined}
                options={CURRENCY_OPTIONS}
                onSelect={handleCurrencyChange}
                error={errorMessages.currencyType}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.placeholderText}>
              {formData.availableDate.toLocaleDateString()}
            </Text>
            <Icon name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>

          <View style={styles.locationDetails}>
            <Text style={styles.sectionTitle}>Location Details</Text>

            <TextInput
              style={styles.input}
              value={formData.address}
              placeholderTextColor="#666666"
              placeholder="Address"
              onChangeText={(text) => {
                if (text.length <= 75) {
                  setFormData(prev => ({ ...prev, address: text }));
                }
              }}
            />

            <TextInput
              style={styles.input}
              placeholder="Landmark"
              value={formData.landmark}
              placeholderTextColor={Colors.textSecondary}
              onChangeText={(text) => {
                if (text.length <= 60) {
                  setFormData(prev => ({ ...prev, landmark: text }));
                }
              }}
            />

            <TextInput
              style={[styles.input, errorMessages.pinCode ? styles.inputError : null]}
              placeholder="PIN Code"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="numeric"
              value={formData.pinCode}
              onChangeText={(text) => {
                if (text.length <= 10) {
                  setFormData(prev => ({ ...prev, pinCode: text }));
                  setErrorMessages(prev => ({ ...prev, pinCode: "" }));
                }
              }}
            />
            {errorMessages.pinCode && (
              <Text style={styles.errorText}>{errorMessages.pinCode}</Text>
            )}

            <TextInput
              style={[styles.input, errorMessages.city ? styles.inputError : null]}
              placeholder="City"
              value={formData.city}
              placeholderTextColor={Colors.textSecondary}
              onChangeText={(text) => {
                if (text.length <= 30) {
                  setFormData(prev => ({ ...prev, city: text }));
                  setErrorMessages(prev => ({ ...prev, city: "" }));
                }
              }}
            />
            {errorMessages.city && (
              <Text style={styles.errorText}>{errorMessages.city}</Text>
            )}

            <TextInput
              style={[styles.input, errorMessages.state ? styles.inputError : null]}
              placeholder="State"
              value={formData.state}
              placeholderTextColor={Colors.textSecondary}
              onChangeText={(text) => {
                if (text.length <= 25) {
                  setFormData(prev => ({ ...prev, state: text }));
                  setErrorMessages(prev => ({ ...prev, state: "" }));
                }
              }}
            />
            {errorMessages.state && (
              <Text style={styles.errorText}>{errorMessages.state}</Text>
            )}

            <TextInput
              style={[styles.input, errorMessages.country ? styles.inputError : null]}
              placeholder="Country"
              value={formData.country}
              placeholderTextColor={Colors.textSecondary}
              onChangeText={(text) => {
                if (text.length <= 20) {
                  setFormData(prev => ({ ...prev, country: text }));
                  setErrorMessages(prev => ({ ...prev, country: "" }));
                }
              }}
            />
            {errorMessages.country && (
              <Text style={styles.errorText}>{errorMessages.country}</Text>
            )}
          </View>

          <View style={styles.imageSection}>
            <View style={styles.imageSectionHeader}>
              <Text style={styles.sectionTitle}>Upload Images</Text>
              <Text style={styles.imageCount}>
                {formData.propertyImages.length}/10
              </Text>
            </View>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImagePicker}
              disabled={formData.propertyImages.length >= 10}
            >
              <Text style={styles.uploadText}>Choose Images</Text>
            </TouchableOpacity>

            {formData.propertyImages.length > 0 && (
              <View style={styles.imageGrid}>
                {formData.propertyImages.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image
                      source={{ uri: image.preview || image.attachmenturl }}
                      style={styles.imagePreview}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Icon name="close-circle" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitText}>
              {isSubmitting ? 'Submitting...' : isEdit ? 'Update Property' : 'Post Property'}
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

      // First, modify how you display the DateTimePicker
{showDatePicker && (
  Platform.OS === 'ios' ? (
    // iOS-specific modal with picker and buttons
    <Modal
      transparent={true}
      visible={showDatePicker}
      animationType="slide"
    >
      <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setShowDatePicker(false);
                    // If no date was selected, the current formData.availableDate remains
                  }}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={formData.availableDate}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setFormData(prev => ({ ...prev, availableDate: selectedDate }));
                  }
                }}
                minimumDate={new Date()}
                style={{ width: '100%' }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  ) : (
    // Android uses the default picker which closes automatically
    <DateTimePicker
      value={formData.availableDate}
      mode="date"
      display="default"
      onChange={handleDateChange}
      minimumDate={new Date()}
    />
  )
)}

      <SuccessModal
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigation.goBack();
        }}
      />

      {/* Add Toast Component at the root level */}
      <Toast />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    
  },

  disabledInput: {
    backgroundColor: '#f0f0f0',  // Light gray background to indicate disabled state
    color: '#999',               // Lighter text color
    borderColor: '#ddd',         // Lighter border color
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  placeholderText: {
    fontSize: scaledSize(16),
    color: Colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    gap: scaledSize(10),
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaledSize(8),
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    paddingHorizontal: scaledSize(12),
    paddingVertical: scaledSize(6),
    gap: scaledSize(8),
  },
  amenityText: {
    fontSize: scaledSize(14),
    color: Colors.primary,
  },
  locationDetails: {
    gap: scaledSize(15),
  },
  sectionTitle: {
    ...Typography.h3,
    marginTop: scaledSize(10),
  },
  imageSection: {
    gap: scaledSize(15),
  },
  imageSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageCount: {
    fontSize: scaledSize(14),
    color: Colors.textSecondary,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaledSize(10),
  },
  imageContainer: {
    width: (width - scaledSize(60)) / 3,
    height: (width - scaledSize(60)) / 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: scaledSize(4),
    right: scaledSize(4),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  uploadButton: {
    height: scaledSize(50),
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: Colors.primary,
    fontSize: scaledSize(16),
    fontWeight: '500',
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

  // Add these new styles
modalOverlay: {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
},
datePickerContainer: {
  backgroundColor: 'white',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingBottom: 20,
},
datePickerHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: Colors.border,
},
cancelButtonText: {
  fontSize: 16,
  color: Colors.textSecondary,
},
doneButtonText: {
  fontSize: 16,
  color: Colors.primary,
  fontWeight: '500',
},
});

export default AddProperty; 