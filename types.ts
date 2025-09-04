export type AppState = 'home' | 'pre-test' | 'test' | 'loading' | 'report';

export interface UserData {
  name: string;
  age: string;
  education: string;
  degree?: string;
  department?: string;
  skills: string;
  areaOfInterest: string;
}

export enum QuestionType {
  MultipleChoice = 'multiple-choice',
  Likert = 'likert',
}

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options: {
    text: string;
    value: number;
  }[];
  category: keyof RawScores;
  subCategory?: string; // For personality, eq, aptitude
}

export interface Answer {
  questionId: number;
  value: number;
}

export interface RawScores {
  orientationStyle: {
    informative: number;
    administrative: number;
    creative: number;
    peopleOriented: number;
  };
  interest: {
    tech: number;
    business: number;
    arts: number;
    health: number;
    social: number;
  };
  personality: {
    resilience: number;
    teamwork: number;
    decisionMaking: number;
    openness: number; 
  };
  aptitude: {
    logical: number;
    numerical: number;
    language: number;
    generalKnowledge: number;
    attentionToDetail: number;
  };
  eq: {
    empathy: number;
    selfAwareness: number;
    socialSkills: number;
    motivation: number;
  };
}

export interface Scores {
    orientationStyle: number;
    interest: number;
    personality: number;
    aptitude: number;
    eq: number;
}

export interface ChartData {
  name: string;
  score: number;
}


export interface ReportData {
  profileSummary: string;
  strengths: {
    title: string;
    description: string;
  }[];
  careerMatches: {
    title: string;
    description: string;
    trends: string;
    education: string;
    compatibility: number;
  }[];
  developmentPlan: {
    areasForImprovement: {
      title: string;
      description: string;
    }[];
    recommendations: {
      type: 'Habit' | 'Resource' | 'Exercise';
      description: string;
    }[];
  };
  detailedAnalyses: {
    orientationStyle: string;
    interest: string;
    personality: string;
    aptitude: string;
    eq: string;
  };
  concludingRemarks: string;
}