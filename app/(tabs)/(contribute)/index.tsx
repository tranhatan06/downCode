import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Video,
  Camera,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Users,
  Lightbulb,
  Heart,
  GraduationCap,
  Trophy,
  History,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import type { ContributionType, Achievement } from "../../../types";
import VideoPreview from "../../../components/video-preview";
import ContributionForm from "../../../components/contribution-form";
import AchievementHistory from "../../../components/achievement-history";

type VerificationState = "idle" | "preview" | "form" | "scanning" | "failed" | "duplicate" | "success";
type ViewMode = "contribute" | "history";

const ACHIEVEMENTS_STORAGE_KEY = "@achievements";

export default function ContributeScreen() {
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<VerificationState>("idle");
  const [viewMode, setViewMode] = useState<ViewMode>("contribute");
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [scanProgress] = useState(new Animated.Value(0));
  const [uploadCount, setUploadCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<ContributionType | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setVideoUri(result.assets[0].uri);
      setState("preview");
    }
  };

  const recordVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission denied");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["videos"],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setVideoUri(result.assets[0].uri);
      setState("preview");
    }
  };

  const handleVideoConfirm = () => {
    setState("form");
  };

  const handleVideoRemove = () => {
    setVideoUri(null);
    setState("idle");
  };

  const loadAchievements = async () => {
    try {
      const stored = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAchievements(parsed);
      }
    } catch (error) {
      console.error("Error loading achievements:", error);
    }
  };

  const saveAchievement = async (achievement: Achievement) => {
    try {
      const updated = [achievement, ...achievements];
      await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updated));
      setAchievements(updated);
    } catch (error) {
      console.error("Error saving achievement:", error);
    }
  };

  const handleFormSubmit = () => {
    if (selectedCategory && title.trim().length > 0) {
      startVerification();
    }
  };

  const startVerification = () => {
    setState("scanning");
    scanProgress.setValue(0);
    setUploadCount((count) => count + 1);
    Animated.timing(scanProgress, {
      toValue: 100,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      let result: VerificationState;

      // Sử dụng modulo để tạo chu trình: 0 -> success, 1 -> duplicate, 2 -> failed
      switch (uploadCount % 3) {
        case 0:
          result = "success";
          break;
        case 1:
          result = "duplicate";
          break;
        case 2:
          result = "failed";
          break;
        default:
          result = "idle";
    }
    setTimeout(() => {
      setState(result);
      
      // Lưu achievement khi thành công
      if (result === "success" && selectedCategory && title) {
        const newAchievement: Achievement = {
          id: Date.now().toString(),
          category: selectedCategory,
          title: title,
          description: description,
          tokensEarned: 75,
          impactScore: 8.5,
          date: new Date().toISOString(),
          videoUri: videoUri || undefined,
        };
        saveAchievement(newAchievement);
      }
    }, 500);
  });
  };

  const reset = () => {
    setState("idle");
    setVideoUri(null);
    scanProgress.setValue(0);
    setSelectedCategory(null);
    setTitle("");
    setDescription("");
  };

  const categories: Array<{
    type: ContributionType;
    label: string;
    icon: typeof BookOpen;
    color: string;
  }> = [
    { type: "quiz", label: "Quiz", icon: BookOpen, color: "#3B82F6" },
    { type: "club", label: "Club Activity", icon: Users, color: "#8B5CF6" },
{ type: "project", label: "Project", icon: Lightbulb, color: "#F59E0B" },
    { type: "volunteer", label: "Volunteer", icon: Heart, color: "#EF4444" },
    { type: "research", label: "Research", icon: GraduationCap, color: "#10B981" },
    { type: "workshop", label: "Workshop", icon: GraduationCap, color: "#06B6D4" },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.gradient}>
        <View style={[styles.tabBar, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              viewMode === "contribute" && styles.tabButtonActive,
            ]}
            onPress={() => {
              setViewMode("contribute");
              if (state !== "idle") {
                reset();
              }
            }}
            activeOpacity={0.7}
          >
            <Video
              size={18}
              color={viewMode === "contribute" ? "#3B82F6" : "#94A3B8"}
            />
            <Text
              style={[
                styles.tabButtonText,
                viewMode === "contribute" && styles.tabButtonTextActive,
              ]}
            >
              Contribute
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              viewMode === "history" && styles.tabButtonActive,
            ]}
            onPress={() => setViewMode("history")}
            activeOpacity={0.7}
          >
            <Trophy
              size={18}
              color={viewMode === "history" ? "#3B82F6" : "#94A3B8"}
            />
            <Text
              style={[
                styles.tabButtonText,
                viewMode === "history" && styles.tabButtonTextActive,
              ]}
            >
              Achievements
            </Text>
            {achievements.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{achievements.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16 }}
        >
          {viewMode === "history" ? (
            <View style={styles.historySection}>
              <AchievementHistory achievements={achievements} />
            </View>
          ) : (
            <>
              {state === "idle" && (
                <>
                  <View style={styles.header}>
                    <Text style={styles.title}>Contribute</Text>
                    <Text style={styles.subtitle}>
                      Submit proof of your activities and earn LEARN tokens
                    </Text>
                  </View>

              <View style={styles.videoSection}>
                <View style={styles.sectionHeader}>
                  <Video size={20} color="#3B82F6" />
                  <Text style={styles.sectionTitle}>Video Verification</Text>
                </View>

                <View style={styles.videoUploadCard}>
                  <View style={styles.videoIconContainer}>
                    <Video size={48} color="#60A5FA" strokeWidth={1.5} />
                  </View>

                  <Text style={styles.videoTitle}>Upload Activity Video</Text>
                  <Text style={styles.videoDescription}>
                    Record or upload proof of your contribution
                  </Text>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={pickVideo}
                      activeOpacity={0.8}
                    >
                      <Upload size={18} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>
                        Choose from Library
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={recordVideo}
                      activeOpacity={0.8}
                    >
                      <Camera size={18} color="#60A5FA" />
                      <Text style={styles.secondaryButtonText}>
                        Record Video
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.requirementsBox}>
                    <Text style={styles.requirementsTitle}>
                      Video requirements:
                    </Text>
                    <Text style={styles.requirementsText}>
                      • Clear face visibility{"\n"}• 10-60 seconds duration{"\n"}•
                      Shows actual activity
                    </Text>
</View>
                </View>
              </View>
{/* 
              <View style={styles.categoriesSection}>
                <View style={styles.sectionHeader}>
                  <Lightbulb size={20} color="#10B981" />
                  <Text style={styles.sectionTitle}>Activity Categories</Text>
                </View>

                <View style={styles.categoriesGrid}>
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <TouchableOpacity
                        key={category.type}
                        style={styles.categoryCard}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.categoryIconContainer,
                            { backgroundColor: `${category.color}20` },
                          ]}
                        >
                          <Icon size={24} color={category.color} />
                        </View>
                        <Text style={styles.categoryLabel}>
                          {category.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View> */}
            </>
          )}

          {state === "preview" && videoUri && (
            <View style={styles.previewSection}>
              <View style={styles.header}>
                <Text style={styles.title}>Preview Video</Text>
                <Text style={styles.subtitle}>
                  Review your video before submitting
                </Text>
              </View>

              <View style={styles.videoSection}>
                <VideoPreview
                  uri={videoUri}
                  onRemove={handleVideoRemove}
                  onConfirm={handleVideoConfirm}
                />
              </View>
            </View>
          )}

          {state === "form" && videoUri && (
            <View style={styles.formSection}>
              <View style={styles.header}>
                <Text style={styles.title}>Contribution Details</Text>
                <Text style={styles.subtitle}>
                  Provide information about your activity
                </Text>
              </View>

              <View style={styles.videoSection}>
                <ContributionForm
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                  title={title}
                  onTitleChange={setTitle}
                  description={description}
                  onDescriptionChange={setDescription}
                  onSubmit={handleFormSubmit}
                />
              </View>
            </View>
          )}

          {state === "scanning" && (
            <View style={styles.verificationSection}>
              <View style={styles.scanningAnimation}>
                <LinearGradient
                  colors={["#3B82F6", "#60A5FA", "#93C5FD"]}
                  style={styles.scanningGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Video size={48} color="#FFFFFF" strokeWidth={2} />
                </LinearGradient>
              </View>

              <Text style={styles.scanningTitle}>Analyzing Video...</Text>
              <Text style={styles.scanningDescription}>
                AI is verifying your contribution
              </Text>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: scanProgress.interpolate({
                          inputRange: [0, 100],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.checklistContainer}>
                <CheckItem text="Face recognition" />
                <CheckItem text="Activity detection" />
                <CheckItem text="Duplicate check" />
                <CheckItem text="Quality assessment" />
              </View>
            </View>
          )}

          {state === "failed" && (
<View style={styles.verificationSection}>
              <View style={[styles.resultIcon, styles.failedIcon]}>
                <XCircle size={64} color="#EF4444" strokeWidth={2} />
              </View>

              <Text style={styles.resultTitle}>Verification Failed</Text>
              <Text style={styles.resultDescription}>
                Video does not meet quality standards
              </Text>

              <View style={styles.resultDetails}>
                <Text style={styles.detailsTitle}>Issues detected:</Text>
                <Text style={styles.detailsText}>• Face not clearly visible</Text>
                <Text style={styles.detailsText}>• Video quality too low</Text>
                <Text style={styles.detailsText}>
                  • Duration under 10 seconds
                </Text>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={reset}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Try Another Video</Text>
              </TouchableOpacity>
            </View>
          )}

          {state === "duplicate" && (
            <View style={styles.verificationSection}>
              <View style={[styles.resultIcon, styles.duplicateIcon]}>
                <AlertCircle size={64} color="#F59E0B" strokeWidth={2} />
              </View>

              <Text style={styles.resultTitle}>Duplicate Detected</Text>
              <Text style={styles.resultDescription}>
                This activity was already verified
              </Text>

              <View style={styles.resultDetails}>
                <Text style={styles.detailsTitle}>Previous submission:</Text>
                <Text style={styles.detailsText}>• Date: March 15, 2025</Text>
                <Text style={styles.detailsText}>• Tokens earned: 50 LEARN</Text>
                <Text style={styles.detailsText}>• Status: Completed</Text>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={reset}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Try Another Video</Text>
              </TouchableOpacity>
            </View>
          )}

          {state === "success" && (
            <View style={styles.verificationSection}>
              <View style={[styles.resultIcon, styles.successIcon]}>
                <CheckCircle size={64} color="#10B981" strokeWidth={2} />
              </View>

              <Text style={styles.resultTitle}>Verification Successful!</Text>
              <Text style={styles.resultDescription}>
                Your contribution has been verified
              </Text>

              <View style={styles.rewardBox}>
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  style={styles.rewardGradient}
                  start={{ x: 0, y: 0 }}
end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.rewardLabel}>Tokens Earned</Text>
                  <Text style={styles.rewardAmount}>+75 LEARN</Text>
                  <Text style={styles.rewardSubtext}>Impact Score: 8.5/10</Text>
                </LinearGradient>
              </View>

              <View style={styles.resultDetails}>
                <Text style={styles.detailsTitle}>Activity Details:</Text>
                <Text style={styles.detailsText}>
                  • Type: Workshop Participation
                </Text>
                <Text style={styles.detailsText}>• Duration: 45 minutes</Text>
                <Text style={styles.detailsText}>• Verification: On-chain</Text>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={reset}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  Upload Another Video
                </Text>
              </TouchableOpacity>
            </View>
          )}
            </>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <View style={styles.checkItem}>
      <View style={styles.checkDot} />
      <Text style={styles.checkText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#94A3B8",
    lineHeight: 22,
  },
  videoSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  previewSection: {
    paddingHorizontal: 20,
  },
  formSection: {
    paddingHorizontal: 20,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    backgroundColor: "#1E293B",
    position: "relative",
  },
  tabButtonActive: {
    backgroundColor: "#1E40AF20",
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#94A3B8",
  },
  tabButtonTextActive: {
    color: "#3B82F6",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  historySection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  videoUploadCard: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  videoIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1E40AF20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#1E40AF40",
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
paddingHorizontal: 24,
    borderRadius: 14,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E40AF20",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#1E40AF60",
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#60A5FA",
  },
  requirementsBox: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#0F172A",
    padding: 16,
    borderRadius: 12,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  requirementsText: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 20,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "31%",
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    textAlign: "center",
  },
  verificationSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  scanningAnimation: {
    marginBottom: 32,
  },
  scanningGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  scanningTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  scanningDescription: {
    fontSize: 15,
    color: "#94A3B8",
    marginBottom: 32,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 40,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#1E293B",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 4,
  },
  checklistContainer: {
    width: "100%",
    gap: 12,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
  },
  checkText: {
    fontSize: 15,
    color: "#94A3B8",
  },
  resultIcon: {
    marginBottom: 24,
  },
  failedIcon: {
    opacity: 0.9,
  },
  duplicateIcon: {
    opacity: 0.9,
  },
  successIcon: {
    opacity: 1,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 15,
    color: "#94A3B8",
    marginBottom: 32,
textAlign: "center",
  },
  resultDetails: {
    width: "100%",
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 4,
  },
  rewardBox: {
    width: "100%",
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  rewardGradient: {
    padding: 24,
    alignItems: "center",
  },
  rewardLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
    marginBottom: 8,
  },
  rewardAmount: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  rewardSubtext: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.8,
  },
});