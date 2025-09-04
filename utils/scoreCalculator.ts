
import { type Answer, type RawScores, type Question, type Scores } from '../types';

// This function processes answers and returns raw scores for the AI prompt.
export const calculateScores = (answers: Answer[], questions: Question[]): RawScores => {
  const rawScores: RawScores = {
    orientationStyle: { informative: 0, administrative: 0, creative: 0, peopleOriented: 0 },
    interest: { tech: 0, business: 0, arts: 0, health: 0, social: 0 },
    personality: { resilience: 0, teamwork: 0, decisionMaking: 0, openness: 0 },
    aptitude: { logical: 0, numerical: 0, language: 0, generalKnowledge: 0, attentionToDetail: 0 },
    eq: { empathy: 0, selfAwareness: 0, socialSkills: 0, motivation: 0 },
  };

  const questionMap = new Map<number, Question>(questions.map(q => [q.id, q]));

  answers.forEach(answer => {
    const question = questionMap.get(answer.questionId);
    if (!question) return;

    switch (question.category) {
      case 'orientationStyle':
        if (answer.value === 1) rawScores.orientationStyle.informative += 5;
        if (answer.value === 2) rawScores.orientationStyle.administrative += 5;
        if (answer.value === 3) rawScores.orientationStyle.creative += 5;
        if (answer.value === 4) rawScores.orientationStyle.peopleOriented += 5;
        break;
      case 'interest':
        if (answer.value === 1) rawScores.interest.tech += 5;
        if (answer.value === 2) rawScores.interest.business += 5;
        if (answer.value === 3) rawScores.interest.arts += 5;
        if (answer.value === 4) rawScores.interest.health += 5;
        if (answer.value === 5) rawScores.interest.social += 5;
        break;
      case 'personality':
        if (question.subCategory && question.subCategory in rawScores.personality) {
            (rawScores.personality as any)[question.subCategory] += answer.value;
        }
        break;
      case 'aptitude':
         if (question.subCategory && question.subCategory in rawScores.aptitude) {
            // value is either 5 for correct or 0 for incorrect
            (rawScores.aptitude as any)[question.subCategory] += answer.value;
        }
        break;
      case 'eq':
        if (question.subCategory && question.subCategory in rawScores.eq) {
            (rawScores.eq as any)[question.subCategory] += answer.value;
        }
        break;
    }
  });

  return rawScores;
};


// This function processes raw scores into normalized category scores for the chart.
export const getNormalizedScoresForChart = (scores: RawScores): Scores => {
    const normalize = (value: number, max: number) => (max > 0 ? Math.round((value / max) * 100) : 0);
    
    // Max scores based on new question distribution:
    // orientationStyle: 2 questions * 5 points = 10
    // interest: 5 questions * 5 points = 25
    // personality: 4 questions * 5 points = 20
    // aptitude: 5 questions * 5 points = 25
    // eq: 4 questions * 5 points = 20
    const MAX_SCORES = {
        orientationStyle: 10,
        interest: 25,
        personality: 20,
        aptitude: 25,
        eq: 20,
    };

    return {
        orientationStyle: normalize(
            Object.values(scores.orientationStyle).reduce((a, b) => a + b, 0), MAX_SCORES.orientationStyle
        ),
        interest: normalize(
            Object.values(scores.interest).reduce((a, b) => a + b, 0), MAX_SCORES.interest
        ),
        personality: normalize(
            Object.values(scores.personality).reduce((a, b) => a + b, 0), MAX_SCORES.personality
        ),
        aptitude: normalize(
            Object.values(scores.aptitude).reduce((a, b) => a + b, 0), MAX_SCORES.aptitude
        ),
        eq: normalize(
            Object.values(scores.eq).reduce((a, b) => a + b, 0), MAX_SCORES.eq
        ),
    };
};