export interface AtsAnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  formattingIssues: string[];
  improvementPlan: string[];
}

export interface FileData {
  base64: string;
  mimeType: string;
  name: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro';
  creditsUsed: number;
  maxCredits: number; // 5 for free, Infinity for pro
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
