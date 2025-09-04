import { GoogleGenAI, Type } from "@google/genai";
import { type ReportData, type RawScores, type UserData, Question, QuestionType } from '../types';


// --- Gemini Implementation ---

function createPrompt(scores: RawScores, userData: UserData): string {
    return `
You are an expert career counselor AI for students. Your tone should be encouraging, professional, insightful, and feel like a personal conversation with a wise mentor. Your goal is to generate a comprehensive, deeply personalized, and fully narrative career guidance report that makes the user feel seen and understood.

First, consider the user's personal background:
- Name: ${userData.name || 'Not provided'}
- Age: ${userData.age || 'Not provided'}
- Education Level: ${userData.education || 'Not provided'}
- Degree/Program: ${userData.degree || 'Not provided'}
- Department/Major: ${userData.department || 'Not provided'}
- Stated Skills: ${userData.skills || 'Not provided'}
- Stated Area of Interest: ${userData.areaOfInterest || 'Not provided'}

Now, using their background and the following psychometric assessment scores, generate the report. The scores are raw point values, where higher means stronger alignment. Every piece of analysis and advice must be directly tied back to this data.

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
  - Social: ${scores.interest.social}
- Personality Traits:
  - Resilience: ${scores.personality.resilience}
  - Teamwork: ${scores.personality.teamwork}
  - Decision-making: ${scores.personality.decisionMaking}
  - Openness: ${scores.personality.openness}
- Aptitude:
  - Logical Reasoning: ${scores.aptitude.logical}
  - Numerical Ability: ${scores.aptitude.numerical}
  - Language Usage: ${scores.aptitude.language}
  - General Knowledge: ${scores.aptitude.generalKnowledge}
  - Attention to Detail: ${scores.aptitude.attentionToDetail}
- Emotional Quotient:
  - Empathy: ${scores.eq.empathy}
  - Self-awareness: ${scores.eq.selfAwareness}
  - Social Skills: ${scores.eq.socialSkills}
  - Motivation: ${scores.eq.motivation}

--- Report Generation Instructions ---
Please provide the report in the specified JSON format. Ensure all text is well-written, engaging, and provides deep, actionable insights. Do not include any introductory or concluding text outside of the JSON structure.

-   **profileSummary**: Craft a narrative summary that weaves together the user's background (e.g., their major and interests) with their key assessment results. It should be an engaging opening that makes them feel uniquely understood.
-   **strengths**: For each strength, provide a concrete example of how this strength might manifest in a real-world scenario relevant to the user's field of interest.
-   **careerMatches**: For each career match, go beyond a simple description. Explain *how* their specific personality traits (e.g., high resilience) and aptitudes (e.g., strong logical reasoning) would make them successful and fulfilled in this role. Make the connection explicit and personal. The career compatibility score should be a number between 70 and 99.
-   **developmentPlan**: Frame 'areasForImprovement' as 'Opportunities for Growth'. Recommendations should be highly specific and actionable (e.g., instead of 'Read books', suggest a specific book title, online course, or practical exercise).
-   **detailedAnalyses**: In each analysis, try to connect the findings to other parts of the assessment. For example, 'Your high score in the People-Oriented style is complemented by your strong Empathy score, making you a natural leader in collaborative environments.'
-   **concludingRemarks**: Write a powerful and memorable concluding paragraph. It should summarize their potential and leave them feeling inspired and confident about their next steps on their career journey.
`;
}

const testQuestionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.INTEGER },
            text: { type: Type.STRING },
            type: { type: Type.STRING, enum: [QuestionType.MultipleChoice, QuestionType.Likert] },
            category: { type: Type.STRING, enum: ['orientationStyle', 'interest', 'personality', 'aptitude', 'eq'] },
            subCategory: { type: Type.STRING },
            options: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        text: { type: Type.STRING },
                        value: { type: Type.INTEGER },
                    },
                    required: ["text", "value"],
                }
            }
        },
        required: ["id", "text", "type", "category", "subCategory", "options"],
    }
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        profileSummary: {
            type: Type.STRING,
            description: "A brief, encouraging, and insightful 2-3 sentence summary of the user's overall profile, acting as an introduction to the report."
        },
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
                    compatibility: { type: Type.INTEGER, description: "A percentage score (70-99) indicating the strength of the career match." }
                },
                required: ["title", "description", "trends", "education", "compatibility"],
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
        detailedAnalyses: {
            type: Type.OBJECT,
            description: "AI-generated interpretations for each of the five main assessment categories.",
            properties: {
                orientationStyle: { type: Type.STRING, description: "A brief analysis of the user's dominant orientation style and what it means." },
                interest: { type: Type.STRING, description: "An interpretation of the user's primary areas of interest." },
                personality: { type: Type.STRING, description: "An analysis of the user's key personality traits based on their scores." },
                aptitude: { type: Type.STRING, description: "A summary of the user's aptitudes and cognitive strengths." },
                eq: { type: Type.STRING, description: "An interpretation of the user's emotional quotient scores." }
            },
            required: ["orientationStyle", "interest", "personality", "aptitude", "eq"],
        },
        concludingRemarks: {
            type: Type.STRING,
            description: "A final, uplifting, and forward-looking paragraph to conclude the report. It should summarize the user's potential and leave them feeling inspired and confident about their next steps."
        }
    },
    required: ["profileSummary", "strengths", "careerMatches", "developmentPlan", "detailedAnalyses", "concludingRemarks"],
};


const generateTestQuestionsWithGemini = async (userData: UserData): Promise<Question[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const prompt = `
            You are an expert in psychometrics and educational assessments. Your task is to generate a set of exactly 20 assessment questions based on the user profile provided below. The questions must be tailored to the user's background and suitable for their education level. All questions must be simple, straightforward, and easy to understand, avoiding technical jargon or complex scenarios. Assign unique IDs to the questions starting from 1.

            --- Important Rules ---
            1.  **Strict Order:** The final JSON array MUST contain the 10 Psychometric questions first, followed by the 10 Non-Psychometric questions, in that exact order.
            2.  **No User Name:** Do NOT include the user's name in any question text.
            3.  **subCategory is REQUIRED:** Every question object MUST have a 'subCategory' field.
            4.  **Question Perspective:**
                -   For Psychometric questions (personality, eq, orientationStyle), frame them from a first-person perspective (e.g., "I find it easy to...", "I am comfortable with...").
                -   For Non-Psychometric questions (aptitude, interest), they MUST be impersonal and objective.

            --- User Profile ---
            - Age: ${userData.age || 'Not specified'}
            - Education Level: ${userData.education || 'Not specified'}
            - Degree/Program: ${userData.degree || 'Not specified'}
            - Department/Major: ${userData.department || 'Not specified'}
            - Skills: ${userData.skills || 'Not specified'}
            - Area of Interest: ${userData.areaOfInterest || 'Not specified'}

            --- Question Generation Instructions (20 Questions Total) ---

            --- Section 1: Psychometric Questions (First 10 Questions) ---
            These questions explore personality, emotional intelligence, and work style preferences.

            1.  **orientationStyle (2 questions):**
                -   \`type\`: 'multiple-choice'.
                -   \`category\`: 'orientationStyle'.
                -   The \`subCategory\` field MUST be the string "none".
                -   Each question must have 4 options, each representing one of the four orientation styles.
                -   Option values MUST be: 1 for 'informative' (analytical, data-driven), 2 for 'administrative' (organized, process-oriented), 3 for 'creative' (innovative, artistic), 4 for 'peopleOriented' (collaborative, empathetic).

            2.  **personality (4 questions):**
                -   \`type\`: 'likert'.
                -   \`category\`: 'personality'.
                -   The \`subCategory\` field MUST be one of: 'resilience', 'teamwork', 'decisionMaking', 'openness'. Create one question for each sub-category.
                -   Options must be a 5-point Likert scale (e.g., "Strongly Disagree" to "Strongly Agree") with values 1, 2, 3, 4, 5.

            3.  **eq (4 questions):**
                -   \`type\`: 'likert'.
                -   \`category\`: 'eq'.
                -   The \`subCategory\` field MUST be one of: 'empathy', 'selfAwareness', 'socialSkills', 'motivation'. Create one question for each sub-category.
                -   Options must be a 5-point Likert scale with values 1, 2, 3, 4, 5.

            --- Section 2: Non-Psychometric Questions (Next 10 Questions) ---
            These questions assess aptitude, skills, and areas of interest. Crucially, these questions must be highly contextualized to the user's profile. Use their stated education level, degree, skills, and interests to create relevant and engaging questions. All questions must be very easy to understand, even for a high-school student.

            4.  **interest (5 questions):**
                -   \`type\`: 'multiple-choice'.
                -   \`category\`: 'interest'.
                -   The \`subCategory\` field MUST be the string "none".
                -   Each question should present a simple, relatable scenario or activity. The options should reflect different interests. For example, if the user is interested in 'Technology', a question could be "Which of these weekend projects sounds most appealing?". The options would then represent tech, business, arts, health, and social activities.
                -   Each question must have exactly 5 options, each corresponding to one of the 5 interest categories.
                -   Option values MUST be: 1 for 'tech', 2 for 'business', 3 for 'arts', 4 for 'health', 5 for 'social' (e.g., teaching, social work, counseling).

            5.  **aptitude (5 questions):**
                -   \`type\`: 'multiple-choice'.
                -   \`category\`: 'aptitude'.
                -   The \`subCategory\` field MUST be one of: 'logical', 'numerical', 'language', 'generalKnowledge', 'attentionToDetail'. It is critical that every aptitude question has a 'subCategory' field with one of these exact values. Create one question for each.
                -   Tailor the context of these questions to the user's profile. For instance, if the user is a 'Computer Science' major, the 'logical' reasoning question could involve a simple code-like sequence. If they are an 'Arts' student, the 'attentionToDetail' question could involve finding differences between two similar images or patterns.
                -   Each question MUST have exactly 5 options.
                -   For the 'numerical' question, ask a very simple question about number patterns or basic arithmetic. DO NOT include algebra, geometry, or complex word problems. The context should be simple and universal (e.g., calculating a discount, not a complex physics problem).
                -   The 'generalKnowledge' question must be directly inspired by the user's stated area of interest, major, or skills. For example, for a 'Biology' student, ask a basic biology question.
                -   The 'attentionToDetail' question should be a simple visual or text-based puzzle.
                -   For each question, provide one correct answer with a \`value\` of 5, and four incorrect answers with a \`value\` of 0.

            --- Output Format ---
            Return ONLY a valid JSON array of 20 question objects matching the provided schema. Do not include any other text, explanations, or markdown formatting. Remember the strict ordering of Psychometric first, then Non-Psychometric.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: testQuestionSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const questions: Question[] = JSON.parse(jsonText);
        return questions;

    } catch (error) {
        console.error("Error generating dynamic questions from Gemini API:", error);
        throw new Error("Failed to generate a personalized assessment from Gemini. Please try again.");
    }
};

const generateCareerReportWithGemini = async (scores: RawScores, userData: UserData): Promise<ReportData> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const prompt = createPrompt(scores, userData);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const reportData: ReportData = JSON.parse(jsonText);
        return reportData;

    } catch (error) {
        console.error("Error generating career report from Gemini API:", error);
        throw new Error("Failed to communicate with the Gemini AI model. Please check your connection and API key.");
    }
};


// --- OpenAI Implementation (Placeholder) ---

const generateTestQuestionsWithOpenAI = async (userData: UserData): Promise<Question[]> => {
    // To implement this, you would need to:
    // 1. Add the OpenAI SDK to the project.
    // 2. Get the API key from process.env.OPENAI_API_KEY.
    // 3. Create a prompt suitable for an OpenAI model (e.g., GPT-4).
    // 4. Call the OpenAI API, ensuring it returns JSON in the expected format.
    // 5. Parse the response and return the questions.
    throw new Error("OpenAI provider is not yet implemented. A developer needs to add the SDK and complete this function.");
};

const generateCareerReportWithOpenAI = async (scores: RawScores, userData: UserData): Promise<ReportData> => {
    throw new Error("OpenAI provider is not yet implemented. A developer needs to add the SDK and complete this function.");
};


// --- Claude Implementation (Placeholder) ---

const generateTestQuestionsWithClaude = async (userData: UserData): Promise<Question[]> => {
    // To implement this, you would need to:
    // 1. Add the Anthropic (Claude) SDK to the project.
    // 2. Get the API key from process.env.CLAUDE_API_KEY.
    // 3. Create a prompt suitable for a Claude model.
    // 4. Call the Claude API, ensuring it returns JSON in the expected format.
    // 5. Parse the response and return the questions.
    throw new Error("Claude provider is not yet implemented. A developer needs to add the SDK and complete this function.");
};

const generateCareerReportWithClaude = async (scores: RawScores, userData: UserData): Promise<ReportData> => {
    throw new Error("Claude provider is not yet implemented. A developer needs to add the SDK and complete this function.");
};


// --- AI Service Router ---

// These are the main exported functions. They will call the correct
// provider based on the AI_PROVIDER environment variable.

export const generateTestQuestions = async (userData: UserData): Promise<Question[]> => {
    const provider = process.env.AI_PROVIDER || 'gemini';

    switch (provider.toLowerCase()) {
        case 'openai':
            return generateTestQuestionsWithOpenAI(userData);
        case 'claude':
            return generateTestQuestionsWithClaude(userData);
        case 'gemini':
        default:
            return generateTestQuestionsWithGemini(userData);
    }
};

export const generateCareerReport = async (scores: RawScores, userData: UserData): Promise<ReportData> => {
    const provider = process.env.AI_PROVIDER || 'gemini';

    switch (provider.toLowerCase()) {
        case 'openai':
            return generateCareerReportWithOpenAI(scores, userData);
        case 'claude':
            return generateCareerReportWithClaude(scores, userData);
        case 'gemini':
        default:
            return generateCareerReportWithGemini(scores, userData);
    }
};
