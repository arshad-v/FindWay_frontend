export type AppState = 'welcome' | 'pre-test' | 'generating-questions' | 'test' | 'loading' | 'report';

export interface UserData {
  education: string;
  interests: string;
  skills: string;
  majorSubjects?: string;
  favoriteSubject?: string;
  extracurriculars?: string;
}

export interface Question {
  id: number;
  text: string;
  category: keyof RawScores;
  subCategory: string; // e.g., 'informative', 'resilience', 'logical'
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
  };
  personality: {
    resilience: number;
    teamwork: number;
    decisionMaking: number;
  };
  aptitude: {
    logical: number;
    numerical: number;
    language: number;
  };
  eq: {
    empathy: number;
    selfAwareness: number;
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
  strengths: {
    title: string;
    description: string;
  }[];
  careerMatches: {
    title: string;
    description: string;
    trends: string;
    education: string;
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
}