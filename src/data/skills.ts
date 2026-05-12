import type { Skill } from "@/types";

export const mockSkills: Skill[] = [
  { id: "s1", name: "Product Strategy", category: "Domain", level: 78, required: 85 },
  { id: "s2", name: "User Research", category: "Soft", level: 82, required: 80 },
  { id: "s3", name: "Machine Learning Basics", category: "Technical", level: 35, required: 75, trending: true },
  { id: "s4", name: "Python", category: "Technical", level: 48, required: 70 },
  { id: "s5", name: "SQL & Analytics", category: "Technical", level: 65, required: 80 },
  { id: "s6", name: "LLM Prompting", category: "Tool", level: 70, required: 85, trending: true },
  { id: "s7", name: "Stakeholder Communication", category: "Soft", level: 88, required: 85 },
  { id: "s8", name: "A/B Testing", category: "Domain", level: 60, required: 75 },
  { id: "s9", name: "Figma", category: "Tool", level: 95, required: 60 },
  { id: "s10", name: "Data Storytelling", category: "Soft", level: 72, required: 80 },
];
