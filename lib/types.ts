
export interface User {
  id: string;
  email: string;
  name?: string | null;
  firstName?: string | null;  
  lastName?: string | null;
  role?: string;
}

export interface DiscQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  questionType: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  context?: string | null;
}

export interface DiscResponse {
  questionId: string;
  questionNumber: number;
  selectedOption: 'D' | 'I' | 'S' | 'C';
  responseTime?: number;
}

export interface DiscResult {
  id: string;
  scoreD: number;
  scoreI: number;
  scoreS: number;
  scoreC: number;
  percentileD: number;
  percentileI: number;
  percentileS: number;
  percentileC: number;
  primaryStyle: 'D' | 'I' | 'S' | 'C';
  secondaryStyle?: 'D' | 'I' | 'S' | 'C' | null;
  personalityType: string;
  styleIntensity: number;
  isOvershift: boolean;
  isUndershift: boolean;
  isTightPattern: boolean;
}

export interface DiscInterpretation {
  personalityType: string;
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  motivators: string[];
  stressors: string[];
  workStyle: string;
  communicationStyle: string;
  leadershipStyle?: string;
  teamRole?: string;
  developmentTips: string[];
  careerSuggestions: string[];
}

export interface DiscEvaluation {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  startedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  result?: DiscResult;
}
