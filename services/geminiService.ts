
import { GoogleGenAI, Type } from "@google/genai";
import type { GenerationResult, CVFile, TailoredCV, ApplicationStrategy, ATSAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schemas
const strategySchema = {
    type: Type.OBJECT,
    properties: {
        suggestedTone: { type: Type.STRING },
        keyAchievementsToHighlight: { type: Type.ARRAY, items: { type: Type.STRING } },
        perceivedGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
        narrativeAngle: { type: Type.STRING },
        priorityKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['suggestedTone', 'keyAchievementsToHighlight', 'perceivedGaps', 'narrativeAngle', 'priorityKeywords']
};

// --- STAGE 1: Generate/Refine Application Strategy ---
export const generateApplicationStrategy = async (
    cv: string | CVFile, 
    jobDescription: string, 
    feedback?: string, 
    previousStrategy?: ApplicationStrategy
): Promise<ApplicationStrategy> => {
    let parts: any[] = [];
    if (typeof cv === 'string') {
        parts.push({ text: `Original CV: ${cv}` });
    } else {
        parts.push({ inlineData: { mimeType: cv.mimeType, data: cv.data } });
    }
    parts.push({ text: `Target Job Description: ${jobDescription}` });
    
    if (previousStrategy && feedback) {
        parts.push({ text: `Previous Strategy Proposed: ${JSON.stringify(previousStrategy)}` });
        parts.push({ text: `USER FEEDBACK ON STRATEGY: "${feedback}"` });
        parts.push({ text: `Act as an expert recruiter. Refine the previous strategy based on the user's feedback. Ensure you still align with the job description but pivot the focus or tone as requested.` });
    } else {
        parts.push({ text: `Act as an expert recruiter. Analyze the CV and JD. Provide a high-level application strategy. Identify tone, key achievements to focus on, perceived gaps in the candidate's profile, and a narrative angle to overcome those gaps.` });
    }

    const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: { parts },
        config: { responseMimeType: "application/json", responseSchema: strategySchema }
    });

    return JSON.parse(response.text);
};

// ... (Rest of the file remains unchanged from previous version)

const roadmapSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            timeframe: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['skill', 'certification', 'project'] }
        },
        required: ['title', 'description', 'timeframe', 'type']
    }
};

const salarySchema = {
    type: Type.OBJECT,
    properties: {
        estimatedRange: { type: Type.STRING },
        negotiationPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        scripts: {
            type: Type.OBJECT,
            properties: {
                aggressive: { type: Type.STRING },
                balanced: { type: Type.STRING },
                flexible: { type: Type.STRING }
            },
            required: ['aggressive', 'balanced', 'flexible']
        }
    },
    required: ['estimatedRange', 'negotiationPoints', 'scripts']
};

const atsAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        overallMatchScore: { type: Type.NUMBER },
        foundHardSkills: { 
            type: Type.ARRAY, 
            items: { 
                type: Type.OBJECT, 
                properties: { skill: { type: Type.STRING }, found: { type: Type.BOOLEAN } },
                required: ['skill', 'found']
            }
        },
        foundSoftSkills: { 
            type: Type.ARRAY, 
            items: { 
                type: Type.OBJECT, 
                properties: { skill: { type: Type.STRING }, found: { type: Type.BOOLEAN } },
                required: ['skill', 'found']
            }
        },
        missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        formattingRisk: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
    },
    required: ['overallMatchScore', 'foundHardSkills', 'foundSoftSkills', 'missingKeywords', 'formattingRisk']
};

const tailoredCvSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        contact: {
            type: Type.OBJECT,
            properties: { email: { type: Type.STRING }, phone: { type: Type.STRING }, linkedin: { type: Type.STRING } },
            required: ['email']
        },
        summary: { type: Type.STRING },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    jobTitle: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    dates: { type: Type.STRING },
                    responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['jobTitle', 'company', 'dates', 'responsibilities']
            }
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: { degree: { type: Type.STRING }, institution: { type: Type.STRING }, location: { type: Type.STRING }, dates: { type: Type.STRING } },
                required: ['degree', 'institution', 'dates']
            }
        },
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        certifications: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, issuer: { type: Type.STRING }, date: { type: Type.STRING } }, required: ['name'] } },
        awards: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, issuer: { type: Type.STRING }, date: { type: Type.STRING } }, required: ['name'] } },
        publications: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, journal: { type: Type.STRING }, date: { type: Type.STRING } }, required: ['title'] } },
        professionalDevelopment: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, institution: { type: Type.STRING }, date: { type: Type.STRING } }, required: ['name'] } }
    },
    required: ['name', 'contact', 'summary', 'experience', 'education', 'skills']
};

export const generateFullApplication = async (cv: string | CVFile, jobDescription: string, strategy: ApplicationStrategy, template: string): Promise<GenerationResult> => {
    let parts: any[] = [];
    if (typeof cv === 'string') {
        parts.push({ text: `Original CV: ${cv}` });
    } else {
        parts.push({ inlineData: { mimeType: cv.mimeType, data: cv.data } });
    }
    
    parts.push({ text: `Job Description: ${jobDescription}` });
    parts.push({ text: `Approved Strategy: ${JSON.stringify(strategy)}` });
    parts.push({ text: `Using the approved strategy, create the tailored CV, perform an ATS keyword analysis, write a detailed fit analysis (HTML), write 3 cover letters, and provide 5-7 interview prep Q&As. 
    ALSO, generate a 6-step Career Roadmap to fill perceived gaps, and provide Salary Insights including negotiation scripts. Ensure the tone matches the strategy.` });

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            tailoredCv: tailoredCvSchema,
            atsAnalysis: atsAnalysisSchema,
            careerRoadmap: roadmapSchema,
            salaryInsight: salarySchema,
            analysis: { type: Type.STRING },
            coverLetters: { 
                type: Type.OBJECT, 
                properties: { versionA: { type: Type.STRING }, versionB: { type: Type.STRING }, versionExtended: { type: Type.STRING } },
                required: ['versionA', 'versionB', 'versionExtended']
            },
            interviewPrep: { 
                type: Type.ARRAY, 
                items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } }, required: ['question', 'answer'] }
            }
        },
        required: ['tailoredCv', 'atsAnalysis', 'careerRoadmap', 'salaryInsight', 'analysis', 'coverLetters', 'interviewPrep']
    };

    const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: { parts },
        config: { responseMimeType: "application/json", responseSchema: responseSchema, temperature: 0.3 }
    });

    const result = JSON.parse(response.text);
    return { ...result, strategy };
};

export const refineContent = async (originalContent: string, request: string, context?: { cv: any, jd: string }): Promise<string> => {
    const prompt = `
        Context Job Description: ${context?.jd || 'Not provided'}
        Refinement Request: ${request}
        Original Content to Refine: "${originalContent}"
        
        Act as a professional resume editor. Provide ONLY the improved text. Keep it concise, punchy, and achievement-oriented.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite-latest",
        contents: prompt,
        config: { temperature: 0.7 }
    });

    return response.text.trim();
};
