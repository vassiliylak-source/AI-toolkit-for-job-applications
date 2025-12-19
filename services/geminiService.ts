// Fix: Implemented Gemini service for CV tailoring and analysis.
import { GoogleGenAI, Type } from "@google/genai";
import type { GenerationResult, CVFile, TailoredCV } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const tailoredCvSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Full name of the candidate." },
        contact: {
            type: Type.OBJECT,
            properties: {
                email: { type: Type.STRING, description: "Email address." },
                phone: { type: Type.STRING, description: "Phone number." },
                linkedin: { type: Type.STRING, description: "LinkedIn profile URL." },
            },
            required: ['email'],
        },
        summary: { type: Type.STRING, description: "A 2-3 sentence professional summary tailored to the job." },
        experience: {
            type: Type.ARRAY,
            description: "Work experience, tailored to highlight relevant skills for the job.",
            items: {
                type: Type.OBJECT,
                properties: {
                    jobTitle: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    dates: { type: Type.STRING, description: "e.g., 'Jan 2020 - Present'" },
                    responsibilities: {
                        type: Type.ARRAY,
                        description: "Bullet points describing responsibilities and achievements, tailored to the job description.",
                        items: { type: Type.STRING }
                    },
                },
                required: ['jobTitle', 'company', 'dates', 'responsibilities'],
            },
        },
        education: {
            type: Type.ARRAY,
            description: "Educational background.",
            items: {
                type: Type.OBJECT,
                properties: {
                    degree: { type: Type.STRING },
                    institution: { type: Type.STRING },
                    location: { type: Type.STRING },
                    dates: { type: Type.STRING, description: "e.g., 'Sep 2016 - May 2020'" },
                },
                required: ['degree', 'institution', 'dates'],
            },
        },
        skills: {
            type: Type.ARRAY,
            description: "List of relevant skills for the job.",
            items: { type: Type.STRING },
        },
        certifications: {
            type: Type.ARRAY,
            description: "List of certifications, if any.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    issuer: { type: Type.STRING },
                    date: { type: Type.STRING },
                },
                required: ['name'],
            },
        },
        awards: {
            type: Type.ARRAY,
            description: "List of awards or honors, if any.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    issuer: { type: Type.STRING },
                    date: { type: Type.STRING },
                },
                required: ['name'],
            },
        },
        publications: {
            type: Type.ARRAY,
            description: "List of publications, if any.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    journal: { type: Type.STRING, description: "The journal, conference, or platform where it was published." },
                    date: { type: Type.STRING },
                },
                required: ['title'],
            },
        },
        professionalDevelopment: {
            type: Type.ARRAY,
            description: "List of relevant courses, trainings, or professional development activities, if any.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the course or training." },
                    institution: { type: Type.STRING, description: "The institution or platform that provided it." },
                    date: { type: Type.STRING },
                },
                required: ['name'],
            },
        },
    },
    required: ['name', 'contact', 'summary', 'experience', 'education', 'skills'],
};


const responseSchema = {
    type: Type.OBJECT,
    properties: {
        tailoredCv: tailoredCvSchema,
        jdKeySkills: {
            type: Type.ARRAY,
            description: "A comprehensive list of the most important technical and soft skills, tools, and qualifications extracted directly from the job description. These represent what the employer is explicitly looking for.",
            items: { type: Type.STRING }
        },
        analysis: { 
            type: Type.STRING, 
            description: "A detailed, engaging analysis of the candidate's fit, formatted as a semantic HTML string. Use emojis and clear headings (<h2>), bold text (<strong>), and lists (<ul><li>) to make it readable. The output must be a single, valid HTML string. **Crucially, do not include any inline CSS or color styling**; the client application will handle all styling for light and dark modes."
        },
        coverLetters: { 
            type: Type.OBJECT,
            description: "Three distinct versions of a professional cover letter.",
            properties: {
                versionA: { type: Type.STRING, description: "A professional cover letter, Version A, with a direct, confident, and achievement-focused tone." },
                versionB: { type: Type.STRING, description: "A professional cover letter, Version B, with a more personable, storytelling tone that connects with company culture." },
                versionExtended: { type: Type.STRING, description: "An extended version of the cover letter that provides more detailed narratives and in-depth explanations of the candidate's skills and experiences, suitable for roles that require comprehensive applications." }
            },
            required: ['versionA', 'versionB', 'versionExtended']
        },
        interviewPrep: {
            type: Type.ARRAY,
            description: "An array of likely interview questions and expert-crafted answers.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "A likely interview question." },
                    answer: { type: Type.STRING, description: "A detailed, structured sample answer using the STAR method where applicable." }
                },
                required: ['question', 'answer']
            }
        }
    },
    required: ['tailoredCv', 'jdKeySkills', 'analysis', 'coverLetters', 'interviewPrep'],
};

export const generateCvAndCoverLetter = async (
  cv: string | CVFile,
  jobDescription: string,
  template: string
): Promise<GenerationResult> => {

  let contents: any;
  const commonPromptInfo = `
    Act as a world-class executive career coach and resume writer with over 20 years of experience helping professionals land their dream jobs. Your task is to take a candidate's CV and a target job description and create a powerful, tailored application package. Even if the original CV is not a strong match, your goal is to strategically reposition the candidate to make them appear as the ideal fit.

    Based on the provided CV, the job description, and the selected CV template style ('${template}'), you will perform FIVE tasks:

    1.  **Extract Key Skills from JD (jdKeySkills):**
        *   Analyze the job description and extract a list of 10-15 most important skills, technologies, certifications, or personal attributes the employer is looking for. This should include both hard skills (e.g., "Python", "Project Management") and soft skills (e.g., "Team Leadership").

    2.  **Tailor the CV (tailoredCv):**
        *   **Keyword Optimization:** Scrutinize the job description for key skills, technologies, and qualifications. Integrate these keywords naturally throughout the tailored CV, especially in the summary, experience, and skills sections.
        *   **Reframe Experience & Augment Responsibilities:** Your primary goal is to align the candidate's experience with the job description.
            *   Do not just copy-paste responsibilities from the old CV. Rephrase them into impactful, achievement-oriented bullet points using strong action verbs.
            *   **Crucially, if the original CV lacks specific experiences mentioned in the job description, you must create new, relevant bullet points.** Analyze the job description's tasks and responsibilities. Then, based on the candidate's overall profile and job titles, formulate plausible achievements and responsibilities that directly correspond to the job description's requirements.
        *   **Strategic Summary:** Write a powerful, concise professional summary (2-3 sentences) that immediately grabs the recruiter's attention.
        *   **Curate Content:** De-emphasize or remove roles and responsibilities from the original CV that are irrelevant.
        *   **Preserve Core Facts:** You MUST retain all specific educational institutions, degrees, diplomas, and certifications mentioned in the original CV.
        *   **Template Adherence:** The tone and content should subtly reflect the chosen template style.

    3.  **Write an Interactive Fit Analysis (analysis):**
        *   **Objective & Professional Assessment:** Your primary goal here is to provide an honest, unbiased, and professional assessment of the candidate's fit for the role. The "Overall Fit Score" must be a realistic reflection of the alignment.
        *   **Constructive Feedback:** Even if the fit is poor, your analysis must be constructive and empowering.
        *   **Use Emojis:** Use emojis appropriately to make the content visually appealing.
        *   **Format with HTML:** The entire output for the analysis must be a single, valid HTML string. Use <h2> for main headings, <strong> for important keywords, and <ul>/<li> for bulleted lists.
        *   **Structure:** Follow this structure:
            1.  <h2>⭐ Overall Fit Score: [Provide a realistic percentage]</h2>
            2.  <h2>✅ Key Strengths & Alignment</h2>
            3.  <h2>🎯 Areas to Emphasize in an Interview</h2>
            4.  <h2>💡 Strategic Framing & Development Opportunities</h2>
            5.  <h2>🚀 Final Verdict & Strategic Next Steps</h2>

    4.  **Generate Three "Winning" Cover Letter Versions (coverLetters):**
        *   Write three exceptionally persuasive and professional cover letters.
        *   **Storytelling, Not Repeating:** Do not just summarize the CV. Weave a compelling narrative.
        *   **Create Three Distinct Versions:**
            *   **versionA:** Direct, confident, and achievement-focused.
            *   **versionB:** Personable, storytelling approach.
            *   **versionExtended:** Comprehensive, extended narrative with greater detail.

    5.  **Generate Interview Preparation Questions & Answers (interviewPrep):**
        *   Generate 5-7 of the most likely and challenging interview questions the candidate will face.
        *   Provide detailed, structured sample answers using the STAR method (Situation, Task, Action, Result) for behavioral questions.

    **Job Description:**
    ---
    ${jobDescription}
    ---

    Please provide the output as a single JSON object that strictly adheres to the provided schema.
  `;

  if (typeof cv === 'string') {
    const prompt = `
      ${commonPromptInfo}
      
      **Original CV:**
      ---
      ${cv}
      ---
      `;
      contents = prompt;
  } else {
    const prompt = `
      ${commonPromptInfo}
      
      The candidate's original CV is in the attached file.
    `;
    contents = {
      parts: [
        { inlineData: { mimeType: cv.mimeType, data: cv.data } },
        { text: prompt }
      ]
    };
  }


  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Upgraded to latest pro for better extraction
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.2,
    },
  });

  const jsonText = response.text.trim();
  const result = JSON.parse(jsonText);

  if (result.tailoredCv && result.analysis && result.coverLetters && result.interviewPrep && result.jdKeySkills) {
    return result as GenerationResult;
  } else {
    throw new Error("Invalid response structure from API.");
  }
};