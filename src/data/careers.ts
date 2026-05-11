import type { Career } from "@/types";

export const mockCareers: Career[] = [
  {
    id: "c1",
    title: "AI Product Manager",
    description:
      "Lead the discovery, strategy, and delivery of AI-powered products. Bridge research, engineering, and design.",
    confidence: 92,
    salaryRange: "$130k – $190k",
    growth: "High",
    demand: 94,
    skills: ["s1", "s3", "s6", "s7", "s10"],
    tags: ["AI", "Strategy", "Leadership"],
  },
  {
    id: "c2",
    title: "UX Researcher (AI)",
    description:
      "Investigate how humans interact with intelligent systems. Translate behavior into product insight.",
    confidence: 84,
    salaryRange: "$95k – $145k",
    growth: "High",
    demand: 81,
    skills: ["s2", "s7", "s10", "s6"],
    tags: ["Research", "AI", "Behavior"],
  },
  {
    id: "c3",
    title: "Prompt Engineer",
    description:
      "Design, evaluate, and optimize prompts and LLM workflows for production-grade applications.",
    confidence: 76,
    salaryRange: "$110k – $170k",
    growth: "High",
    demand: 88,
    skills: ["s6", "s3", "s4"],
    tags: ["LLM", "Engineering"],
  },
  {
    id: "c4",
    title: "Data Product Analyst",
    description:
      "Turn product telemetry into decisions. Build dashboards, run experiments, ship insights.",
    confidence: 68,
    salaryRange: "$90k – $135k",
    growth: "Medium",
    demand: 72,
    skills: ["s5", "s8", "s10", "s4"],
    tags: ["Analytics", "Experimentation"],
  },
  {
    id: "c5",
    title: "Design Engineer",
    description:
      "Sit between design and code. Prototype with real components, ship polished interfaces fast.",
    confidence: 71,
    salaryRange: "$120k – $180k",
    growth: "High",
    demand: 79,
    skills: ["s9", "s6", "s7"],
    tags: ["Design", "Frontend"],
  },
  {
    id: "c6",
    title: "ML Solutions Consultant",
    description:
      "Advise enterprises on how to apply ML and generative AI to real business problems.",
    confidence: 62,
    salaryRange: "$140k – $210k",
    growth: "High",
    demand: 75,
    skills: ["s3", "s6", "s7", "s1"],
    tags: ["Consulting", "AI"],
  },
];
