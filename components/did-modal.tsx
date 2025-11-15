import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X, ExternalLink } from "lucide-react-native";
import type { Achievement } from "../types";

interface DIDModalProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
  didCode: string;
  achievements: Achievement[];
  contributionsCount: number;
}

export default function DIDModal({
  visible,
  onClose,
  userName,
  didCode,
  achievements,
  contributionsCount,
}: DIDModalProps) {
  const badgesCount = achievements.length;
  const totalImpactScore = achievements.reduce(
    (sum, achievement) => sum + achievement.impactScore,
    0
  );
  const averageImpactScore = badgesCount > 0 
    ? Math.round((totalImpactScore / badgesCount) * 10) 
    : 0;

  // Tạo URL với thông tin DID để encode vào QR code
  const qrData = JSON.stringify({
    did: didCode,
    name: userName,
    badges: badgesCount,
    impactScore: averageImpactScore,
    contributions: contributionsCount,
  });

  const handleBlockchainExplorer = () => {
    // URL của blockchain explorer (có thể thay đổi tùy theo blockchain network)
    const explorerUrl = `https://explorer.byteedu.com/did/${didCode}`;
    Linking.openURL(explorerUrl).catch((err) =>
      console.error("Error opening explorer:", err)
    );
  };

  console.log("DIDModal render - visible:", visible, "achievements:", achievements?.length);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={1}
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalTitle}>
              Danh tính phi tập trung (DID)
            </Text>

            <View style={styles.qrContainer}>
              <View style={styles.qrWrapper}>
                <View style={styles.qrPlaceholder}>
                  <Text style={styles.qrPlaceholderText}>QR Code</Text>
                  <Text style={styles.qrPlaceholderSubtext}>
                    {didCode.substring(0, 20)}...
                  </Text>
                </View>
              </View>
              <Text style={styles.qrInstruction}>
                Quét để xác minh danh tính
              </Text>
            </View>

            <View style={styles.userInfoSection}>
              <Text style={styles.userName}>{userName}</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mã DID:</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {didCode}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Huy hiệu:</Text>
                <Text style={styles.infoValue}>
                  {badgesCount} đạt được
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ImpactScore:</Text>
                <Text style={styles.infoValue}>{averageImpactScore}/100</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Đóng góp:</Text>
                <Text style={styles.infoValue}>{contributionsCount}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.explorerButton}
              onPress={handleBlockchainExplorer}
              activeOpacity={0.7}
            >
              <ExternalLink size={18} color="#3B82F6" />
              <Text style={styles.explorerButtonText}>
                Xem trên Blockchain Explorer
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: "#334155",
    position: "relative",
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scrollView: {
    width: "100%",
    flexGrow: 0,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 56,
    paddingBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 24,
    textAlign: "center",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  qrWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 240,
    minWidth: 240,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
  },
  qrPlaceholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  qrPlaceholderSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
  qrInstruction: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
  userInfoSection: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  infoLabel: {
    fontSize: 14,
    color: "#94A3B8",
    flex: 1,
    marginRight: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "right",
  },
  explorerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  explorerButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3B82F6",
  },
});

