
export type CvTemplate = 'modern' | 'classic' | 'creative' | 'minimalist' | 'corporate' | 'elegant' | 'tech' | 'infographic' | 'bold';

export interface CVFile {
  name: string;
  mimeType: string;
  data: string;
}

export interface ApplicationStrategy {
  suggestedTone: string;
  keyAchievementsToHighlight: string[];
  perceivedGaps: string[];
  narrativeAngle: string;
  priorityKeywords: string[];
}

export interface ATSAnalysis {
  overallMatchScore: number;
  foundHardSkills: { skill: string; found: boolean }[];
  foundSoftSkills: { skill: string; found: boolean }[];
  missingKeywords: string[];
  formattingRisk: 'Low' | 'Medium' | 'High';
}

export interface CareerRoadmapStep {
  title: string;
  description: string;
  timeframe: string;
  type: 'skill' | 'certification' | 'project';
}

export interface SalaryInsight {
  estimatedRange: string;
  negotiationPoints: string[];
  scripts: {
    aggressive: string;
    balanced: string;
    flexible: string;
  };
}

export interface TailoredCV {
  name: string;
  contact: {
    email: string;
    phone?: string;
    linkedin?: string;
  };
  summary: string;
  experience: {
    jobTitle: string;
    company: string;
    location: string;
    dates: string;
    responsibilities: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    location: string;
    dates: string;
  }[];
  skills: string[];
  certifications?: { name: string; issuer?: string; date?: string }[];
  awards?: { name: string; issuer?: string; date?: string }[];
  publications?: { title: string; journal?: string; date?: string }[];
  professionalDevelopment?: { name: string; institution?: string; date?: string }[];
}

export interface GenerationResult {
    strategy: ApplicationStrategy;
    tailoredCv: TailoredCV;
    atsAnalysis: ATSAnalysis;
    careerRoadmap: CareerRoadmapStep[];
    salaryInsight: SalaryInsight;
    analysis: string;
    coverLetters: {
        versionA: string;
        versionB: string;
        versionExtended: string;
    };
    interviewPrep: {
        question: string;
        answer: string;
    }[];
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  cv: string;
  cvFile: CVFile | null;
  jobDescription: string;
  result: GenerationResult;
  template: CvTemplate;
}
