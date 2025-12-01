
import React, { useRef, useState } from 'react';
import type { TailoredCV, CvTemplate } from '../types';
import Loader from './Loader';
import { CopyIcon, WordIcon } from './Icons';
import { getUniversalDocHtml } from '../utils/docGenerators';
import * as templates from './resume-templates';

interface ResumePreviewProps {
  cvData: TailoredCV | null;
  isLoading: boolean;
  template: CvTemplate;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ cvData, isLoading, template }) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = () => {
    if (!resumeRef.current) {
        setCopySuccess('Failed to copy.');
        setTimeout(() => setCopySuccess(''), 2000);
        return;
    };
    navigator.clipboard.writeText(resumeRef.current.innerText).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
        setCopySuccess('Failed to copy.');
        setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handleDownloadDoc = () => {
    if (!cvData) return;
    // Fix: Pass the current template to the generator
    const htmlContent = getUniversalDocHtml(cvData, template);
    
    const blob = new Blob([htmlContent], {
        type: 'application/msword'
    });
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${cvData.name.replace(/\s+/g, '_')}_CV.doc`;
    
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }, 100);
  };

  const getTemplate = () => {
    if (!cvData) return null;

    const templateMap: Record<CvTemplate, React.FC<{cvData: TailoredCV}>> = {
        modern: templates.ModernTemplate,
        classic: templates.ClassicTemplate,
        creative: templates.CreativeTemplate,
        minimalist: templates.MinimalistTemplate,
        corporate: templates.CorporateTemplate,
        elegant: templates.ElegantTemplate,
        tech: templates.TechTemplate,
        infographic: templates.InfographicTemplate,
        bold: templates.BoldTemplate,
    };
    const Component = templateMap[template];
    return <Component cvData={cvData} />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 h-full sticky top-24 shadow-sm transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Tailored CV Preview</h2>
            {cvData && (
                 <div className="flex items-center space-x-2">
                    {copySuccess && <span className="text-xs text-green-600 dark:text-green-500">{copySuccess}</span>}
                    <button onClick={handleCopy} className="flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-1 px-2 rounded-md text-xs transition-colors duration-200">
                        <CopyIcon className="w-4 h-4 mr-1.5" />
                        Copy
                    </button>
                    <button onClick={handleDownloadDoc} className="flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-1 px-2 rounded-md text-xs transition-colors duration-200">
                        <WordIcon className="w-4 h-4 mr-1.5" />
                        DOC
                    </button>
                </div>
            )}
        </div>
      <div className="overflow-auto" style={{maxHeight: 'calc(100vh - 12rem)'}}>
        {isLoading && !cvData ? (
          <Loader message="Crafting your tailored CV..." />
        ) : cvData ? (
          <div ref={resumeRef}>
            {getTemplate()}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            <p>Your generated resume will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
