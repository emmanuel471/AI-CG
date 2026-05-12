export interface Skill {
  id: string;
  name: string;
  category: "Technical" | "Soft" | "Domain" | "Tool";
  level: number;
  required?: number;
  trending?: boolean;
}

export interface Career {
  id: string;
  title: string;
  description: string;
  confidence: number;
  salaryRange: string;
  growth: "High" | "Medium" | "Low";
  demand: number;
  skills: string[];
  tags: string[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  active: boolean;
  createdAt: string;
}

export interface ProfileResponse {
  skills: string[];
  interests: string[];
  education: string;
  profilePicture?: string;
}
export interface ProfileRequest {
  skills: string[];
  interests: string[];
  education: string;
}
export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  verifiedAt: string | null;
}

export interface UserProfileResponse {
  user: UserResponse;
  profile: ProfileResponse;
}

export interface DecodedUser {
  firstName: string;
  lastName: string;
  userId: string;
  email: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  date: string;
  type: "course" | "assessment" | "milestone";
}