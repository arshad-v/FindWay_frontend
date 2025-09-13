export type AppState = 'home' | 'pre-test' | 'test' | 'loading' | 'report' | 'chat-coach';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

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
    keyResponsibilities?: string;
    requiredSkills?: string;
    growthPath?: string;
    salaryIndia?: {
      entry: string;
      mid: string;
      senior: string;
    };
    salaryAbroad?: {
      entry: string;
      mid: string;
      senior: string;
    };
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
  interviewPrep: {
    generalTips: string[];
    careerSpecificTips: {
      careerTitle: string;
      sampleQuestions: {
        question: string;
        answerGuidance: string;
      }[];
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
