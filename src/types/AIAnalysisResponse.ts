
export interface AIAnalysisRequest {
  skills: string[]; 
  interests: string[];
  education: string; 
}

export interface AIAnalysisMeta {
  generatedAt: string;
  profileSnapshot: AIAnalysisRequest;
  modelVersion: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  date: string;
  type: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  required?: number;
  trending: boolean;
}

export interface Career {
  id: string;
  title: string;
  description: string;
  confidence: number;
  salaryRange: string;
  growth: string;
  demand: number;
  skills: Skill[];
  tags: string[];
}
export interface AIAnalysisResponse {
  id: string;
  userId: string;
  careers: Career[];
  skills: Skill[];
  activity: ActivityItem[];
  meta: AIAnalysisMeta;
}