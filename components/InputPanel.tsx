
// Fix: Implemented the InputPanel component for user interaction.
import React, { useRef } from 'react';
import type { CVFile, CvTemplate } from '../types';
import { UploadIcon, MagicWandIcon, FileIcon, XIcon } from './Icons';
import TemplateCard from './TemplateCard';

interface InputPanelProps {
  cv: string;
  onCvChange: (value: string) => void;
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
  cvFile: CVFile | null;
  onFileChange: (file: File | null) => void;
  onRemoveFile: () => void;
  selectedTemplate: CvTemplate;
  onTemplateChange: (template: CvTemplate) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  cv,
  onCvChange,
  jobDescription,
  onJobDescriptionChange,
  onGenerate,
  isLoading,
  error,
  cvFile,
  onFileChange,
  onRemoveFile,
  selectedTemplate,
  onTemplateChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEnabled = !isLoading && (!!cv || !!cvFile) && !!jobDescription;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
    // Reset file input to allow re-uploading the same file
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col gap-6 h-full shadow-sm transition-colors duration-300">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">1. Your CV / Resume</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Upload a PDF file or paste the text of your existing CV below.
        </p>
        
        <div className="mb-4">
          {cvFile ? (
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-lg border border-gray-300 dark:border-gray-600">
              <div className="flex items-center space-x-2 overflow-hidden">
                <FileIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={cvFile.name}>{cvFile.name}</span>
              </div>
              <button onClick={onRemoveFile} disabled={isLoading} className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm transition-colors duration-200 disabled:opacity-50"
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload CV File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,application/pdf"
              />
            </div>
          )}
        </div>
        
        <textarea
          value={cv}
          onChange={(e) => onCvChange(e.target.value)}
          placeholder="Or paste your CV here..."
          className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
          disabled={isLoading || !!cvFile}
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">2. Job Description</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Paste the job description for the role you're applying for.
        </p>
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">3. Select a Template</h2>
        <div className="grid grid-cols-3 gap-3">
            <TemplateCard name="Modern" id="modern" selected={selectedTemplate === 'modern'} onClick={() => onTemplateChange('modern')} disabled={isLoading} />
            <TemplateCard name="Classic" id="classic" selected={selectedTemplate === 'classic'} onClick={() => onTemplateChange('classic')} disabled={isLoading} />
            <TemplateCard name="Creative" id="creative" selected={selectedTemplate === 'creative'} onClick={() => onTemplateChange('creative')} disabled={isLoading} />
            <TemplateCard name="Minimalist" id="minimalist" selected={selectedTemplate === 'minimalist'} onClick={() => onTemplateChange('minimalist')} disabled={isLoading} />
            <TemplateCard name="Corporate" id="corporate" selected={selectedTemplate === 'corporate'} onClick={() => onTemplateChange('corporate')} disabled={isLoading} />
            <TemplateCard name="Elegant" id="elegant" selected={selectedTemplate === 'elegant'} onClick={() => onTemplateChange('elegant')} disabled={isLoading} />
            <TemplateCard name="Tech" id="tech" selected={selectedTemplate === 'tech'} onClick={() => onTemplateChange('tech')} disabled={isLoading} />
            <TemplateCard name="Infographic" id="infographic" selected={selectedTemplate === 'infographic'} onClick={() => onTemplateChange('infographic')} disabled={isLoading} />
            <TemplateCard name="Bold" id="bold" selected={selectedTemplate === 'bold'} onClick={() => onTemplateChange('bold')} disabled={isLoading} />
        </div>
      </div>
      
      {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}

      <button
        onClick={onGenerate}
        disabled={!isEnabled}
        className={`
          w-full text-white font-bold py-4 px-4 rounded-xl
          flex items-center justify-center text-xl
          bg-gradient-to-r from-brand-secondary to-brand-primary
          hover:from-purple-600 hover:to-indigo-600
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary
          disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-600 dark:disabled:to-gray-700
          disabled:cursor-not-allowed disabled:shadow-none
          shadow-lg hover:shadow-xl
          transform hover:scale-105 transition-all duration-300 ease-in-out
          mt-auto
          ${isEnabled ? 'animate-pulse' : ''}
        `}
      >
        <MagicWandIcon className="w-7 h-7 mr-3" />
        {isLoading ? 'Generating...' : 'Generate Tailored CV'}
      </button>
    </div>
  );
};

export default InputPanel;
