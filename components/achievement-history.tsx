import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Trophy,
  BookOpen,
  Users,
  Lightbulb,
  Heart,
  GraduationCap,
  ChevronRight,
  Calendar,
  Coins,
  Star,
} from "lucide-react-native";
import type { Achievement, ContributionType } from "../types";

interface AchievementHistoryProps {
  achievements: Achievement[];
  onAchievementPress?: (achievement: Achievement) => void;
}

const categoryIcons: Record<ContributionType, typeof BookOpen> = {
  quiz: BookOpen,
  club: Users,
  project: Lightbulb,
  volunteer: Heart,
  research: GraduationCap,
  workshop: GraduationCap,
};

const categoryColors: Record<ContributionType, string> = {
  quiz: "#3B82F6",
  club: "#8B5CF6",
  project: "#F59E0B",
  volunteer: "#EF4444",
  research: "#10B981",
  workshop: "#06B6D4",
};

const categoryLabels: Record<ContributionType, string> = {
  quiz: "Quiz",
  club: "Club Activity",
  project: "Project",
  volunteer: "Volunteer",
  research: "Research",
  workshop: "Workshop",
};

export default function AchievementHistory({
  achievements,
  onAchievementPress,
}: AchievementHistoryProps) {
  if (achievements.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Trophy size={48} color="#64748B" />
        </View>
        <Text style={styles.emptyTitle}>No Achievements Yet</Text>
        <Text style={styles.emptyDescription}>
          Start contributing to earn your first achievement!
        </Text>
      </View>
    );
  }

  const totalTokens = achievements.reduce(
    (sum, achievement) => sum + achievement.tokensEarned,
    0
  );
  const totalAchievements = achievements.length;

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <LinearGradient
          colors={["#3B82F6", "#60A5FA"]}
          style={styles.summaryGradient}
        >
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Trophy size={24} color="#FFFFFF" />
              <Text style={styles.summaryValue}>{totalAchievements}</Text>
              <Text style={styles.summaryLabel}>Achievements</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Coins size={24} color="#FFFFFF" />
              <Text style={styles.summaryValue}>{totalTokens}</Text>
              <Text style={styles.summaryLabel}>Total Tokens</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Achievement History</Text>
        <Text style={styles.sectionSubtitle}>
          {totalAchievements} contribution{totalAchievements !== 1 ? "s" : ""}{" "}
          verified
        </Text>
      </View>

      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {achievements.map((achievement) => {
          const Icon = categoryIcons[achievement.category];
          const color = categoryColors[achievement.category];
          const label = categoryLabels[achievement.category];

          return (
            <TouchableOpacity
              key={achievement.id}
              style={styles.achievementCard}
              onPress={() => onAchievementPress?.(achievement)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.categoryIconContainer, { backgroundColor: `${color}20` }]}
              >
                <Icon size={24} color={color} />
              </View>

              <View style={styles.achievementContent}>
                <View style={styles.achievementHeader}>
                  <Text style={styles.achievementTitle} numberOfLines={1}>
                    {achievement.title}
                  </Text>
                  <View
                    style={[styles.categoryBadge, { backgroundColor: `${color}20` }]}
                  >
                    <Text style={[styles.categoryBadgeText, { color }]}>
                      {label}
                    </Text>
                  </View>
                </View>

                {achievement.description ? (
                  <Text style={styles.achievementDescription} numberOfLines={2}>
                    {achievement.description}
                  </Text>
                ) : null}

                <View style={styles.achievementFooter}>
                  <View style={styles.achievementMeta}>
                    <Calendar size={14} color="#94A3B8" />
                    <Text style={styles.achievementMetaText}>
                      {new Date(achievement.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>
                  </View>

                  <View style={styles.achievementStats}>
                    <View style={styles.statItem}>
                      <Coins size={14} color="#10B981" />
                      <Text style={styles.statValue}>
                        +{achievement.tokensEarned}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Star size={14} color="#F59E0B" />
                      <Text style={styles.statValue}>
                        {achievement.impactScore}/10
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <ChevronRight size={20} color="#64748B" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  summaryCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  summaryGradient: {
    padding: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
  },
  listContainer: {
    maxHeight: 400,
  },
  achievementCard: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  achievementDescription: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 10,
    lineHeight: 18,
  },
  achievementFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  achievementMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  achievementMetaText: {
    fontSize: 12,
    color: "#94A3B8",
  },
  achievementStats: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
});

