import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { normalize } from '../utils/dimensions';

export const SocialSignup = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.socialButton}>
        <Image
          source={require('@/theme/assets/images/Facebook.png')}
          style={styles.socialIcon}
        />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.socialButton}>
        <Image
          source={require('@/theme/assets/images/Google.png')}
          style={styles.socialIcon}
        />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.socialButton}>
        <Image
          source={require('@/theme/assets/images/Apple.png')}
          style={styles.socialIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: normalize(20),
  },
  socialButton: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: normalize(24),
    height: normalize(24),
  },
}); 