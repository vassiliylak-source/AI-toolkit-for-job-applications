// Fix: Added type definitions for the application.

export type CvTemplate = 'modern' | 'classic' | 'creative' | 'minimalist' | 'corporate' | 'elegant' | 'tech' | 'infographic' | 'bold';

export interface CVFile {
  name: string;
  mimeType: string;
  data: string; // base64 encoded string (without the data URL prefix)
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
  certifications?: {
    name: string;
    issuer?: string;
    date?: string;
  }[];
  awards?: {
    name: string;
    issuer?: string;
    date?: string;
  }[];
  publications?: {
    title: string;
    journal?: string;
    date?: string;
  }[];
  professionalDevelopment?: {
    name: string;
    institution?: string;
    date?: string;
  }[];
}

export interface GenerationResult {
    tailoredCv: TailoredCV;
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