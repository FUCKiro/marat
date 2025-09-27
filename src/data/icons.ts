import { Heart, Brain, Users, Sparkles, Activity, MessageSquare, GraduationCap, BookOpen } from 'lucide-react';

export const icons = {
  Heart,
  Brain,
  Users,
  Sparkles,
  Activity,
  MessageSquare,
  GraduationCap,
  BookOpen
} as const;

export type IconName = keyof typeof icons;