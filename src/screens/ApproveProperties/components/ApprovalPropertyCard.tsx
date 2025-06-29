import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Colors, Typography, normalize } from "@/theme/globalStyles";
import {
  Check,
  X,
  MapPin,
  Home,
  Calendar,
  IndianRupee,
} from "lucide-react-native";
import { applyShadow } from "@/utils/styleUtils";
import { MyProperty } from "@/hooks/queries/useMyProperties";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - normalize(32);
const IMAGE_HEIGHT = CARD_WIDTH * 0.5;

interface ApprovalPropertyCardProps {
  item: MyProperty;
  isProcessing: boolean;
  onApprove: () => void;
  navigation: any;
}

const ApprovalPropertyCard: React.FC<ApprovalPropertyCardProps> = ({
  item,
  isProcessing,
  onApprove,
  navigation,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-IN");
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate("PropertyDetails", { propertyId: item.propertyid });
      }}
    >
      <Image
        source={
          item.attachments?.[0]?.attachmenturl
            ? { uri: item.attachments?.[0]?.attachmenturl }
            : require("@/theme/assets/images/logo_4.png")
        }
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.propertytitle}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MapPin size={16} color={Colors.primary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {item.city}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Home size={16} color={Colors.primary} />
            <Text style={styles.infoText}>{item.propertytype}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Calendar size={16} color={Colors.primary} />
            <Text style={styles.infoText}>
              {item.bookingdate ? formatDate(item.bookingdate) : "Not booked"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <IndianRupee size={16} color={Colors.primary} />
            <Text style={styles.infoText}>
            {item.currencytype} {formatPrice(item.price)}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.propertydescription || "No description available"}
        </Text>

        <View style={styles.divider} />

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => onApprove(item.propertyid)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color={Colors.textWhite} />
            ) : (
              <>
                <Check size={16} color={Colors.textWhite} />
                <Text style={styles.actionButtonText}>Approve</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: Colors.backgroundLight,
    borderRadius: normalize(16),
    overflow: "hidden",
    ...applyShadow(4),
  },
  image: {
    width: "100%",
    height: IMAGE_HEIGHT,
  },
  contentContainer: {
    padding: normalize(16),
  },
  title: {
    ...Typography.h3,
    marginBottom: normalize(12),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: normalize(8),
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: normalize(4),
  },
  infoText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: normalize(8),
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: normalize(16),
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: normalize(12),
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(8),
    flex: 1,
    gap: normalize(6),
  },
  approveButton: {
    backgroundColor: Colors.success,
  },
  rejectButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    ...Typography.buttonText,
    color: Colors.textWhite,
  },
});

export default ApprovalPropertyCard;
