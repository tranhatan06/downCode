export type ContributionType =
  | "quiz"
  | "club"
  | "project"
  | "volunteer"
  | "research"
  | "workshop";

export interface Achievement {
  id: string;
  category: ContributionType;
  title: string;
  description: string;
  tokensEarned: number;
  impactScore: number;
  date: string;
  videoUri?: string;
}
