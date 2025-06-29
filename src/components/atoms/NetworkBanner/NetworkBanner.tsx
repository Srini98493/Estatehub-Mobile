import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { Colors, normalize } from '@/theme/globalStyles';
import { useNetwork } from '@/context/NetworkContext';

const NetworkBanner = () => {
  const { isConnected } = useNetwork();
  const [showBanner, setShowBanner] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isConnected) {
      // Show "Back Online" message
      setShowBanner(true);
      
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Hide after 5 seconds
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowBanner(false);
        });
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      // Show "No Internet" message immediately
      setShowBanner(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected, fadeAnim]);

  if (!showBanner && isConnected) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        isConnected ? styles.onlineContainer : styles.offlineContainer,
        { opacity: fadeAnim }
      ]}
    >
      <Text style={styles.text}>
        {isConnected ? 'Back Online' : 'No Internet Connection'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: normalize(60), // Position just above the tab bar
    zIndex: 999,
  },
  offlineContainer: {
    backgroundColor: Colors.error,
  },
  onlineContainer: {
    backgroundColor: Colors.success,
  },
  text: {
    color: Colors.textWhite,
    fontSize: normalize(14),
    fontWeight: '500',
  },
});

export default NetworkBanner; 