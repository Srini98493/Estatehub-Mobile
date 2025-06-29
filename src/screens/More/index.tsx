import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { Text } from "@/components/base";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuthStore } from "@/store/useAuthStore";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "@/types/navigation";
import { useFocusEffect } from "@react-navigation/native";
import { Colors, Layout, Typography, normalize } from "@/theme/globalStyles";
import { applyShadow } from "@/utils/styleUtils";
import { api } from '@/services/api/apiConfig';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import Toast from 'react-native-toast-message';
import SupportModal from "./ModalSupport";
// Import DeviceInfo to get app version information
import DeviceInfo from "react-native-device-info";

type MoreScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface MoreProps {
  navigation: MoreScreenNavigationProp;
}

const MenuItem = ({
  icon,
  label,
  onPress,
  showArrow = true,
  textColor = Colors.textPrimary,
  iconColor = Colors.primary,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  showArrow?: boolean;
  textColor?: string;
  iconColor?: string;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Icon name={icon} size={24} color={iconColor} />
    <Text style={[styles.menuLabel, { color: textColor }]}>{label}</Text>
    {showArrow && (
      <Icon name="chevron-forward" size={20} color={Colors.textSecondary} />
    )}
  </TouchableOpacity>
);

const More: React.FC<MoreProps> = ({ navigation }) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  
  // Get app version and build number
  const appVersion = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();

  console.log("user", user, isAuthenticated);

  const refreshData = useCallback(() => {
    // Refresh data logic here
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshData();

        // Set white status bar with dark content
              StatusBar.setBarStyle('dark-content');
              StatusBar.setBackgroundColor('#FFFFFF');
    }, [refreshData, isAuthenticated, user])
  );

  const deleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(API_ENDPOINTS.AUTH.DELETE_USER);
              
              Toast.show({
                type: 'success',
                text1: 'Account Deleted',
                text2: 'Your account has been successfully deleted',
                position: 'bottom',
              });
              
              // Logout the user after successful deletion
              logout();
              
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error instanceof Error ? error.message : 'Failed to delete account',
                position: 'bottom',
              });
              console.error('Error deleting account:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const navigateToFavourites = () => {
    try {
      // Check if user is authenticated before navigating
      if (!isAuthenticated) {
        Toast.show({
          type: 'info',
          text1: 'Login Required',
          text2: 'Please login to view your favorites',
          position: 'bottom',
          visibilityTime: 3000,
        });
        navigation.navigate("Auth");
        return;
      }
      
      // Navigate to the Favourites screen
      navigation.navigate("Favourites");
      
    } catch (error) {
      console.error("Navigation error:", error);
      Toast.show({
        type: 'error',
        text1: 'Navigation Error',
        text2: 'Could not navigate to Favourites',
        position: 'bottom',
      });
    }
  };

  const openSupportModal = () => {
    setSupportModalVisible(true);
  };

  const closeSupportModal = () => {
    setSupportModalVisible(false);
  };

  const getMenuItems = () => {
    const baseItems = [
      {
        icon: "heart-outline",
        label: "Favourites",
        onPress: navigateToFavourites,
      },
      {
        icon: "card-outline",
        label: "Apply Home Loan",
        onPress: () => navigation.navigate("ApplyHomeLoan"),
      },
      {
        icon: "chatbubble-ellipses-outline",
        label: "Contact Us",
        onPress: openSupportModal,
      },
    ];

    return baseItems;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileContainer}>
          <Image
            source={require("@/theme/assets/images/profile.png")}
            style={styles.profileImage}
          />
          {isAuthenticated ? (
            <>
              <Text style={styles.username}>{user?.username}</Text>
              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Auth")}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.menuContainer}>
        {getMenuItems().map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            label={item.label}
            onPress={item.onPress}
          />
        ))}
        {isAuthenticated && (
          <>
            <MenuItem
              icon="trash-outline"
              label="Delete Account"
              onPress={deleteAccount}
              showArrow={false}
              textColor={Colors.error}
              iconColor={Colors.error}
            />
          </>
        )}
        
        
      </View>
      
      {/* App Version Display */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>
          Version {buildNumber}.{appVersion}
        </Text>
      </View>

      {/* Support Modal */}
      <SupportModal 
        visible={supportModalVisible} 
        onClose={closeSupportModal} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.safeContainer,
    paddingTop: normalize(16),
    marginTop:Platform.OS === 'android' ? 28 : 0
  },
  profileSection: {
    paddingTop: normalize(20),
    paddingBottom: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.backgroundLight,
  },
  profileContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundLight,
    ...applyShadow(4),
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: Colors.error,
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  logoutText: {
    ...Typography.buttonText,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 50,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  loginText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: "600",
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    backgroundColor: Colors.backgroundLight,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 15,
  },
  header: {
    backgroundColor: Colors.backgroundLight,
  },
  headerTitle: {
    ...Typography.pageHeading,
    color: Colors.textPrimary,
  },
  profileInfo: {
    // ... existing code ...
  },
  profileName: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  profileEmail: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  editProfileButton: {
    // ... existing code ...
    backgroundColor: Colors.primary,
  },
  editProfileText: {
    ...Typography.caption,
    color: Colors.textWhite,
  },
  menuSection: {
    // ... existing code ...
    backgroundColor: Colors.backgroundLight,
  },
  menuIcon: {
    color: Colors.primary,
  },
  menuText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  menuArrow: {
    color: Colors.textSecondary,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 10,
  },
  versionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 10,
  },
});

export default More;