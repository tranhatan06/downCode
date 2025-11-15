import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  Trophy,
  TrendingUp,
  Award,
  Target,
  Crown,
  Zap,
  ChevronRight,
  Copy,
  Share2,
} from "lucide-react-native";
import type { Achievement } from "../../../types";
import DIDModal from "../../../components/did-modal";

const ACHIEVEMENTS_STORAGE_KEY = "@achievements";

interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface UserStats {
  totalTokens: number;
  contributionScore: number;
  governanceScore: number;
  learnScore: number;
  projectIndex: number;
  leadershipIndex: number;
  rank: number;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [showDIDModal, setShowDIDModal] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const stored = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("parsed", parsed);
        setAchievements(parsed);
      }
    } catch (error) {
      console.error("Error loading achievements:", error);
    }
  };

  const [userStats] = useState<UserStats>({
    totalTokens: 1250,
    contributionScore: 87,
    governanceScore: 72,
    learnScore: 91,
    projectIndex: 15,
    leadershipIndex: 68,
    rank: 42,
  });

  const [badges] = useState<Badge[]>([
    {
      id: "1",
      name: "Early Adopter",
      description: "One of the first 100 members",
      image: "🌟",
      rarity: "legendary",
    },
    {
      id: "2",
      name: "Workshop Master",
      description: "Attended 10+ workshops",
      image: "🎓",
      rarity: "epic",
    },
    {
      id: "3",
      name: "Active Voter",
      description: "Voted on 25+ proposals",
      image: "🗳️",
      rarity: "rare",
    },
    {
      id: "4",
      name: "Project Lead",
      description: "Led 5 successful projects",
      image: "🚀",
      rarity: "epic",
    },
    {
      id: "5",
      name: "Top Contributor",
      description: "Top 10% contributor this month",
      image: "⚡",
      rarity: "epic",
    },
    {
      id: "6",
      name: "Learning Streak",
      description: "30-day learning streak",
      image: "🔥",
      rarity: "rare",
    },
  ]);

  const walletAddress = "0x9fc12ac3132ea8"; // Full address for DID
  const userName = "Guest User";
  
  // Tạo DID code dựa trên wallet address (trong thực tế sẽ lấy từ blockchain)
  const didCode = `did:byteedu:${walletAddress}`;
  console.log("didCode", didCode);
  const contributionsCount = achievements.length;

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.gradient}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: insets.top }}
        >
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={["#3B82F6", "#8B5CF6"]}
                style={styles.avatarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <User size={40} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.rankBadge}>
                <Crown size={12} color="#F59E0B" />
                <Text style={styles.rankBadgeText}>#{userStats.rank}</Text>
              </View>
            </View>

            <Text style={styles.userName}>Student Name</Text>
            <Text style={styles.userTitle}>Computer Science Major</Text>

            <TouchableOpacity style={styles.walletButton} activeOpacity={0.8}>
              <Text style={styles.walletAddress}>{walletAddress}</Text>
              <Copy size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsCard}>
            <LinearGradient
              colors={["#1E293B", "#1E293B"]}
              style={styles.statsGradient}
            >
              <View style={styles.statsHeader}>
                <Trophy size={20} color="#F59E0B" />
                <Text style={styles.statsTitle}>Reputation Scores</Text>
              </View>

              <View style={styles.statsGrid}>
                <ScoreBar
                  label="Contribution"
                  score={userStats.contributionScore}
                  color="#3B82F6"
                  icon={Target}
                />
                <ScoreBar
                  label="Governance"
                  score={userStats.governanceScore}
                  color="#8B5CF6"
                  icon={Trophy}
                />
                <ScoreBar
                  label="Learning"
                  score={userStats.learnScore}
                  color="#10B981"
                  icon={TrendingUp}
                />
                <ScoreBar
                  label="Leadership"
                  score={userStats.leadershipIndex}
                  color="#F59E0B"
                  icon={Crown}
                />
              </View>

              <View style={styles.projectIndex}>
                <View style={styles.projectIndexContent}>
                  <Zap size={20} color="#FFFFFF" />
                  <View>
                    <Text style={styles.projectIndexLabel}>
                      Project Index
                    </Text>
                    <Text style={styles.projectIndexValue}>
                      {userStats.projectIndex} projects completed
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Achievements</Text>
            </View>

            <View style={styles.badgesGrid}>
              {badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.actionsList}>
              <TouchableOpacity
                style={styles.actionCard}
                activeOpacity={0.7}
                onPress={() => {
                  console.log("Share Profile pressed, setting showDIDModal to true");
                  setShowDIDModal(true);
                  console.log("showDIDModal state should be true now");
                }}
              >
                <View style={styles.actionIconContainer}>
                  <Share2 size={20} color="#3B82F6" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Share Profile</Text>
                  <Text style={styles.actionDescription}>
                    Share your on-chain reputation
                  </Text>
                </View>
                <ChevronRight size={20} color="#64748B" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
                <View style={styles.actionIconContainer}>
                  <Trophy size={20} color="#F59E0B" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>View Leaderboard</Text>
                  <Text style={styles.actionDescription}>
                    See where you rank
                  </Text>
                </View>
                <ChevronRight size={20} color="#64748B" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
                <View style={styles.actionIconContainer}>
                  <Award size={20} color="#8B5CF6" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>All Achievements</Text>
                  <Text style={styles.actionDescription}>
                    Browse all badges
                  </Text>
                </View>
                <ChevronRight size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </LinearGradient>

      <DIDModal
        visible={showDIDModal}
        onClose={() => {
          console.log("Closing DID modal");
          setShowDIDModal(false);
        }}
        userName={userName}
        didCode={didCode}
        achievements={achievements}
        contributionsCount={contributionsCount}
      />
    </View>
  );
}

function ScoreBar({
  label,
  score,
  color,
  icon: Icon,
}: {
  label: string;
  score: number;
  color: string;
  icon: typeof Trophy;
}) {
  return (
    <View style={styles.scoreBar}>
      <View style={styles.scoreBarHeader}>
        <View style={styles.scoreBarLabelContainer}>
          <Icon size={14} color={color} />
          <Text style={styles.scoreBarLabel}>{label}</Text>
        </View>
        <Text style={styles.scoreBarValue}>{score}/100</Text>
      </View>
      <View style={styles.scoreBarTrack}>
        <View
          style={[
            styles.scoreBarFill,
            { width: `${score}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const rarityColors = {
    common: "#64748B",
    rare: "#3B82F6",
    epic: "#8B5CF6",
    legendary: "#F59E0B",
  };

  const rarityColor = rarityColors[badge.rarity];

  return (
    <View
      style={[
        styles.badgeCard,
        { borderColor: `${rarityColor}40` as string },
      ]}
    >
      <Text style={styles.badgeEmoji}>{badge.image}</Text>
      <Text style={styles.badgeName}>{badge.name}</Text>
      <View
        style={[styles.rarityBadge, { backgroundColor: `${rarityColor}20` }]}
      >
        <Text style={[styles.rarityText, { color: rarityColor }]}>
          {badge.rarity}
        </Text>
      </View>
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
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
    position: "relative",
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  rankBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 2,
    borderColor: "#1E293B",
  },
  rankBadgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#F59E0B",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 16,
  },
  walletButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  walletAddress: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
  },
  statsGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 20,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  statsGrid: {
    gap: 16,
    marginBottom: 20,
  },
  scoreBar: {
    gap: 8,
  },
  scoreBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreBarLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  scoreBarLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  scoreBarValue: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  scoreBarTrack: {
    height: 8,
    backgroundColor: "#0F172A",
    borderRadius: 4,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  projectIndex: {
    backgroundColor: "#0F172A",
    padding: 16,
    borderRadius: 12,
  },
  projectIndexContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  projectIndexLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 2,
  },
  projectIndexValue: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  badgeCard: {
    width: "31%",
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
  },
  badgeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 12,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    color: "#94A3B8",
  },
});
