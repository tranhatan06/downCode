import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  BookOpen,
  Users,
  Lightbulb,
  Heart,
  GraduationCap,
  Check,
} from "lucide-react-native";
import type { ContributionType } from "../types";

interface ContributionFormProps {
  selectedCategory: ContributionType | null;
  onCategorySelect: (category: ContributionType) => void;
  title: string;
  onTitleChange: (title: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => void;
}

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

export default function ContributionForm({
  selectedCategory,
  onCategorySelect,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  onSubmit,
}: ContributionFormProps) {
  const isFormValid = selectedCategory && title.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Category</Text>
        <Text style={styles.sectionSubtitle}>
          Select the type of contribution
        </Text>

        <View style={styles.categoriesGrid}>
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.type;

            return (
              <TouchableOpacity
                key={category.type}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardSelected,
                  isSelected && { borderColor: category.color },
                ]}
                onPress={() => onCategorySelect(category.type)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.categoryIconContainer,
                    { backgroundColor: `${category.color}20` },
                    isSelected && { backgroundColor: `${category.color}30` },
                  ]}
                >
                  <Icon size={24} color={category.color} />
                </View>
                <Text
                  style={[
                    styles.categoryLabel,
                    isSelected && { color: category.color },
                  ]}
                >
                  {category.label}
                </Text>
                {isSelected && (
                  <View
                    style={[
                      styles.checkBadge,
                      { backgroundColor: category.color },
                    ]}
                  >
                    <Check size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Title</Text>
        <Text style={styles.sectionSubtitle}>
          Give your contribution a clear title
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g., Workshop on React Native"
          placeholderTextColor="#64748B"
          value={title}
          onChangeText={onTitleChange}
          maxLength={100}
        />
        <Text style={styles.characterCount}>{title.length}/100</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionSubtitle}>
          Describe what you did in this activity
        </Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your contribution in detail..."
          placeholderTextColor="#64748B"
          value={description}
          onChangeText={onDescriptionChange}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
        />
        <Text style={styles.characterCount}>{description.length}/500</Text>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
        onPress={onSubmit}
        disabled={!isFormValid}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            isFormValid
              ? ["#3B82F6", "#60A5FA"]
              : ["#334155", "#475569"]
          }
          style={styles.submitButtonGradient}
        >
          <Text style={styles.submitButtonText}>Submit for Verification</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 16,
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
    borderWidth: 1.5,
    borderColor: "#334155",
    alignItems: "center",
    position: "relative",
  },
  categoryCardSelected: {
    borderWidth: 2,
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
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#1E293B",
    borderWidth: 1.5,
    borderColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  characterCount: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "right",
  },
  submitButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

