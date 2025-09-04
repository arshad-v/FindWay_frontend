// This file has been refactored to support multiple AI providers.
// For clarity, you may consider renaming it to `aiService.ts`.

import { GoogleGenAI, Type } from "@google/genai";
import { type ReportData, type RawScores, type UserData, type Question } from '../types';

// --- SERVICE INTERFACE ---
// Defines a common structure for any AI service we want to implement.
export interface IAiService {
    generateAssessmentQuestions(userData: UserData): Promise<Question[]>;
    generateCareerReport(scores: RawScores, userData: UserData): Promise<ReportData>;
}


// --- GEMINI IMPLEMENTATION ---

const questionGenerationSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.NUMBER, description: "A unique number for the question, starting from 1." },
            text: { type: Type.STRING, description: "The question text to be displayed to the user." },
            category: { 
                type: Type.STRING,
                enum: ["orientationStyle", "interest", "personality", "aptitude", "eq"],
                description: "The main category this question belongs to."
            },
            subCategory: {
                type: Type.STRING,
                description: "The specific sub-category this question measures (e.g., 'creative', 'tech', 'resilience', 'logical', 'empathy')."
            },
        },
        required: ["id", "text", "category", "subCategory"],
    }
};

function createQuestionPrompt(userData: UserData): string {
    return `
You are an AI specializing in occupational psychology and psychometric assessment design. Your core function is to create reliable and valid psychometric aptitude and personality assessments for career guidance.

Your task is to generate a personalized assessment for a student with the following background:
- Education Level: ${userData.education || 'Not specified'}
- Major/Focus Subjects: ${userData.majorSubjects || 'Not specified'}
- Favorite Subject: ${userData.favoriteSubject || 'Not specified'}
- Extracurricular Activities: ${userData.extracurriculars || 'Not specified'}
- Stated Interests: ${userData.interests || 'Not specified'}
- Stated Skills: ${userData.skills || 'Not specified'}

**Instructions for Question Generation:**

1.  **Create Exactly 10 Questions:** Generate a diverse set of 10 questions.
2.  **Use Likert-Scale Format:** All questions must be first-person statements that a user can respond to on a 1-5 scale from "Strongly Disagree" to "Strongly Agree".
3.  **Focus on Psychometric Principles:**
    -   **Behavioral and Situational:** Frame questions around typical behaviors, preferences, and reactions to situations. Instead of "Are you creative?", use "I enjoy finding unconventional solutions to complex problems."
    -   **Neutrality:** Avoid loaded language or questions with socially desirable answers.
    -   **Clarity:** Use simple, direct language that is easy to understand.
4.  **Personalize the Assessment:** Subtly tailor the questions to the user's context. Use their major subjects, favorite subject, and extracurricular activities to make the questions more relatable. For example:
    - For a student whose favorite subject is 'History' and is in the 'Debate Club', an aptitude question could be "I am skilled at constructing a coherent argument from disparate pieces of information."
    - For a student interested in 'Biology' and 'Volunteering at an animal shelter', an EQ question could be "I feel a strong sense of connection and responsibility towards living things."
5.  **Ensure Category Balance:** Distribute the 10 questions evenly across the 5 main categories below, with exactly 2 questions per main category. For each question, select an appropriate sub-category.

**Assessment Categories & Sub-Categories:**

- **orientationStyle:** Measures preferred work environment and style.
  - (informative, administrative, creative, peopleOriented)
- **interest:** Measures affinity for different fields.
  - (tech, business, arts, health)
- **personality:** Measures core personality traits relevant to the workplace.
  - (resilience, teamwork, decisionMaking)
- **aptitude:** Measures self-assessed ability in key areas.
  - (logical, numerical, language)
- **eq:** Measures emotional intelligence.
  - (empathy, selfAwareness)

**Output Format:**
Return the 10 questions as a JSON array matching the specified schema. Do not include any text, markdown, or commentary outside the JSON array itself.
`;
}


const reportResponseSchema = {
    type: Type.OBJECT,
    properties: {
        strengths: {
            type: Type.ARRAY,
            description: "A list of the user's top 3 dominant strengths based on their scores.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The name of the strength (e.g., 'Analytical Prowess')." },
                    description: { type: Type.STRING, description: "A brief, encouraging explanation of this strength and how it relates to the user's scores." },
                },
                required: ["title", "description"],
            },
        },
        careerMatches: {
            type: Type.ARRAY,
            description: "A list of the top 3 career recommendations that align with the user's profile.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The job title of the recommended career." },
                    description: { type: Type.STRING, description: "A paragraph explaining why this career is a good fit based on the user's specific strengths and interests." },
                    trends: { type: Type.STRING, description: "A brief overview of current trends and opportunities in this field." },
                    education: { type: Type.STRING, description: "A summary of typical educational paths, degrees, or certifications required for this career." },
                },
                required: ["title", "description", "trends", "education"],
            },
        },
        developmentPlan: {
            type: Type.OBJECT,
            description: "A customized plan with actionable advice for the user's growth.",
            properties: {
                areasForImprovement: {
                    type: Type.ARRAY,
                    description: "A list of 1-2 areas where the user could focus on development, framed constructively.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "The name of the area for improvement (e.g., 'Collaborative Communication')." },
                            description: { type: Type.STRING, description: "A short, actionable tip for development in this area." },
                        },
                        required: ["title", "description"],
                    },
                },
                recommendations: {
                    type: Type.ARRAY,
                    description: "A list of specific, practical recommendations for the user to follow.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ["Habit", "Resource", "Exercise"], description: "The category of the recommendation." },
                            description: { type: Type.STRING, description: "The detailed recommendation itself (e.g., 'Explore online courses on Coursera for data analysis')." },
                        },
                        required: ["type", "description"],
                    },
                },
            },
            required: ["areasForImprovement", "recommendations"],
        },
    },
    required: ["strengths", "careerMatches", "developmentPlan"],
};

function createReportPrompt(scores: RawScores, userData: UserData): string {
    return `
You are an expert career counselor AI for high school and college students. Your tone is encouraging, professional, and easy to understand.

First, consider the user's personal background:
- Education Level: ${userData.education || 'Not provided'}
- Stated Interests: ${userData.interests || 'Not provided'}
- Stated Skills: ${userData.skills || 'Not provided'}

Now, based on their background and the following psychometric assessment scores, generate a highly personalized career guidance report. The scores are raw point values, where higher means stronger alignment. Make sure the career matches and development plan are especially relevant to their stated education and interests.

Scores:
- Orientation Style:
  - Informative: ${scores.orientationStyle.informative}
  - Administrative: ${scores.orientationStyle.administrative}
  - Creative: ${scores.orientationStyle.creative}
  - People-oriented: ${scores.orientationStyle.peopleOriented}
- Interest Areas:
  - Tech: ${scores.interest.tech}
  - Business: ${scores.interest.business}
  - Arts: ${scores.interest.arts}
  - Health: ${scores.interest.health}
- Personality Traits:
  - Resilience: ${scores.personality.resilience}
  - Teamwork: ${scores.personality.teamwork}
  - Decision-making: ${scores.personality.decisionMaking}
- Aptitude:
  - Logical Reasoning: ${scores.aptitude.logical}
  - Numerical Ability: ${scores.aptitude.numerical}
  - Language Usage: ${scores.aptitude.language}
- Emotional Quotient:
  - Empathy: ${scores.eq.empathy}
  - Self-awareness: ${scores.eq.selfAwareness}

Please provide the report in the specified JSON format. Do not include any introductory or concluding text outside of the JSON structure.
`;
}


class GeminiAiService implements IAiService {
    private ai: GoogleGenAI;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error("Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.");
        }
        this.ai = new GoogleGenAI({ apiKey });
    }
    
    public async generateAssessmentQuestions(userData: UserData): Promise<Question[]> {
        try {
            const prompt = createQuestionPrompt(userData);

            const response = await this.ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: questionGenerationSchema,
                },
            });

            const jsonText = response.text.trim();
            const questions: Question[] = JSON.parse(jsonText);
            return questions;

        } catch (error) {
            console.error("Error generating assessment questions from Gemini API:", error);
            throw new Error("Failed to communicate with the AI model for question generation.");
        }
    }

    public async generateCareerReport(scores: RawScores, userData: UserData): Promise<ReportData> {
        try {
            const prompt = createReportPrompt(scores, userData);

            const response = await this.ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: reportResponseSchema,
                },
            });

            const jsonText = response.text.trim();
            const reportData: ReportData = JSON.parse(jsonText);
            return reportData;

        } catch (error) {
            console.error("Error generating career report from Gemini API:", error);
            throw new Error("Failed to communicate with the AI model. Please check your connection and API key.");
        }
    }
}


// --- OPENAI PLACEHOLDER ---
class OpenAiService implements IAiService {
    constructor(apiKey: string) {
        if (!apiKey) throw new Error("OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.");
        // In a real scenario, you would initialize the OpenAI client here:
        // import OpenAI from 'openai';
        // this.openai = new OpenAI({ apiKey });
    }

    async generateAssessmentQuestions(userData: UserData): Promise<Question[]> {
        console.error("OpenAI service is not implemented yet.");
        throw new Error("OpenAI compatibility is not yet implemented.");
    }

    async generateCareerReport(scores: RawScores, userData: UserData): Promise<ReportData> {
        console.error("OpenAI service is not implemented yet.");
        throw new Error("OpenAI compatibility is not yet implemented.");
    }
}


// --- CLAUDE PLACEHOLDER ---
class ClaudeAiService implements IAiService {
    constructor(apiKey: string) {
         if (!apiKey) throw new Error("Anthropic API key is not configured. Please add ANTHROPIC_API_KEY to your .env file.");
        // In a real scenario, you would initialize the Anthropic client here:
        // import Anthropic from '@anthropic-ai/sdk';
        // this.anthropic = new Anthropic({ apiKey });
    }
    
    async generateAssessmentQuestions(userData: UserData): Promise<Question[]> {
        console.error("Claude service is not implemented yet.");
        throw new Error("Claude compatibility is not yet implemented.");
    }

    async generateCareerReport(scores: RawScores, userData: UserData): Promise<ReportData> {
        console.error("Claude service is not implemented yet.");
        throw new Error("Claude compatibility is not yet implemented.");
    }
}


// --- SERVICE FACTORY ---
// This function reads the environment configuration and returns the
// appropriate AI service instance.
let aiServiceInstance: IAiService | null = null;

export const getAiService = (): IAiService => {
    if (aiServiceInstance) {
        return aiServiceInstance;
    }

    const provider = process.env.DEFAULT_AI_PROVIDER || 'gemini';

    switch (provider.toLowerCase()) {
        case 'openai':
            aiServiceInstance = new OpenAiService(process.env.OPENAI_API_KEY!);
            break;
        case 'claude':
            aiServiceInstance = new ClaudeAiService(process.env.ANTHROPIC_API_KEY!);
            break;
        case 'gemini':
        default:
            // Use GEMINI_API_KEY and fall back to API_KEY for backward compatibility.
            const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
            aiServiceInstance = new GeminiAiService(apiKey!);
            break;
    }

    return aiServiceInstance;
};
