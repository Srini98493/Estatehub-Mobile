import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "@/components/base";
import Icon from "react-native-vector-icons/Ionicons";
import { PropertyDetails } from "@/hooks/queries/useFavorites";
import { Colors, Typography, Cards, normalize } from "@/theme/globalStyles";
import { applyShadow } from "@/utils/styleUtils";

interface FavoritePropertyCardProps {
  property: PropertyDetails;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: number, isFavorite: boolean) => void;
  isLoading: boolean;
  viewType: "grid" | "list";
  navigation: any;
}

const FavoritePropertyCard: React.FC<FavoritePropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
  isLoading,
  viewType,
  navigation,
}) => {
  if (viewType === "list") {
    return (
      <TouchableOpacity
        style={styles.listCard}
        onPress={() =>
          navigation.navigate("PropertyDetails", {
        propertyId: property.propertyid,
          })
        }
      >
        <Image
          source={{
        uri: property.attachments?.[0]?.attachmenturl || "@/theme/assets/images/NoImgUploaded.jpeg",
          }}
          style={styles.listImage}
        />
        <View style={styles.listContent}>
          <Text style={styles.title}>{property.propertytitle}</Text>
          <Text style={styles.propertyType}>
        {property.bedrooms} BHK • {property.city}
          </Text>
          <Text style={styles.price}>
        {property.currencytype} {property.price?.toLocaleString()}
          </Text>
          <View style={styles.locationRow}>
        <Icon
          name="location-outline"
          size={16}
          color={Colors.textSecondary}
        />
        <Text style={styles.location}>{property.generallocation}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(property.propertyid, isFavorite)}
          disabled={isLoading}
        >
          <Icon
        name={isFavorite ? "heart" : "heart-outline"}
        size={24}
        color={isFavorite ? Colors.error : Colors.textSecondary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  // Grid view (existing card layout)
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("PropertyDetails", {
          propertyId: property.propertyid,
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.attachments?.[0]?.attachmenturl }}
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(property.propertyid, isFavorite)}
          disabled={isLoading}
        >
          <Icon
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? Colors.error : Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{property.propertytitle}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.propertyType}>
            {property.bedrooms} BHK • {property.city}
          </Text>
        </View>
        <Text style={styles.price}>
          {property.currencytype} {property.price?.toLocaleString()}
        </Text>
        <View style={styles.locationRow}>
          <Icon
            name="location-outline"
            size={16}
            color={Colors.textSecondary}
          />
          <Text style={styles.location}>{property.generallocation}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    ...applyShadow(3, "rgba(0, 0, 0, 0.25)"),
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  propertyType: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  listCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    ...Cards.cardShadow,
  },
  listImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  listContent: {
    flex: 1,
    padding: 12,
  },
  gridCard: {
    backgroundColor: Colors.backgroundLight,
    shadowColor: Colors.textPrimary,
  },
  propertyLocation: {
    color: Colors.textSecondary,
  },
  propertyPrice: {
    color: Colors.primary,
  },
  propertyMeta: {
    // ... existing code ...
  },
  metaText: {
    color: Colors.textSecondary,
  },
});

export default FavoritePropertyCard;
