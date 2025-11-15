import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  TrendingUp,
  Award,
  Activity as ActivityIcon,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react-native";
import type { Activity } from "../../../types";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  
  const [stats] = useState({
    tokens: 1250,
    rank: 42,
    contributionScore: 87,
    totalActivities: 23,
  });

  const [recentActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "workshop",
      title: "AI Workshop Participation",
      description: "Attended 2-hour blockchain fundamentals workshop",
      tokens: 75,
      impactScore: 8.5,
      timestamp: new Date("2025-03-15"),
      verified: true,
    },
    {
      id: "2",
      type: "quiz",
      title: "Data Structures Quiz",
      description: "Completed advanced algorithms assessment",
      tokens: 50,
      impactScore: 7.2,
      timestamp: new Date("2025-03-14"),
      verified: true,
    },
    {
      id: "3",
      type: "club",
      title: "Tech Club Meeting",
      description: "Led discussion on Web3 technologies",
      tokens: 100,
      impactScore: 9.0,
      timestamp: new Date("2025-03-13"),
      verified: true,
    },
  ]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0F172A", "#1E293B"]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: insets.top }}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back!</Text>
              <Text style={styles.title}>ByteEdu</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <View style={styles.notificationBadge} />
              <Sparkles size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            style={styles.tokenCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.tokenCardHeader}>
              <Text style={styles.tokenLabel}>Total Balance</Text>
              <Zap size={20} color="#FFF" />
            </View>
            <Text style={styles.tokenAmount}>{stats.tokens} LEARN</Text>
            <View style={styles.tokenStats}>
              <View style={styles.tokenStat}>
                <Text style={styles.tokenStatLabel}>Rank</Text>
                <Text style={styles.tokenStatValue}>#{stats.rank}</Text>
              </View>
              <View style={styles.tokenStatDivider} />
              <View style={styles.tokenStat}>
                <Text style={styles.tokenStatLabel}>Score</Text>
                <Text style={styles.tokenStatValue}>{stats.contributionScore}/100</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <TrendingUp size={20} color="#10B981" />
              </View>
              <Text style={styles.statValue}>+125</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: "#F59E0B20" }]}>
                <Award size={20} color="#F59E0B" />
              </View>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: "#8B5CF620" }]}>
                <ActivityIcon size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.statValue}>{stats.totalActivities}</Text>
              <Text style={styles.statLabel}>Activities</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activities</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityList}>
              {recentActivities.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  style={styles.activityCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.activityIconContainer}>
                    {getActivityIcon(activity.type)}
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDescription}>
                      {activity.description}
                    </Text>
                    <View style={styles.activityFooter}>
                      <Text style={styles.activityScore}>
                        Impact: {activity.impactScore}/10
                      </Text>
                      <Text style={styles.activityDate}>
                        {formatDate(activity.timestamp)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.activityReward}>
                    <Text style={styles.activityTokens}>+{activity.tokens}</Text>
                    <Text style={styles.activityTokenLabel}>LEARN</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.contributePrompt} activeOpacity={0.8}>
            <LinearGradient
              colors={["#10B98120", "#10B98110"]}
              style={styles.contributePromptGradient}
            >
              <View style={styles.contributePromptContent}>
                <View style={styles.contributePromptIcon}>
                  <Sparkles size={24} color="#10B981" />
                </View>
                <View style={styles.contributePromptText}>
                  <Text style={styles.contributePromptTitle}>
                    Submit Your Contribution
                  </Text>
                  <Text style={styles.contributePromptDescription}>
                    Earn tokens by verifying your activities
                  </Text>
                </View>
                <ChevronRight size={20} color="#10B981" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

function getActivityIcon(type: string) {
  const iconProps = { size: 20, color: "#3B82F6" };
  switch (type) {
    case "workshop":
      return <Sparkles {...iconProps} />;
    case "quiz":
      return <TrendingUp {...iconProps} />;
    case "club":
      return <Award {...iconProps} />;
    default:
      return <ActivityIcon {...iconProps} />;
  }
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E40AF20",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  tokenCard: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
  },
  tokenCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tokenLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  tokenAmount: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  tokenStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenStat: {
    flex: 1,
  },
  tokenStatLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.7,
    marginBottom: 4,
  },
  tokenStatValue: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  tokenStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#FFFFFF",
    opacity: 0.3,
    marginHorizontal: 16,
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#10B98120",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  seeAllText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600" as const,
  },
  activityList: {
    gap: 12,
  },
  activityCard: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 12,
  },
  activityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E40AF20",
    justifyContent: "center",
    alignItems: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 18,
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityScore: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "600" as const,
  },
  activityDate: {
    fontSize: 12,
    color: "#64748B",
  },
  activityReward: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  activityTokens: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#10B981",
  },
  activityTokenLabel: {
    fontSize: 11,
    color: "#94A3B8",
  },
  contributePrompt: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  contributePromptGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#10B98140",
  },
  contributePromptContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contributePromptIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#10B98120",
    justifyContent: "center",
    alignItems: "center",
  },
  contributePromptText: {
    flex: 1,
  },
  contributePromptTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  contributePromptDescription: {
    fontSize: 13,
    color: "#94A3B8",
  },
});
