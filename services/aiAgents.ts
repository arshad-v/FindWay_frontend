import { GoogleGenAI, Type } from "@google/genai";
import { type ReportData, type RawScores, type UserData, Question, QuestionType, type PathwayPlan, type PathwayStep } from '../types';

// ===== AI AGENT ARCHITECTURE =====
// This file implements a specialized AI agent system with three distinct agents:
// 1. Question Generator Agent - Creates personalized assessment questions
// 2. Evaluation Agent (Profile Interpreter) - Analyzes raw scores and creates detailed profile interpretation
// 3. Report Generator Agent - Creates final user-facing career report based on evaluation

// ===== AGENT 1: QUESTION GENERATOR =====
// Responsible for creating personalized assessment questions based on user profile

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

export const questionGeneratorAgent = async (userData: UserData): Promise<Question[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const language = userData.assessmentLanguage || 'English';
        const languageInstruction = language === 'Malayalam' 
            ? `
            **IMPORTANT LANGUAGE REQUIREMENT:**
            - Generate ALL questions and ALL answer options in Malayalam language
            - Use proper Malayalam script (മലയാളം)
            - Keep the JSON structure and field names in English for technical compatibility
            - Only the "text" fields for questions and options should be in Malayalam
            - Ensure cultural appropriateness for Malayalam-speaking users
            `
            : `
            **LANGUAGE REQUIREMENT:**
            - Generate all questions and answer options in English
            `;

        const prompt = `
            You are an expert psychometric assessment specialist. Your role is to generate exactly 20 personalized assessment simple questions based on the user's profile. Each question must be understandale and tailored to their background while maintaining scientific validity.

            ${languageInstruction}

            --- User Profile ---
            - Age: ${userData.age || 'Not specified'}
            - Education Level: ${userData.education || 'Not specified'}
            - Degree/Program: ${userData.degree || 'Not specified'}
            - Department/Major: ${userData.department || 'Not specified'}
            - Skills: ${userData.skills || 'Not specified'}
            - Area of Interest: ${userData.areaOfInterest || 'Not specified'}
            - Assessment Language: ${language}

            --- Question Generation Rules ---
            1. **Strict Order:** 10 Psychometric questions first, then 10 Non-Psychometric questions
            2. **No User Name:** Never include the user's name in question text
            3. **subCategory is REQUIRED:** Every question must have this field
            4. **Question Perspective:**
               - Psychometric questions: First-person ("I find it easy to..." or Malayalam equivalent)
               - Non-Psychometric questions: Impersonal and objective
            5. **Language Consistency:** All question text and option text must be in ${language}

            --- Section 1: Psychometric Questions (First 10) ---
            
            **orientationStyle (2 questions):**
            - type: 'multiple-choice', category: 'orientationStyle', subCategory: "none"
            - 4 options with values: 1='informative', 2='administrative', 3='creative', 4='peopleOriented'

            **personality (4 questions):**
            - type: 'likert', category: 'personality'
            - subCategory: one of 'resilience', 'teamwork', 'decisionMaking', 'openness'
            - 5-point Likert scale (values 1-5)

            **eq (4 questions):**
            - type: 'likert', category: 'eq'
            - subCategory: one of 'empathy', 'selfAwareness', 'socialSkills', 'motivation'
            - 5-point Likert scale (values 1-5)

            --- Section 2: Non-Psychometric Questions (Next 10) ---

            **interest (5 questions):**
            - type: 'multiple-choice', category: 'interest', subCategory: "none"
            - 5 options with values: 1='tech', 2='business', 3='arts', 4='health', 5='social'
            - Contextualize scenarios to user's background

            **aptitude (5 questions):**
            - type: 'multiple-choice', category: 'aptitude'
            - subCategory: one of 'logical', 'numerical', 'language', 'generalKnowledge', 'attentionToDetail'
            - 5 options each: 1 correct (value=5), 4 incorrect (value=0)
            - Tailor context to user's field of study

            Return ONLY a valid JSON array of 20 question objects. No additional text or formatting.
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
        console.error("Question Generator Agent Error:", error);
        throw new Error("Failed to generate personalized assessment questions. Please try again.");
    }
};

// ===== AGENT 2: EVALUATION AGENT (PROFILE INTERPRETER) =====
// Analyzes raw scores and user data to create comprehensive profile interpretation

interface ProfileAnalysis {
    corePersonality: string;
    dominantStrengths: string[];
    cognitiveProfile: string;
    emotionalIntelligence: string;
    workStylePreferences: string;
    potentialChallenges: string[];
    careerReadiness: string;
    uniqueTraits: string[];
    developmentOpportunities: string[];
    overallNarrative: string;
}

const profileAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        corePersonality: {
            type: Type.STRING,
            description: "Deep analysis of the user's core personality based on all assessment dimensions"
        },
        dominantStrengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 4-6 key strengths identified from the assessment"
        },
        cognitiveProfile: {
            type: Type.STRING,
            description: "Analysis of cognitive abilities, thinking patterns, and problem-solving approach"
        },
        emotionalIntelligence: {
            type: Type.STRING,
            description: "Comprehensive evaluation of emotional intelligence and interpersonal skills"
        },
        workStylePreferences: {
            type: Type.STRING,
            description: "Analysis of preferred work environments, collaboration styles, and task approaches"
        },
        potentialChallenges: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Areas that may require attention or development"
        },
        careerReadiness: {
            type: Type.STRING,
            description: "Assessment of readiness for different career paths and professional environments"
        },
        uniqueTraits: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Distinctive characteristics that set this individual apart"
        },
        developmentOpportunities: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific areas for growth and skill development"
        },
        overallNarrative: {
            type: Type.STRING,
            description: "Cohesive narrative that ties together all aspects of the profile"
        }
    },
    required: ["corePersonality", "dominantStrengths", "cognitiveProfile", "emotionalIntelligence", 
               "workStylePreferences", "potentialChallenges", "careerReadiness", "uniqueTraits", 
               "developmentOpportunities", "overallNarrative"]
};

export const evaluationAgent = async (scores: RawScores, userData: UserData): Promise<ProfileAnalysis> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const prompt = `
            You are an expert psychological profiler and career assessment specialist. Your role is to perform a comprehensive, in-depth analysis of the user's psychometric assessment results and personal background. This analysis will be used by another AI agent to generate the final career report.

            --- User Background ---
            - Name: ${userData.name || 'Not provided'}
            - Age: ${userData.age || 'Not provided'}
            - Education: ${userData.education || 'Not provided'}
            - Degree/Program: ${userData.degree || 'Not provided'}
            - Department/Major: ${userData.department || 'Not provided'}
            - Skills: ${userData.skills || 'Not provided'}
            - Area of Interest: ${userData.areaOfInterest || 'Not provided'}

            --- Assessment Scores (Raw Values) ---
            Orientation Style:
            - Informative: ${scores.orientationStyle.informative}
            - Administrative: ${scores.orientationStyle.administrative}
            - Creative: ${scores.orientationStyle.creative}
            - People-oriented: ${scores.orientationStyle.peopleOriented}

            Interest Areas:
            - Technology: ${scores.interest.tech}
            - Business: ${scores.interest.business}
            - Arts: ${scores.interest.arts}
            - Health: ${scores.interest.health}
            - Social: ${scores.interest.social}

            Personality Traits:
            - Resilience: ${scores.personality.resilience}
            - Teamwork: ${scores.personality.teamwork}
            - Decision-making: ${scores.personality.decisionMaking}
            - Openness: ${scores.personality.openness}

            Aptitude:
            - Logical Reasoning: ${scores.aptitude.logical}
            - Numerical Ability: ${scores.aptitude.numerical}
            - Language Usage: ${scores.aptitude.language}
            - General Knowledge: ${scores.aptitude.generalKnowledge}
            - Attention to Detail: ${scores.aptitude.attentionToDetail}

            Emotional Quotient:
            - Empathy: ${scores.eq.empathy}
            - Self-awareness: ${scores.eq.selfAwareness}
            - Social Skills: ${scores.eq.socialSkills}
            - Motivation: ${scores.eq.motivation}

            --- Analysis Instructions ---
            Perform a comprehensive psychological and professional profile analysis. For each field:

            1. **corePersonality**: Write a detailed 200+ word analysis synthesizing all personality dimensions, identifying the core personality type and how different traits interact.

            2. **dominantStrengths**: Identify 4-6 specific strengths based on highest scores and trait combinations. Be specific and evidence-based.

            3. **cognitiveProfile**: Analyze cognitive patterns, problem-solving approaches, learning preferences, and intellectual strengths based on aptitude scores.

            4. **emotionalIntelligence**: Comprehensive analysis of EQ dimensions and how they manifest in interpersonal and professional contexts.

            5. **workStylePreferences**: Detailed analysis of preferred work environments, collaboration styles, leadership potential, and task management approaches.

            6. **potentialChallenges**: Identify 2-4 areas that may need attention based on lower scores or trait combinations that could create challenges.

            7. **careerReadiness**: Assess readiness for different career environments (corporate, entrepreneurial, creative, service-oriented, etc.).

            8. **uniqueTraits**: Identify 3-5 distinctive characteristics that make this person unique in professional settings.

            9. **developmentOpportunities**: Specific areas for growth that would enhance career prospects and personal effectiveness.

            10. **overallNarrative**: A cohesive 250+ word narrative that ties together all aspects into a complete professional identity profile.

            Focus on creating rich, nuanced insights that go beyond simple score interpretation. Consider trait interactions, compensatory mechanisms, and potential for growth.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: profileAnalysisSchema,
            },
        });

        const jsonText = response.text.trim();
        const analysis: ProfileAnalysis = JSON.parse(jsonText);
        return analysis;

    } catch (error) {
        console.error("Evaluation Agent Error:", error);
        throw new Error("Failed to analyze profile data. Please try again.");
    }
};

// ===== AGENT 3: REPORT GENERATOR =====
// Creates final user-facing career report based on evaluation agent's analysis

const reportSchema = {
    type: Type.OBJECT,
    properties: {
        profileSummary: {
            type: Type.STRING,
            description: "Engaging 150+ word summary that makes the user feel understood and sets positive tone"
        },
        strengths: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["title", "description"]
            }
        },
        careerMatches: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    trends: { type: Type.STRING },
                    education: { type: Type.STRING },
                    compatibility: { type: Type.INTEGER },
                    keyResponsibilities: { type: Type.STRING },
                    requiredSkills: { type: Type.STRING },
                    growthPath: { type: Type.STRING },
                    salaryIndia: {
                        type: Type.OBJECT,
                        properties: {
                            entry: { type: Type.STRING },
                            mid: { type: Type.STRING },
                            senior: { type: Type.STRING }
                        },
                        required: ["entry", "mid", "senior"]
                    },
                    salaryAbroad: {
                        type: Type.OBJECT,
                        properties: {
                            entry: { type: Type.STRING },
                            mid: { type: Type.STRING },
                            senior: { type: Type.STRING }
                        },
                        required: ["entry", "mid", "senior"]
                    }
                },
                required: ["title", "description", "trends", "education", "compatibility", 
                          "keyResponsibilities", "requiredSkills", "growthPath", "salaryIndia", "salaryAbroad"]
            }
        },
        developmentPlan: {
            type: Type.OBJECT,
            properties: {
                areasForImprovement: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING }
                        },
                        required: ["title", "description"]
                    }
                },
                recommendations: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ["Habit", "Resource", "Exercise"] },
                            description: { type: Type.STRING }
                        },
                        required: ["type", "description"]
                    }
                }
            },
            required: ["areasForImprovement", "recommendations"]
        },
        detailedAnalyses: {
            type: Type.OBJECT,
            properties: {
                orientationStyle: { type: Type.STRING },
                interest: { type: Type.STRING },
                personality: { type: Type.STRING },
                aptitude: { type: Type.STRING },
                eq: { type: Type.STRING }
            },
            required: ["orientationStyle", "interest", "personality", "aptitude", "eq"]
        },
        concludingRemarks: {
            type: Type.STRING,
            description: "Inspiring 100+ word conclusion that motivates and provides clear next steps"
        }
    },
    required: ["profileSummary", "strengths", "careerMatches", "developmentPlan", "detailedAnalyses", "concludingRemarks"]
};

export const reportGeneratorAgent = async (
    profileAnalysis: ProfileAnalysis, 
    scores: RawScores, 
    userData: UserData
): Promise<ReportData> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const prompt = `
            You are an expert career counselor and report writer. Your role is to create an inspiring, comprehensive career guidance report based on the detailed psychological analysis provided by a specialist. Your tone should be encouraging, professional, and feel like a conversation with a wise mentor.

            --- User Information ---
            - Name: ${userData.name}
            - Age: ${userData.age}
            - Education: ${userData.education}
            - Background: ${userData.degree} in ${userData.department}
            - Skills: ${userData.skills}
            - Interests: ${userData.areaOfInterest}

            --- Comprehensive Profile Analysis (From Evaluation Agent) ---
            
            **Core Personality:** ${profileAnalysis.corePersonality}
            
            **Dominant Strengths:** ${profileAnalysis.dominantStrengths.join(', ')}
            
            **Cognitive Profile:** ${profileAnalysis.cognitiveProfile}
            
            **Emotional Intelligence:** ${profileAnalysis.emotionalIntelligence}
            
            **Work Style Preferences:** ${profileAnalysis.workStylePreferences}
            
            **Potential Challenges:** ${profileAnalysis.potentialChallenges.join(', ')}
            
            **Career Readiness:** ${profileAnalysis.careerReadiness}
            
            **Unique Traits:** ${profileAnalysis.uniqueTraits.join(', ')}
            
            **Development Opportunities:** ${profileAnalysis.developmentOpportunities.join(', ')}
            
            **Overall Narrative:** ${profileAnalysis.overallNarrative}

            --- Report Generation Instructions ---

            Create a comprehensive, encouraging career report with the following specifications:

            **profileSummary (150+ words):** Craft an engaging opening that weaves together the user's background with key insights from the analysis. Make them feel uniquely understood and set a positive, inspiring tone.

            **strengths (3-4 items):** Transform the dominant strengths into encouraging strength descriptions with specific examples of how each manifests professionally.

            **careerMatches (3 careers):** Based on the analysis, recommend 3 highly compatible careers. For each:
            - Provide detailed description (200+ words) explaining fit based on specific traits
            - Include comprehensive job scope, salary ranges for India and abroad
            - Compatibility scores between 75-95%
            - Realistic salary ranges: India (₹3-8 LPA entry, ₹8-25 LPA mid, ₹20-60 LPA senior), Abroad ($40K-80K entry, $70K-150K mid, $120K-300K+ senior)

            **developmentPlan:** Frame challenges as growth opportunities with specific, actionable recommendations including books, courses, and practical exercises.

            **detailedAnalyses:** Create substantial paragraphs (5-7 sentences each) for each assessment category, connecting findings to career implications.

            **concludingRemarks (100+ words):** Write an inspiring conclusion that summarizes their unique potential and provides clear, motivating next steps.

            Focus on creating a report that feels deeply personal, encouraging, and actionable. Use the rich analysis provided to make specific, evidence-based recommendations.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: reportSchema,
            },
        });

        const jsonText = response.text.trim();
        const report: ReportData = JSON.parse(jsonText);
        return report;

    } catch (error) {
        console.error("Report Generator Agent Error:", error);
        throw new Error("Failed to generate career report. Please try again.");
    }
};

// ===== ORCHESTRATOR FUNCTION =====
// Manages the agent pipeline: Evaluation Agent → Report Generator Agent

export const generateCareerReportWithAgents = async (
    scores: RawScores, 
    userData: UserData
): Promise<ReportData> => {
    try {
        console.log("🤖 Starting AI Agent Pipeline...");
        
        // Step 1: Profile Analysis (Agent 2)
        console.log("📊 Agent 2: Analyzing profile and scores...");
        const profileAnalysis = await evaluationAgent(scores, userData);
        
        // Step 2: Report Generation (Agent 3)
        console.log("📝 Agent 3: Generating career report...");
        const report = await reportGeneratorAgent(profileAnalysis, scores, userData);
        
        console.log("✅ AI Agent Pipeline completed successfully");
        return report;
        
    } catch (error) {
        console.error("❌ AI Agent Pipeline Error:", error);
        throw new Error("Failed to generate career report using AI agents. Please try again.");
    }
};

// ===== AGENT 4: CONVERSATIONAL CAREER COACH =====
// Interactive chat agent that helps users explore their career report in depth

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatResponse {
    message: string;
    suggestions?: string[];
}

const chatResponseSchema = {
    type: Type.OBJECT,
    properties: {
        message: {
            type: Type.STRING,
            description: "The career coach's response to the user's question"
        },
        suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Optional follow-up question suggestions for the user"
        }
    },
    required: ["message"]
};

export const conversationalCareerCoachAgent = async (
    userMessage: string,
    reportData: ReportData,
    userData: UserData,
    chatHistory: ChatMessage[] = []
): Promise<ChatResponse> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const conversationContext = chatHistory
            .slice(-6) // Keep last 6 messages for context
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n');

        const prompt = `
            You are an expert career coach having a personal conversation with ${userData.name}. You have just completed their comprehensive career assessment and are now available to answer any questions they have about their results.

            --- User Profile ---
            - Name: ${userData.name}
            - Age: ${userData.age}
            - Education: ${userData.education}
            - Background: ${userData.degree} in ${userData.department}
            - Skills: ${userData.skills}
            - Interests: ${userData.areaOfInterest}

            --- Their Career Assessment Results ---
            
            **Profile Summary:** ${reportData.profileSummary}

            **Top Strengths:**
            ${reportData.strengths.map(s => `- ${s.title}: ${s.description}`).join('\n')}

            **Career Matches:**
            ${reportData.careerMatches.map((career, i) => `
            ${i + 1}. ${career.title} (${career.compatibility}% match)
               - ${career.description}
               - Trends: ${career.trends}
               - Education: ${career.education}
               - Key Responsibilities: ${career.keyResponsibilities || 'Strategic planning, leadership, project management'}
               - Required Skills: ${career.requiredSkills || 'Technical expertise, communication, problem-solving'}
               - Growth Path: ${career.growthPath || 'Junior → Senior → Lead → Manager'}
               - Salary India: Entry ${career.salaryIndia?.entry || '₹3-8 LPA'}, Mid ${career.salaryIndia?.mid || '₹8-20 LPA'}, Senior ${career.salaryIndia?.senior || '₹20-50 LPA'}
               - Salary Abroad: Entry ${career.salaryAbroad?.entry || '$50K-80K'}, Mid ${career.salaryAbroad?.mid || '$80K-150K'}, Senior ${career.salaryAbroad?.senior || '$150K-300K+'}
            `).join('\n')}

            **Development Areas:**
            ${reportData.developmentPlan.areasForImprovement.map(area => `- ${area.title}: ${area.description}`).join('\n')}

            **Recommendations:**
            ${reportData.developmentPlan.recommendations.map(rec => `- ${rec.type}: ${rec.description}`).join('\n')}

            **Detailed Analysis:**
            - Orientation Style: ${reportData.detailedAnalyses.orientationStyle}
            - Interests: ${reportData.detailedAnalyses.interest}
            - Personality: ${reportData.detailedAnalyses.personality}
            - Aptitude: ${reportData.detailedAnalyses.aptitude}
            - Emotional Intelligence: ${reportData.detailedAnalyses.eq}

            --- Recent Conversation ---
            ${conversationContext}

            --- Current User Question ---
            ${userMessage}

            --- Instructions ---
            You are a friendly, supportive AI career coach having a conversation about career assessment results. Respond as a knowledgeable coach who understands their profile.

            Guidelines:
            1. **Be Direct**: Don't use the user's name, get straight to the point
            2. **Be Conversational**: Write naturally and warmly
            3. **Be Specific**: Reference exact details from their report when relevant
            4. **Be Encouraging**: Maintain a positive, supportive tone with relevant emojis
            5. **Be Practical**: Give actionable advice they can implement
            6. **Be Concise**: Keep responses short and focused (50-150 words max)

            Response Style:
            - Use a warm, encouraging tone with appropriate emojis 🎯 💪 ✨ 🚀 💡 🌟
            - Keep responses brief and to the point
            - Reference specific details from their assessment
            - Provide practical next steps when appropriate
            - Include relevant emojis to make responses engaging

            For suggestions, provide 2-3 relevant follow-up questions they might want to ask based on your response.

            Respond in JSON format with your message and optional suggestions.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: chatResponseSchema,
            },
        });

        const jsonText = response.text.trim();
        const chatResponse: ChatResponse = JSON.parse(jsonText);
        return chatResponse;

    } catch (error) {
        console.error("Conversational Career Coach Agent Error:", error);
        throw new Error("Failed to generate career coaching response. Please try again.");
    }
};

// ===== LEGACY COMPATIBILITY =====
// Maintain compatibility with existing code while transitioning to agent architecture

export const generateTestQuestions = async (userData: UserData): Promise<Question[]> => {
    return questionGeneratorAgent(userData);
};

export const generateCareerReport = async (scores: RawScores, userData: UserData): Promise<ReportData> => {
    return generateCareerReportWithAgents(scores, userData);
};

// ===== AGENT 5: PATHWAY GENERATOR =====
// Creates personalized career pathway plans based on user profile and target career

const pathwayPlanSchema = {
    type: Type.OBJECT,
    properties: {
        careerTitle: {
            type: Type.STRING,
            description: "The target career title"
        },
        steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        enum: ['Education', 'Skill Development', 'Practical Experience', 'Certification', 'Networking']
                    },
                    title: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["type", "title", "duration", "description"]
            }
        }
    },
    required: ["careerTitle", "steps"]
};

export const pathwayGeneratorAgent = async (
    userData: UserData,
    careerTitle: string
): Promise<PathwayPlan> => {
    const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('Gemini API key not found. Please check your environment variables.');
    }
    const ai = new GoogleGenAI({ apiKey });

    try {
        const prompt = `
            You are an expert career and academic advisor. Your role is to create a personalized, step-by-step pathway plan that shows how the user can transition from their current position to their target career.

            --- User's Current Profile ---
            - Name: ${userData.name}
            - Age: ${userData.age}
            - Current Education: ${userData.education}
            - Degree/Program: ${userData.degree || 'Not specified'}
            - Department/Major: ${userData.department || 'Not specified'}
            - Current Skills: ${userData.skills || 'Not specified'}
            - Areas of Interest: ${userData.areaOfInterest || 'Not specified'}

            --- Target Career ---
            ${careerTitle}

            --- Instructions ---
            Create a logical, chronological sequence of 4-7 steps that will help the user transition from their current position to becoming a ${careerTitle}. Each step should be:

            1. **Realistic**: Based on their current education level and background
            2. **Specific**: Include concrete actions and timeframes
            3. **Progressive**: Each step builds upon the previous ones
            4. **Actionable**: Clear what they need to do

            **Step Types to Use:**
            - **Education**: Formal degrees, courses, certifications from institutions
            - **Skill Development**: Technical skills, software, programming languages, tools
            - **Practical Experience**: Internships, projects, freelancing, part-time work
            - **Certification**: Industry certifications, professional licenses
            - **Networking**: Professional connections, mentorship, industry events

            **Duration Guidelines:**
            - Education: 6 months - 4 years depending on program
            - Skill Development: 2-8 months for specific skills
            - Practical Experience: 3-12 months for meaningful experience
            - Certification: 1-6 months preparation and completion
            - Networking: Ongoing, 3-6 months to establish connections

            **Description Requirements:**
            - 2-3 sentences explaining what this step involves
            - Why this step is important for the career transition
            - Specific examples of what they should focus on

            Analyze the gap between their current state and target career, then create a pathway that bridges this gap effectively.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: pathwayPlanSchema,
            },
        });

        const jsonText = response.text.trim();
        const pathwayPlan: PathwayPlan = JSON.parse(jsonText);
        return pathwayPlan;
    } catch (error) {
        console.error('Error generating pathway:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate pathway: ${error.message}`);
        }
        throw new Error('Failed to generate pathway plan');
    }
};
