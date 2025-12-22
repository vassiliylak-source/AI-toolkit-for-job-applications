
import React, { useReducer, useEffect } from 'react';
import InputPanel from './components/InputPanel';
import ResumePreview from './components/ResumePreview';
import OutputPanel from './components/OutputPanel';
import HistoryPanel from './components/HistoryPanel';
import StrategyPanel from './components/StrategyPanel';
import QuickEditPanel from './components/QuickEditPanel';
import { TailoredCV, CVFile, CvTemplate, HistoryEntry, GenerationResult, ApplicationStrategy } from './types';
import { generateApplicationStrategy, generateFullApplication, refineContent } from './services/geminiService';
import ThemeSwitcher from './components/ThemeSwitcher';
import { LinkedInIcon } from './components/Icons';

interface AppState {
  cv: string;
  cvFile: CVFile | null;
  jobDescription: string;
  selectedTemplate: CvTemplate;
  generationState: 'idle' | 'loading-strategy' | 'awaiting-strategy-approval' | 'loading-application' | 'success' | 'error';
  error: string | null;
  strategy: ApplicationStrategy | null;
  result: GenerationResult | null;
  history: HistoryEntry[];
  refinementResult: string;
  isRefining: boolean;
  isStrategyRefining: boolean;
}

type AppAction =
  | { type: 'SET_CV'; payload: string }
  | { type: 'SET_CV_FILE'; payload: CVFile | null }
  | { type: 'SET_JOB_DESCRIPTION'; payload: string }
  | { type: 'SET_TEMPLATE'; payload: CvTemplate }
  | { type: 'GENERATE_STRATEGY_START' }
  | { type: 'GENERATE_STRATEGY_SUCCESS'; payload: ApplicationStrategy }
  | { type: 'REFINE_STRATEGY_START' }
  | { type: 'GENERATE_APPLICATION_START' }
  | { type: 'GENERATE_APPLICATION_SUCCESS'; payload: { result: GenerationResult; entry: HistoryEntry } }
  | { type: 'GENERATE_ERROR'; payload: string }
  | { type: 'RESTORE_HISTORY'; payload: HistoryEntry }
  | { type: 'SET_HISTORY'; payload: HistoryEntry[] }
  | { type: 'SET_REFINEMENT'; payload: string }
  | { type: 'SET_REFINING'; payload: boolean }
  | { type: 'RESET_WORKFLOW' }
  | { type: 'CLEAR_HISTORY' };

const initialState: AppState = {
  cv: '',
  cvFile: null,
  jobDescription: '',
  selectedTemplate: 'modern',
  generationState: 'idle',
  error: null,
  strategy: null,
  result: null,
  history: [],
  refinementResult: '',
  isRefining: false,
  isStrategyRefining: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CV': return { ...state, cv: action.payload, cvFile: null };
    case 'SET_CV_FILE': return { ...state, cvFile: action.payload, cv: '' };
    case 'SET_JOB_DESCRIPTION': return { ...state, jobDescription: action.payload };
    case 'SET_TEMPLATE': return { ...state, selectedTemplate: action.payload };
    case 'GENERATE_STRATEGY_START': return { ...state, generationState: 'loading-strategy', error: null, strategy: null };
    case 'REFINE_STRATEGY_START': return { ...state, isStrategyRefining: true, error: null };
    case 'GENERATE_STRATEGY_SUCCESS': return { ...state, generationState: 'awaiting-strategy-approval', strategy: action.payload, isStrategyRefining: false };
    case 'GENERATE_APPLICATION_START': return { ...state, generationState: 'loading-application', error: null };
    case 'GENERATE_APPLICATION_SUCCESS':
      const newHistory = [action.payload.entry, ...state.history];
      localStorage.setItem('cvHistory', JSON.stringify(newHistory));
      return { ...state, generationState: 'success', result: action.payload.result, history: newHistory };
    case 'GENERATE_ERROR': return { ...state, generationState: 'error', error: action.payload, isStrategyRefining: false };
    case 'RESTORE_HISTORY':
      return {
        ...state,
        cv: action.payload.cv,
        cvFile: action.payload.cvFile,
        jobDescription: action.payload.jobDescription,
        selectedTemplate: action.payload.template,
        result: action.payload.result,
        strategy: action.payload.result.strategy,
        generationState: 'success',
      };
    case 'SET_HISTORY': return { ...state, history: action.payload };
    case 'SET_REFINEMENT': return { ...state, refinementResult: action.payload, isRefining: false };
    case 'SET_REFINING': return { ...state, isRefining: action.payload };
    case 'RESET_WORKFLOW': return { ...state, generationState: 'idle', strategy: null, result: null };
    case 'CLEAR_HISTORY':
      localStorage.removeItem('cvHistory');
      return { ...state, history: [] };
    default: return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const isLoading = state.generationState.startsWith('loading');

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('cvHistory');
      if (savedHistory) dispatch({ type: 'SET_HISTORY', payload: JSON.parse(savedHistory) });
    } catch (e) { localStorage.removeItem('cvHistory'); }
  }, []);

  const handleStartStrategy = async () => {
    const cvInput = state.cvFile || state.cv;
    if (!cvInput || !state.jobDescription) {
      dispatch({ type: 'GENERATE_ERROR', payload: 'Please provide both your CV and the job description.' });
      return;
    }
    dispatch({ type: 'GENERATE_STRATEGY_START' });
    try {
      const strategy = await generateApplicationStrategy(cvInput, state.jobDescription);
      dispatch({ type: 'GENERATE_STRATEGY_SUCCESS', payload: strategy });
    } catch (e: any) {
      dispatch({ type: 'GENERATE_ERROR', payload: e.message });
    }
  };

  const handleRefineStrategy = async (feedback: string) => {
    if (!state.strategy) return;
    dispatch({ type: 'REFINE_STRATEGY_START' });
    try {
        const cvInput = state.cvFile || state.cv;
        const refinedStrategy = await generateApplicationStrategy(cvInput!, state.jobDescription, feedback, state.strategy);
        dispatch({ type: 'GENERATE_STRATEGY_SUCCESS', payload: refinedStrategy });
    } catch (e: any) {
        dispatch({ type: 'GENERATE_ERROR', payload: e.message });
    }
  };

  const handleExecuteApplication = async () => {
    if (!state.strategy) return;
    dispatch({ type: 'GENERATE_APPLICATION_START' });
    try {
      const cvInput = state.cvFile || state.cv;
      const result = await generateFullApplication(cvInput!, state.jobDescription, state.strategy, state.selectedTemplate);
      const newEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        cv: state.cv,
        cvFile: state.cvFile,
        jobDescription: state.jobDescription,
        result,
        template: state.selectedTemplate,
      };
      dispatch({ type: 'GENERATE_APPLICATION_SUCCESS', payload: { result, entry: newEntry } });
    } catch (e: any) {
      dispatch({ type: 'GENERATE_ERROR', payload: e.message });
    }
  };

  const handleRefineSnippet = async (text: string, request: string) => {
    dispatch({ type: 'SET_REFINING', payload: true });
    try {
      const result = await refineContent(text, request, { cv: state.result?.tailoredCv, jd: state.jobDescription });
      dispatch({ type: 'SET_REFINEMENT', payload: result });
    } catch (e: any) {
      dispatch({ type: 'SET_REFINING', payload: false });
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-screen-2xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
              🚀 Application Toolkit <span className="text-xs bg-brand-primary text-white px-2 py-0.5 rounded-full font-normal">v3.1 Strategist</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Next-Gen Multi-Stage Career Growth Platform</p>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://www.linkedin.com/in/vassiliy-lakhonin/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary transition-all group"
            >
              <LinkedInIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="hidden md:inline">Connect to Author</span>
            </a>
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      
      <main className="py-8 flex-grow">
        <div className="max-w-screen-2xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Input & Strategy */}
            <div className="lg:col-span-3 flex flex-col gap-8">
              <InputPanel
                cv={state.cv}
                onCvChange={(v) => dispatch({ type: 'SET_CV', payload: v })}
                jobDescription={state.jobDescription}
                onJobDescriptionChange={(v) => dispatch({ type: 'SET_JOB_DESCRIPTION', payload: v })}
                onGenerate={handleStartStrategy}
                isLoading={isLoading}
                error={state.error}
                cvFile={state.cvFile}
                onFileChange={(f) => {
                    if(!f) { dispatch({type: 'SET_CV_FILE', payload: null}); return; }
                    const r = new FileReader();
                    r.onload = () => dispatch({type: 'SET_CV_FILE', payload: {name: f.name, mimeType: f.type, data: (r.result as string).split(',')[1]}});
                    r.readAsDataURL(f);
                }}
                onRemoveFile={() => dispatch({ type: 'SET_CV_FILE', payload: null })}
                selectedTemplate={state.selectedTemplate}
                onTemplateChange={(v) => dispatch({ type: 'SET_TEMPLATE', payload: v })}
              />

              {state.strategy && (
                <StrategyPanel 
                  strategy={state.strategy} 
                  onExecute={handleExecuteApplication} 
                  onRefine={handleRefineStrategy}
                  isExecuting={state.generationState === 'loading-application'}
                  isRefining={state.isStrategyRefining}
                  isCompleted={state.generationState === 'success'}
                />
              )}

              <HistoryPanel
                history={state.history}
                onRestore={(entry) => dispatch({ type: 'RESTORE_HISTORY', payload: entry })}
                onClear={() => dispatch({ type: 'CLEAR_HISTORY' })}
                isLoading={isLoading}
              />
            </div>

            {/* MIDDLE COLUMN: Resume Preview */}
            <div className="lg:col-span-6">
                <ResumePreview 
                  cvData={state.result?.tailoredCv ?? null} 
                  isLoading={state.generationState === 'loading-application'} 
                  template={state.selectedTemplate} 
                />
            </div>

            {/* RIGHT COLUMN: Analysis & Quick Edit */}
            <div className="lg:col-span-3 flex flex-col gap-8">
                <OutputPanel 
                    analysis={state.result?.analysis ?? ''} 
                    atsAnalysis={state.result?.atsAnalysis ?? null}
                    careerRoadmap={state.result?.careerRoadmap}
                    salaryInsight={state.result?.salaryInsight}
                    coverLetters={state.result?.coverLetters ?? null} 
                    interviewPrep={state.result?.interviewPrep ?? null} 
                    isLoading={state.generationState === 'loading-application'}
                    tailoredCv={state.result?.tailoredCv ?? null}
                />
                <QuickEditPanel 
                    onGenerate={handleRefineSnippet}
                    result={state.refinementResult}
                    isLoading={state.isRefining}
                    error={null}
                    isContextReady={!!state.result}
                />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
