import type { User, ActivityItem } from "@/types";

export const mockUser: User = {
  id: "u_001",
  name: "Ava Patel",
  email: "ava.patel@nova.ai",
  title: "Product Designer · Aspiring AI PM",
  location: "Berlin, Germany",
  bio: "Designer with 4 years of SaaS experience, transitioning into AI product management. Curious, systems-thinker, builder.",
  yearsExperience: 4,
};

export const mockActivity: ActivityItem[] = [
  { id: "a1", label: "Completed: Intro to LLMs", date: "2 days ago", type: "course" },
  { id: "a2", label: "Skill assessment: Product Strategy", date: "5 days ago", type: "assessment" },
  { id: "a3", label: "Reached 70% match for AI PM", date: "1 week ago", type: "milestone" },
  { id: "a4", label: "Completed: SQL for Analysts", date: "2 weeks ago", type: "course" },
];
