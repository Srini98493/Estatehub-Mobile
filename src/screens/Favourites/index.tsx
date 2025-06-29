import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Text } from "@/components/base";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFavorites } from "@/hooks/queries/useFavorites";
import FavoritePropertyCard from "@/components/FavoritePropertyCard";
import Icon from "react-native-vector-icons/Ionicons";
import AuthCheck from "@/components/AuthCheck";
import { useAuthStore } from "@/store/useAuthStore";
import { Colors, Layout, Typography, normalize } from "@/theme/globalStyles";
import { applyShadow } from "@/utils/styleUtils";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
const { width } = Dimensions.get("window");

const Favourites = () => {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  const {
    favorites,
    addFavorite,
    removeFavorite,
    isAddingFavorite,
    isRemovingFavorite,
    refetch,
    isLoading,
  } = useFavorites();

  const { checkAndHandleTokenExpiry } = useAuthStore();

  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    // Check token validity when the component mounts
    checkAndHandleTokenExpiry();

    // Set up interval to periodically check token validity
    const tokenCheckInterval = setInterval(() => {
      checkAndHandleTokenExpiry();
    }, 60000); // Check every minute

    return () => clearInterval(tokenCheckInterval);
  }, [checkAndHandleTokenExpiry]);

  useFocusEffect(
    useCallback(() => {
      // Call your fetch favorites function here
      refetch();
      
      return () => {
        // Optional cleanup if needed
      };
    }, [refetch])
  );

  const handleToggleFavorite = async (
    propertyId: number,
    isFavorite: boolean
  ) => {
    try {
      if (isFavorite) {
        await removeFavorite(propertyId);
      } else {
        await addFavorite(propertyId);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing favorites:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <AuthCheck>
      <SafeAreaView style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favorites</Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewType === "grid" && styles.activeToggle,
              ]}
              onPress={() => setViewType("grid")}
            >
              <Icon
                name="grid-outline"
                size={24}
                color={
                  viewType === "grid" ? Colors.primary : Colors.textSecondary
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewType === "list" && styles.activeToggle,
              ]}
              onPress={() => setViewType("list")}
            >
              <Icon
                name="list-outline"
                size={24}
                color={
                  viewType === "list" ? Colors.primary : Colors.textSecondary
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            style={styles.list}
            data={favorites?.data}
            renderItem={({ item }) => (
              <View style={styles.cardContainer}>
                <FavoritePropertyCard
                  property={item?.property_details}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                  isLoading={isAddingFavorite || isRemovingFavorite}
                  viewType={viewType}
                  navigation={navigation}
                />
              </View>
            )}
            keyExtractor={(item) => item?.propertyid?.toString()}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No favorites found</Text>
              </View>
            )}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </SafeAreaView>
    </AuthCheck>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    zIndex: 1
  },
  headerTitle: {
    ...Typography.pageHeading,
    flex: 1,
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: Colors.backgroundLight,
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 0,
  },
  list: {
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginBottom: 20,
  },
  emptyContainer: {
    ...Layout.emptyContainer,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Favourites;