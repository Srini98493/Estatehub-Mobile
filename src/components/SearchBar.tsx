import React, { useCallback, useState } from 'react';
import { 
  TextInput, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ImageBackground, 
  Alert, 
  Image, 
  Platform
} from 'react-native';
import { useSearchProperties } from '@/hooks/queries/useSearchProperties';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Colors, Typography, Inputs, normalize } from "@/theme/globalStyles";
import { applyShadow } from '@/utils/styleUtils';
import Icon from "react-native-vector-icons/Ionicons";
import { useAuthStore } from '@/store/useAuthStore';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/types/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SearchBar = ({ name }: { name: string }) => {
    const [searchText, setSearchText] = useState('');
    const [searchParams, setSearchParams] = useState({
        propertyCategory: 'null',
        propertyType: 'null',
        city: '',
        minPrice: 'null',
        maxPrice: 'null',
        minArea: 'null',
        minBedrooms: 'null',
        maxBedrooms: 'null',
        userId: null,
    });
    
    // Access authentication state from the store
    const { isAuthenticated } = useAuthStore();

    useFocusEffect(
        useCallback(() => {
            setSearchText('');
        }, [])
    );

    const navigation = useNavigation<NavigationProp>();

    const handleSearch = (propertyCategory: number) => {
        if (!searchText.trim()) {
            Alert.alert('Search Required', 'Please enter a city to search');
            return;
        }

        const updatedParams = {
            ...searchParams,
            city: searchText.trim(),
            propertyCategory: propertyCategory?.toString()
        };

        setSearchParams(updatedParams);
        navigation.navigate("Properties", { searchParams: updatedParams });
    };

    // Handle Post Property Ad with authentication check
    const handlePostPropertyAd = () => {
        if (isAuthenticated) {
            navigation.navigate('AddProperty', { isEdit: false });
        } else {
            navigation.navigate('Auth');
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('@/theme/assets/images/Group_3465078.png')} style={styles.imagebackground}>
                <View style={styles.contentWrapper}>
                    <Text style={[Typography.headerTitle, styles.welcomeText]} numberOfLines={1} ellipsizeMode="tail">
                        Welcome {name}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Search by City"
                        placeholderTextColor={Colors.textLight}
                        value={searchText}
                        onChangeText={setSearchText}
                    />

                    {/* Main action row with post ad and search buttons */}
                    <View style={styles.actionsContainer}>
                        {/* Post Free Property Ad button - Left side */}
                        <TouchableOpacity
                            onPress={handlePostPropertyAd}
                            activeOpacity={0.8}
                            style={styles.postAdButtonWrapper}
                        >
                            <View style={styles.postAdButton}>
                                <Icon name="add-circle-outline" size={18} color="#FFFFFF" style={styles.postAdIcon} />
                                <View style={styles.postAdTextContainer}>
                                    <Text style={styles.postAdText}>Post Free</Text>
                                    <Text style={styles.postAdText}>Property Ad</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* For Sale and To Rent buttons - Right side */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.forSaleButton, !searchText.trim() && styles.forSaleButton]}
                                onPress={() => handleSearch(1)}
                            >
                                <Text style={styles.forSaleButtonText}>For Sale</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toRentButton, !searchText.trim() && styles.toRentButton]}
                                onPress={() => handleSearch(2)}
                            >
                                <Text style={[styles.toRentButtonText, !searchText.trim() && styles.toRentButtonText]}>To Rent</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 180, // Changed from fixed flex to minimum height
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: Colors.backgroundLight,
        ...applyShadow(2, 'rgba(0, 0, 0, 0.1)'),
    },
    imagebackground: {
        flex: 1,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
        minHeight: 180, // Add minimum height to prevent collapse
    },
    contentWrapper: {
        padding: 8,
        paddingBottom: 12, // Add extra padding at the bottom
    },
    welcomeText: {
        color: '#FFFFFF',
        marginBottom: 10,
        marginTop: Platform.OS === 'ios' ? 5 : 5,
        flexWrap: 'wrap', // Allow text to wrap
        minHeight: 0, // Ensure minimum height for text
    },
    input: {
        height: 45,
        paddingHorizontal: 10,
        backgroundColor: Colors.background,
        borderRadius: 8,
        marginBottom: 8, // Use marginBottom instead of marginRight
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        flexWrap: 'wrap', // Allow wrapping if needed
        minHeight: 45, // Ensure minimum height for buttons
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 5, // Add some spacing from the post ad button
    },
    forSaleButton: {
        width: 80,
        backgroundColor: '#315F6E',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginLeft: 5,
    },
    forSaleButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    toRentButton: {
        width: 80,
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginLeft: 5,
    },
    toRentButtonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 12,
    },
    postAdButtonWrapper: {
        width: 110,
        height: 45,
        flexShrink: 0, // Prevent shrinking
    },
    postAdButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 8,
        height: '100%',
        backgroundColor: "#EA7500",
        ...applyShadow(2, 'rgba(0, 0, 0, 0.1)'),
    },
    postAdIcon: {
        marginRight: 4,
    },
    postAdTextContainer: {
        flexDirection: 'column',
    },
    postAdText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 16,
    },
});

export default SearchBar;