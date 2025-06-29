import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Cards, normalize } from "@/theme/globalStyles";

const Purpose = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  
  const handlePurposeSelection = (purpose: 'buy' | 'sell') => {
    // Navigate to BasicInfo with purpose parameter
    navigation.navigate('BasicInfo', { purpose });
  };

  const isTablet = width >= 768;
  
  const PurposeCard = ({ title, imageSource, onPress }) => (
    <TouchableOpacity 
      style={[
        styles.card,
        isTablet && styles.cardTablet,
      ]} 
      onPress={onPress}
    >
      <Image 
        source={imageSource}
        style={[
          styles.cardImage,
          isTablet && styles.cardImageTablet,
        ]}
        resizeMode="contain"
      />
      <Text style={[
        styles.cardText,
        isTablet && styles.cardTextTablet,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image 
          source={require('../../theme/assets/images/back-arrow.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Text style={[
        styles.title,
        isTablet && styles.titleTablet
      ]}>
        Your Purpose?
      </Text>

      <View style={[
        styles.cardsContainer,
        isTablet && styles.cardsContainerTablet
      ]}>
        <PurposeCard
          title="I want to buy a Property"
          imageSource={require('../../theme/assets/images/Buy_Prop.png')}
          onPress={() => handlePurposeSelection('buy')}
        />
        <PurposeCard
          title="I want to sell a property"
          imageSource={require('../../theme/assets/images/Sell_Prop.png')}
          onPress={() => handlePurposeSelection('sell')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  titleTablet: {
    fontSize: 48,
    marginBottom: 60,
  },
  cardsContainer: {
    gap: 20,
  },
  cardsContainerTablet: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  card: {
    width: '48%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: Colors.backgroundLight,
    ...Cards.cardShadow,
  },
  cardTablet: {
    padding: 40,
    flex: 1,
    maxWidth: 400,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
    color: "#000"
  },
  cardTextTablet: {
    fontSize: 24,
    marginTop: 24,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  cardImage: {
    width: 32,
    height: 32,
    tintColor: '#00A0DC',
  },
  cardImageTablet: {
    width: 48,
    height: 48,
  },
});

export default Purpose;
