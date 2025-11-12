
// Fix: Implemented the main App component to structure the application.
import React, { useReducer, useEffect } from 'react';
import InputPanel from './components/InputPanel';
import ResumePreview from './components/ResumePreview';
import OutputPanel from './components/OutputPanel';
import HistoryPanel from './components/HistoryPanel';
import { TailoredCV, CVFile, CvTemplate, HistoryEntry, GenerationResult } from './types';
import { generateCvAndCoverLetter } from './services/geminiService';
import ThemeSwitcher from './components/ThemeSwitcher';
import QuickEditPanel from './components/QuickEditPanel';

interface AppState {
  cv: string;
  cvFile: CVFile | null;
  jobDescription: string;
  selectedTemplate: CvTemplate;
  generationState: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  result: GenerationResult | null;
  history: HistoryEntry[];
  quickEditResult: string;
  isQuickEditLoading: boolean;
  quickEditError: string | null;
}

type AppAction =
  | { type: 'SET_CV'; payload: string }
  | { type: 'SET_CV_FILE'; payload: CVFile | null }
  | { type: 'SET_JOB_DESCRIPTION'; payload: string }
  | { type: 'SET_TEMPLATE'; payload: CvTemplate }
  | { type: 'GENERATE_START' }
  | { type: 'GENERATE_SUCCESS'; payload: { result: GenerationResult; entry: HistoryEntry } }
  | { type: 'GENERATE_ERROR'; payload: string }
  | { type: 'RESTORE_HISTORY'; payload: HistoryEntry }
  | { type: 'SET_HISTORY'; payload: HistoryEntry[] }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'QUICK_EDIT_START' }
  | { type: 'QUICK_EDIT_SUCCESS'; payload: string }
  | { type: 'QUICK_EDIT_ERROR'; payload: string };

const initialState: AppState = {
  cv: '',
  cvFile: null,
  jobDescription: '',
  selectedTemplate: 'modern',
  generationState: 'idle',
  error: null,
  result: null,
  history: [],
  quickEditResult: '',
  isQuickEditLoading: false,
  quickEditError: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CV':
      return { ...state, cv: action.payload, cvFile: null };
    case 'SET_CV_FILE':
      return { ...state, cvFile: action.payload, cv: '' };
    case 'SET_JOB_DESCRIPTION':
      return { ...state, jobDescription: action.payload };
    case 'SET_TEMPLATE':
      return { ...state, selectedTemplate: action.payload };
    case 'GENERATE_START':
      return { ...state, generationState: 'loading', error: null, result: null };
    case 'GENERATE_SUCCESS':
      const newHistory = [action.payload.entry, ...state.history];
      localStorage.setItem('cvHistory', JSON.stringify(newHistory));
      return { ...state, generationState: 'success', result: action.payload.result, history: newHistory };
    case 'GENERATE_ERROR':
      return { ...state, generationState: 'error', error: action.payload };
    case 'RESTORE_HISTORY':
      return {
        ...state,
        cv: action.payload.cv,
        cvFile: action.payload.cvFile,
        jobDescription: action.payload.jobDescription,
        selectedTemplate: action.payload.template,
        result: action.payload.result,
        generationState: 'success',
        error: null,
      };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'CLEAR_HISTORY':
      localStorage.removeItem('cvHistory');
      return { ...state, history: [] };
    case 'QUICK_EDIT_START':
      return { ...state, isQuickEditLoading: true, quickEditError: null, quickEditResult: '' };
    case 'QUICK_EDIT_SUCCESS':
      return { ...state, isQuickEditLoading: false, quickEditResult: action.payload };
    case 'QUICK_EDIT_ERROR':
      return { ...state, isQuickEditLoading: false, quickEditError: action.payload };
    default:
      return state;
  }
};


const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const isLoading = state.generationState === 'loading';

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('cvHistory');
      if (savedHistory) {
        dispatch({ type: 'SET_HISTORY', payload: JSON.parse(savedHistory) });
      }
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      localStorage.removeItem('cvHistory');
    }
  }, []);

  const handleCvFileChange = (file: File | null) => {
    if (!file) {
      dispatch({ type: 'SET_CV_FILE', payload: null });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      dispatch({
        type: 'SET_CV_FILE',
        payload: { name: file.name, mimeType: file.type, data: base64Data },
      });
    };
    reader.onerror = () => {
      dispatch({ type: 'GENERATE_ERROR', payload: 'Failed to read the file.' });
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    const cvInput = state.cvFile || state.cv;
    if (!cvInput || !state.jobDescription) {
      dispatch({ type: 'GENERATE_ERROR', payload: 'Please provide both your CV and the job description.' });
      return;
    }
    dispatch({ type: 'GENERATE_START' });

    try {
      const result = await generateCvAndCoverLetter(cvInput, state.jobDescription, state.selectedTemplate);
      const newEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        cv: state.cv,
        cvFile: state.cvFile,
        jobDescription: state.jobDescription,
        result,
        template: state.selectedTemplate,
      };
      dispatch({ type: 'GENERATE_SUCCESS', payload: { result, entry: newEntry } });
    } catch (e) {
      console.error(e);
      let errorMessage = 'An error occurred while generating the content. Please try again.';
      if (e instanceof Error) {
        errorMessage = `An error occurred: ${e.message}. Please check the console for more details.`;
      }
      dispatch({ type: 'GENERATE_ERROR', payload: errorMessage });
    }
  };
  
  const handleQuickEdit = async (text: string, request: string) => {
    // This function would call a new, simpler Gemini service function
    // For now, we'll mock it
    console.log("Quick edit requested for:", text, "with request:", request);
    // You would create a new service function e.g., `improveTextSnippet`
    // that takes the CV, job description, text and request as context.
  };

  const handleRestoreHistory = (entry: HistoryEntry) => {
    if (isLoading) return;
    dispatch({ type: 'RESTORE_HISTORY', payload: entry });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-screen-2xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              🚀 AI toolkit for job applications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Tailor your CV, generate winning cover letters, and ace the interview with AI-powered prep.
            </p>
             <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
              by <a href="https://www.linkedin.com/in/vassiliy-lakhonin/" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Vassiliy Lakhonin</a>
            </p>
          </div>
          <ThemeSwitcher />
        </div>
      </header>
      <main className="py-8 flex-grow">
        <div className="max-w-screen-2xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
            <div className="xl:col-span-1 flex flex-col gap-8">
              <InputPanel
                cv={state.cv}
                onCvChange={(value) => dispatch({ type: 'SET_CV', payload: value })}
                jobDescription={state.jobDescription}
                onJobDescriptionChange={(value) => dispatch({ type: 'SET_JOB_DESCRIPTION', payload: value })}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                error={state.error}
                cvFile={state.cvFile}
                onFileChange={handleCvFileChange}
                onRemoveFile={() => dispatch({ type: 'SET_CV_FILE', payload: null })}
                selectedTemplate={state.selectedTemplate}
                onTemplateChange={(value) => dispatch({ type: 'SET_TEMPLATE', payload: value })}
              />
              <HistoryPanel
                history={state.history}
                onRestore={handleRestoreHistory}
                onClear={() => dispatch({ type: 'CLEAR_HISTORY' })}
                isLoading={isLoading}
              />
            </div>
            <div className="xl:col-span-2">
                <ResumePreview cvData={state.result?.tailoredCv ?? null} isLoading={isLoading} template={state.selectedTemplate} />
            </div>
            <div className="xl:col-span-1 flex flex-col gap-8">
                <OutputPanel 
                    analysis={state.result?.analysis ?? ''} 
                    coverLetters={state.result?.coverLetters ?? null} 
                    interviewPrep={state.result?.interviewPrep ?? null} 
                    isLoading={isLoading}
                    tailoredCv={state.result?.tailoredCv ?? null}
                />
                 <QuickEditPanel
                    onGenerate={handleQuickEdit}
                    result={state.quickEditResult}
                    isLoading={state.isQuickEditLoading}
                    error={state.quickEditError}
                    isContextReady={state.generationState === 'success'}
                 />
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-screen-2xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            <strong>A Note on AI-Generated Content:</strong> While this AI-powered tool is a powerful assistant, it's not infallible. I strongly recommend you review and personalize all generated content. Your unique voice and a final human touch are crucial for making the best impression and securing your dream job. Good luck!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
