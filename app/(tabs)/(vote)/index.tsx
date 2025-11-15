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
  Vote,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Building2,
  BookOpen,
  Award,
} from "lucide-react-native";
import type { Proposal } from "../../../types";

export default function VoteScreen() {
  const insets = useSafeAreaInsets();

  const [userTokens] = useState(1250);
  const [proposals] = useState<Proposal[]>([
    {
      id: "1",
      title: "Increase AI Lab GPU Access",
      description:
        "Proposal to extend GPU hours for students working on deep learning projects from 10h/week to 20h/week",
      category: "infrastructure",
      votesFor: 3420,
      votesAgainst: 890,
      totalVotes: 4310,
      endDate: new Date("2025-11-20"),
      status: "active",
      author: "CS Department",
    },
    {
      id: "2",
      title: "Blockchain Club Funding",
      description:
        "Allocate 5,000 LEARN tokens to support blockchain workshop series and hackathon participation fees",
      category: "club_fund",
      votesFor: 2150,
      votesAgainst: 1320,
      totalVotes: 3470,
      endDate: new Date("2025-11-18"),
      status: "active",
      author: "Blockchain Club",
    },
    {
      id: "3",
      title: "Merit Scholarship Criteria Update",
      description:
        "Revise merit scholarship to include contribution scores alongside GPA. Minimum 75 contribution score required.",
      category: "scholarship",
      votesFor: 4890,
      votesAgainst: 2100,
      totalVotes: 6990,
      endDate: new Date("2025-11-25"),
      status: "active",
      author: "Student Council",
    },
    {
      id: "4",
      title: "Add AI Ethics Course",
      description:
        "Introduce mandatory AI ethics and responsible AI course for all CS majors starting next semester",
      category: "curriculum",
      votesFor: 5200,
      votesAgainst: 800,
      totalVotes: 6000,
      endDate: new Date("2025-11-12"),
      status: "passed",
      author: "Faculty Board",
    },
  ]);

  const activeProposals = proposals.filter((p) => p.status === "active");
  const completedProposals = proposals.filter((p) => p.status !== "active");

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.gradient}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: insets.top }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Governance</Text>
            <Text style={styles.subtitle}>
              Vote on proposals and shape the future of your institution
            </Text>
          </View>

          <View style={styles.votingPowerCard}>
            <LinearGradient
              colors={["#8B5CF6", "#7C3AED"]}
              style={styles.votingPowerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.votingPowerContent}>
                <View style={styles.votingPowerIcon}>
                  <Vote size={24} color="#FFFFFF" />
                </View>
                <View style={styles.votingPowerText}>
                  <Text style={styles.votingPowerLabel}>Your Voting Power</Text>
                  <Text style={styles.votingPowerAmount}>
                    {userTokens} LEARN
                  </Text>
                </View>
              </View>
              <Text style={styles.votingPowerDescription}>
                1 token = 1 vote power
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Proposals</Text>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>
                  {activeProposals.length}
                </Text>
              </View>
            </View>

            <View style={styles.proposalList}>
              {activeProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Completed</Text>
            </View>

            <View style={styles.proposalList}>
              {completedProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const isActive = proposal.status === "active";
  const isPassed = proposal.status === "passed";
  const percentFor = (proposal.votesFor / proposal.totalVotes) * 100;

  const categoryIcons = {
    scholarship: Award,
    club_fund: Building2,
    infrastructure: TrendingUp,
    curriculum: BookOpen,
    other: Vote,
  };

  const categoryColors = {
    scholarship: "#F59E0B",
    club_fund: "#8B5CF6",
    infrastructure: "#3B82F6",
    curriculum: "#10B981",
    other: "#64748B",
  };

  const Icon = categoryIcons[proposal.category];
  const color = categoryColors[proposal.category];

  return (
    <TouchableOpacity
      style={[styles.proposalCard, !isActive && styles.proposalCardInactive]}
      activeOpacity={0.7}
    >
      <View style={styles.proposalHeader}>
        <View
          style={[
            styles.proposalIconContainer,
            { backgroundColor: `${color}20` },
          ]}
        >
          <Icon size={20} color={color} />
        </View>
        <View style={styles.proposalHeaderText}>
          <Text style={styles.proposalTitle}>{proposal.title}</Text>
          <Text style={styles.proposalAuthor}>by {proposal.author}</Text>
        </View>
        {!isActive && (
          <View style={styles.statusBadge}>
            {isPassed ? (
              <CheckCircle2 size={16} color="#10B981" />
            ) : (
              <XCircle size={16} color="#EF4444" />
            )}
          </View>
        )}
      </View>

      <Text style={styles.proposalDescription}>{proposal.description}</Text>

      <View style={styles.voteProgress}>
        <View style={styles.voteProgressBar}>
          <View
            style={[styles.voteProgressFill, { width: `${percentFor}%` }]}
          />
        </View>
        <View style={styles.voteStats}>
          <View style={styles.voteStat}>
            <ThumbsUp size={14} color="#10B981" />
            <Text style={styles.voteStatText}>
              {formatNumber(proposal.votesFor)}
            </Text>
          </View>
          <View style={styles.voteStat}>
            <ThumbsDown size={14} color="#EF4444" />
            <Text style={styles.voteStatText}>
              {formatNumber(proposal.votesAgainst)}
            </Text>
          </View>
        </View>
      </View>

      {isActive && (
        <>
          <View style={styles.timeRemaining}>
            <Clock size={14} color="#94A3B8" />
            <Text style={styles.timeRemainingText}>
              Ends {formatDate(proposal.endDate)}
            </Text>
          </View>

          <View style={styles.voteButtons}>
            <TouchableOpacity
              style={[styles.voteButton, styles.voteButtonFor]}
              activeOpacity={0.8}
            >
              <ThumbsUp size={18} color="#10B981" />
              <Text style={[styles.voteButtonText, { color: "#10B981" }]}>
                Vote For
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.voteButton, styles.voteButtonAgainst]}
              activeOpacity={0.8}
            >
              <ThumbsDown size={18} color="#EF4444" />
              <Text style={[styles.voteButtonText, { color: "#EF4444" }]}>
                Vote Against
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays < 7) return `in ${diffDays} days`;
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
  votingPowerCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
  },
  votingPowerGradient: {
    padding: 20,
  },
  votingPowerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  votingPowerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF20",
    justifyContent: "center",
    alignItems: "center",
  },
  votingPowerText: {
    flex: 1,
  },
  votingPowerLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 4,
  },
  votingPowerAmount: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  votingPowerDescription: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.8,
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
  activeBadge: {
    backgroundColor: "#10B98120",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#10B981",
  },
  proposalList: {
    gap: 12,
  },
  proposalCard: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  proposalCardInactive: {
    opacity: 0.7,
  },
  proposalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  proposalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  proposalHeaderText: {
    flex: 1,
  },
  proposalTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 4,
    lineHeight: 22,
  },
  proposalAuthor: {
    fontSize: 12,
    color: "#94A3B8",
  },
  statusBadge: {
    marginLeft: 8,
  },
  proposalDescription: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 16,
  },
  voteProgress: {
    marginBottom: 12,
  },
  voteProgressBar: {
    height: 6,
    backgroundColor: "#0F172A",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  voteProgressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 3,
  },
  voteStats: {
    flexDirection: "row",
    gap: 16,
  },
  voteStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  voteStatText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  timeRemaining: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  timeRemainingText: {
    fontSize: 13,
    color: "#94A3B8",
  },
  voteButtons: {
    flexDirection: "row",
    gap: 12,
  },
  voteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  voteButtonFor: {
    backgroundColor: "#10B98120",
    borderWidth: 1,
    borderColor: "#10B98140",
  },
  voteButtonAgainst: {
    backgroundColor: "#EF444420",
    borderWidth: 1,
    borderColor: "#EF444440",
  },
  voteButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
});
