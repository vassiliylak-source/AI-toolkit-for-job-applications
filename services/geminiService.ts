

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
    required: ['tailoredCv', 'analysis', 'coverLetters', 'interviewPrep'],
};

export const generateCvAndCoverLetter = async (
  cv: string | CVFile,
  jobDescription: string,
  template: string
): Promise<GenerationResult> => {

  let contents: any;
  const commonPromptInfo = `
    Act as a world-class executive career coach and resume writer with over 20 years of experience helping professionals land their dream jobs. Your task is to take a candidate's CV and a target job description and create a powerful, tailored application package. Even if the original CV is not a strong match, your goal is to strategically reposition the candidate to make them appear as the ideal fit.

    Based on the provided CV, the job description, and the selected CV template style ('${template}'), you will perform FOUR tasks:

    1.  **Tailor the CV (JSON Output):**
        *   **Keyword Optimization:** Scrutinize the job description for key skills, technologies, and qualifications. Integrate these keywords naturally throughout the tailored CV, especially in the summary, experience, and skills sections, to ensure it passes through Applicant Tracking Systems (ATS).
        *   **Reframe Experience & Augment Responsibilities:** Your primary goal is to align the candidate's experience with the job description.
            *   Do not just copy-paste responsibilities from the old CV. Rephrase them into impactful, achievement-oriented bullet points using strong action verbs.
            *   **Crucially, if the original CV lacks specific experiences mentioned in the job description, you must create new, relevant bullet points.** Analyze the job description's tasks and responsibilities. Then, based on the candidate's overall profile and job titles, formulate plausible achievements and responsibilities that directly correspond to the job description's requirements. This involves more than just reframing; it requires strategic creation of content to fill gaps. For instance, if the job requires "data analysis using Python" and the CV only mentions "reporting", you could create a bullet point like: "Leveraged Python scripts to automate data collection and analysis, leading to a 15% reduction in manual reporting time."
            *   Where the original CV is weak, identify transferable skills and reframe past experiences to align directly with the requirements of the new role. For example, if the job requires 'project management' and the CV mentions 'organizing events', rephrase it to highlight planning, budgeting, and stakeholder coordination.
        *   **Strategic Summary:** Write a powerful, concise professional summary (2-3 sentences) that immediately grabs the recruiter's attention and positions the candidate as the perfect solution to the company's needs as outlined in the job description.
        *   **Curate Content:** De-emphasize or remove roles and responsibilities from the original CV that are irrelevant to the target job to create a focused and compelling narrative.
        *   **Preserve Core Facts:** While curating content, you MUST retain all specific educational institutions, degrees, diplomas, and certifications mentioned in the original CV. For example, if the CV mentions "Bard College (US, NY) Diploma", this exact information must be present in the education section of the tailored CV. Do not omit or over-summarize these critical qualifications.
        *   **Identify and Preserve Additional Sections:** Actively look for sections like 'Certifications', 'Awards', 'Publications', 'Courses', or 'Professional Development' in the original CV. If present, include them in the tailored CV JSON output. These are often critical differentiators for the candidate and should be preserved.
        *   **Template Adherence:** The tone and content should subtly reflect the chosen template style (e.g., a more narrative summary for a 'creative' style, very formal for 'classic').

    2.  **Write an Interactive Fit Analysis (HTML Output):**
        *   **Objective & Professional Assessment:** Your primary goal here is to provide an honest, unbiased, and professional assessment of the candidate's fit for the role. The "Overall Fit Score" must be a realistic reflection of the alignment between the CV and the job description. **Do not inflate the percentage.**
        *   **Constructive Feedback:** Even if the fit is poor and the score is low, your analysis must be constructive and empowering. The tone should always be that of an expert, encouraging career coach who provides clear, actionable advice.
        *   **Use Emojis:** Use emojis appropriately to make the content visually appealing and to emphasize key points (e.g., ✅ for strengths, 💡 for suggestions, 🚀 for summaries).
        *   **Format with HTML:** The entire output for the analysis must be a single, valid HTML string. Use <h2> for main headings, <strong> for important keywords, and <ul>/<li> for bulleted lists. **Do not add any inline style attributes for color or background-color.** The application will handle styling.
        *   **Structure:** Follow this structure for a clear and interesting report:
            1.  <h2>⭐ Overall Fit Score: [Provide a realistic percentage]</h2> - Start with the calculated, unbiased score.
            2.  <h2>✅ Key Strengths & Alignment</h2> - Objectively list the strongest alignments between the CV and job description.
            3.  <h2>🎯 Areas to Emphasize in an Interview</h2> - Point out existing skills or experiences that are a good match and should be highlighted verbally.
            4.  <h2>💡 Strategic Framing & Development Opportunities</h2> - This section is critical. Identify any gaps and provide expert advice. If the match is strong, focus on framing transferable skills. **If the match is weak, provide concrete strategies for improvement.** This could include suggesting specific online courses, certifications, types of projects to gain experience, or ways to rephrase existing experience to better align with the industry.
            5.  <h2>🚀 Final Verdict & Strategic Next Steps</h2> - Give a concluding summary. If the score is high, provide advice on acing the interview. **If the score is low, provide an encouraging verdict with a clear, strategic roadmap for the candidate to become a stronger applicant for this type of role in the future.**

    3.  **Generate Three "Winning" Cover Letter Versions:**
        *   Your goal is to write three exceptionally persuasive and professional cover letters that make the recruiter feel they have found the perfect candidate.
        *   **Storytelling, Not Repeating:** Do not just summarize the CV. Weave a compelling narrative. Connect the candidate's key achievements to the employer's specific needs, mission, or recent projects mentioned in the job description.
        *   **Incorporate Key Themes:** You MUST subtly incorporate the key themes from the "🎯 Areas to Emphasize in Your Interview" section of your analysis into the cover letters. This creates a cohesive and strategic message.
        *   **Use Concrete Evidence:** Scour the candidate's CV for 1-2 powerful, concrete examples or quantifiable achievements (e.g., "Increased sales by 15%" or "Led a team of 5 to launch a new feature"). Integrate these examples directly into the body paragraphs of the cover letter to provide tangible proof of their skills and impact. For instance, instead of saying "I have strong project management skills," say "In my previous role at XYZ Corp, I successfully managed a project with a $50k budget, delivering it two weeks ahead of schedule, which demonstrates my ability to handle your project needs."
        *   **Professional Tone:** Maintain a confident, professional, and enthusiastic tone throughout. Address it to a specific person if possible, otherwise use a professional salutation like "Dear Hiring Manager".
        *   **Create Three Distinct Versions:**
            *   **versionA:** This version should be direct, confident, and achievement-focused.
            *   **versionB:** This version should adopt a more personable, storytelling approach, perhaps connecting with the company's culture or mission.
            *   **versionExtended:** This version must be a more comprehensive, extended narrative. Go into greater detail about 2-3 key experiences from the CV. Provide more context for achievements, explain the 'how' behind the results, and connect specific skills to project outcomes in-depth. This version should be noticeably longer and more detailed than the other two.

    4.  **Generate Interview Preparation Questions & Answers:**
        *   Act as an expert interview coach. Based on the CV and job description, generate 5-7 of the most likely and challenging interview questions the candidate will face.
        *   The questions should be a mix of behavioral ("Tell me about a time when you..."), situational ("What would you do if..."), and role-specific technical/experience questions.
        *   **For EACH question, provide a detailed, well-structured "must-to-answer" sample answer.**
        *   **Crucially, you MUST use the STAR method (Situation, Task, Action, Result) to structure the answers for behavioral questions.** Base the answers on the candidate's actual experience detailed in their CV.
        *   The tone should be that of a coach providing a strong model answer that the candidate can study and adapt to their own voice. Make the answers insightful and strategic.

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
    model: "gemini-2.5-pro", // Using pro for complex task and structured output
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.2,
    },
  });

  const jsonText = response.text.trim();
  const result = JSON.parse(jsonText);

  if (result.tailoredCv && result.analysis && result.coverLetters && result.interviewPrep) {
    return result as GenerationResult;
  } else {
    throw new Error("Invalid response structure from API.");
  }
};