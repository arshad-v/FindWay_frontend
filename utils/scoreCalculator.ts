import { type Answer, type RawScores, type Question, type Scores } from '../types';

export const calculateScores = (answers: Answer[], questions: Question[]): RawScores => {
  const rawScores: RawScores = {
    orientationStyle: { informative: 0, administrative: 0, creative: 0, peopleOriented: 0 },
    interest: { tech: 0, business: 0, arts: 0, health: 0 },
    personality: { resilience: 0, teamwork: 0, decisionMaking: 0 },
    aptitude: { logical: 0, numerical: 0, language: 0 },
    eq: { empathy: 0, selfAwareness: 0 },
  };

  const questionMap = new Map<number, Question>(questions.map(q => [q.id, q]));

  answers.forEach(answer => {
    const question = questionMap.get(answer.questionId);
    if (!question) return;

    const { category, subCategory } = question;

    // Ensure the subCategory exists on the category object before attempting to assign a score
    if (category in rawScores && subCategory in rawScores[category]) {
      // The value from the Likert scale (1-5) is the score.
      // We cast to any here to dynamically access the property.
      (rawScores[category] as any)[subCategory] += answer.value;
    }
  });

  return rawScores;
};

export const getNormalizedScoresForChart = (scores: RawScores): Scores => {
    const normalize = (value: number, max: number) => (max > 0 ? Math.round((value / max) * 100) : 0);
    
    // Assuming 2 questions per category, with a max score of 5 each (total max = 10)
    const maxScorePerCategory = 10;

    return {
        orientationStyle: normalize(
            Object.values(scores.orientationStyle).reduce((a, b) => a + b, 0), maxScorePerCategory
        ),
        interest: normalize(
            Object.values(scores.interest).reduce((a, b) => a + b, 0), maxScorePerCategory
        ),
        personality: normalize(
            Object.values(scores.personality).reduce((a, b) => a + b, 0), maxScorePerCategory
        ),
        aptitude: normalize(
            Object.values(scores.aptitude).reduce((a, b) => a + b, 0), maxScorePerCategory
        ),
        eq: normalize(
            Object.values(scores.eq).reduce((a, b) => a + b, 0), maxScorePerCategory
        ),
    };
};