
import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import jsPDF from 'jspdf';
import type { TailoredCV } from '../types';
import { 
    CopyIcon, 
    DownloadIcon, 
    WordIcon, 
    ChartBarIcon, 
    DocumentTextIcon, 
    ChatBubbleLeftRightIcon, 
    QuestionMarkCircleIcon, 
    SendIcon 
} from './Icons';
import { getInterviewPrepAsHtml, cvToPlainText } from '../utils/docGenerators';
import { htmlToPlainText } from '../utils/textUtils';


interface OutputPanelProps {
  analysis: string;
  coverLetters: { versionA: string; versionB: string; versionExtended: string; } | null;
  interviewPrep: { question: string; answer: string; }[] | null;
  isLoading: boolean;
  tailoredCv: TailoredCV | null;
}

type Tab = 'analysis' | 'coverLetter' | 'interviewPrep';
type CoverLetterVersion = 'A' | 'B' | 'Extended';

const OutputPanel: React.FC<OutputPanelProps> = ({ analysis, coverLetters, interviewPrep, isLoading, tailoredCv }) => {
  const [activeTab, setActiveTab] = useState<Tab>('analysis');
  const [selectedVersion, setSelectedVersion] = useState<CoverLetterVersion>('A');
  const [editableCoverLetter, setEditableCoverLetter] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (coverLetters) {
        switch (selectedVersion) {
            case 'A':
                setEditableCoverLetter(coverLetters.versionA);
                break;
            case 'B':
                setEditableCoverLetter(coverLetters.versionB);
                break;
            case 'Extended':
                setEditableCoverLetter(coverLetters.versionExtended);
                break;
            default:
                setEditableCoverLetter('');
        }
    } else {
        setEditableCoverLetter('');
    }
  }, [coverLetters, selectedVersion]);

  const handleCopy = () => {
    if (!editableCoverLetter) return;
    navigator.clipboard.writeText(editableCoverLetter).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
        setCopySuccess('Failed to copy.');
        setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handleDownloadPrepDoc = () => {
      if (!interviewPrep) return;
      const htmlContent = getInterviewPrepAsHtml('Interview Preparation', interviewPrep);
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
          "xmlns:w='urn:schemas-microsoft-com:word' "+
          "xmlns='http://www.w3.org/TR/REC-html40'>"+
          "<head><meta charset='utf-8'><title>Interview Prep</title></head><body>";
      const footer = "</body></html>";
      const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(header + htmlContent + footer);
      
      const link = document.createElement("a");
      link.href = source;
      link.download = `Interview_Prep.doc`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleDownloadPrepPdf = () => {
      if (!interviewPrep) return;
      const htmlContent = getInterviewPrepAsHtml('Interview Preparation', interviewPrep);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      pdf.html(htmlContent, {
          callback: function (doc) {
              doc.save('Interview_Prep.pdf');
          },
          x: 15,
          y: 15,
          width: 180, 
          windowWidth: 650 
      });
  };

    const handleSendEmail = () => {
        if (!email || !analysis || !coverLetters || !interviewPrep || !tailoredCv) {
          alert("Please generate all documents and provide an email address.");
          return;
        }

        const subject = "Your Documents from AI Toolkit for Job Applications";
        
        const cvText = cvToPlainText(tailoredCv);
        const analysisText = "FIT ANALYSIS\n====================\n\n" + htmlToPlainText(analysis);
        const coverLetterText = `COVER LETTERS\n====================\n\n--- VERSION A (Direct Tone) ---\n${coverLetters.versionA}\n\n--- VERSION B (Personable Tone) ---\n${coverLetters.versionB}\n\n--- EXTENDED VERSION ---\n${coverLetters.versionExtended}`;
        
        let interviewPrepText = "INTERVIEW PREP\n====================\n";
        interviewPrep.forEach(item => {
          interviewPrepText += `\nQ: ${item.question}\nA: ${item.answer}\n`;
        });

        const body = [
          "Here are your AI-generated job application documents.",
          cvText,
          analysisText,
          coverLetterText,
          interviewPrepText
        ].join('\n\n----------------------------------------\n\n');

        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.location.href = mailtoLink;
    };


  const renderContent = () => {
    if (isLoading) {
      if (activeTab === 'analysis') {
          return <Loader message="Analyzing your fit..." />;
      }
      if (activeTab === 'coverLetter') {
          return <Loader message="Writing your cover letter..." />;
      }
      return <Loader message="Preparing interview questions..." />;
    }

    if (activeTab === 'analysis') {
      return analysis ? (
        <>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: analysis }} />
            </div>
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Email Results to Yourself</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Enter your email to receive the tailored CV, fit analysis, cover letters, and interview prep. This will open your default email client.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="flex-grow p-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                        aria-label="Your email address"
                    />
                    <button 
                        onClick={handleSendEmail}
                        disabled={!email}
                        className="flex items-center justify-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        <SendIcon className="w-4 h-4 mr-2" />
                        Send Email
                    </button>
                </div>
            </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          <p>Your job fit analysis will appear here.</p>
        </div>
      );
    }

    if (activeTab === 'coverLetter') {
      return coverLetters ? (
        <div className="relative">
            <div className="flex justify-between items-center mb-4">
                <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center space-x-1">
                    <button 
                        onClick={() => setSelectedVersion('A')}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${selectedVersion === 'A' ? 'bg-white dark:bg-gray-600 text-brand-primary shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50'}`}
                    >
                        Direct Tone
                    </button>
                    <button 
                        onClick={() => setSelectedVersion('B')}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${selectedVersion === 'B' ? 'bg-white dark:bg-gray-600 text-brand-primary shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50'}`}
                    >
                        Personable Tone
                    </button>
                    <button 
                        onClick={() => setSelectedVersion('Extended')}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${selectedVersion === 'Extended' ? 'bg-white dark:bg-gray-600 text-brand-primary shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50'}`}
                    >
                        Extended Version
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    {copySuccess && <span className="text-xs text-green-600 transition-opacity duration-300">{copySuccess}</span>}
                    <button
                        onClick={handleCopy}
                        className="flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-1 px-2 rounded-md text-xs transition-colors duration-200"
                        aria-label="Copy cover letter text"
                    >
                        <CopyIcon className="w-3 h-3 mr-1.5" />
                        Copy
                    </button>
                </div>
            </div>
          <textarea
            value={editableCoverLetter}
            onChange={(e) => setEditableCoverLetter(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 text-sm resize-y bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            style={{ minHeight: 'calc(100vh - 20rem)' }}
            aria-label="Editable Cover Letter"
          />
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          <p>Your generated cover letter will appear here.</p>
        </div>
      );
    }

    if (activeTab === 'interviewPrep') {
      return interviewPrep && interviewPrep.length > 0 ? (
        <div>
            <div className="flex items-center space-x-2 mb-4">
                <button onClick={handleDownloadPrepDoc} className="flex items-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-3 rounded-lg text-xs transition-colors duration-200">
                    <WordIcon className="w-4 h-4 mr-2" />
                    Download DOC
                </button>
                <button onClick={handleDownloadPrepPdf} className="flex items-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-3 rounded-lg text-xs transition-colors duration-200">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download PDF
                </button>
            </div>
            <div className="space-y-3">
              {interviewPrep.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                  <button
                    onClick={() => setOpenQuestionIndex(openQuestionIndex === index ? null : index)}
                    className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/60 flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    aria-expanded={openQuestionIndex === index}
                  >
                    <div className="flex items-center">
                        <QuestionMarkCircleIcon className="w-6 h-6 mr-3 text-brand-primary flex-shrink-0" />
                        <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{item.question}</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transform transition-transform duration-300 text-gray-500 dark:text-gray-400 ${openQuestionIndex === index ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {openQuestionIndex === index && (
                    <div className="p-5 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      <div className="prose prose-sm max-w-none dark:prose-invert prose-p:whitespace-pre-wrap prose-p:leading-relaxed">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          <p>Your interview preparation questions will appear here.</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 h-full sticky top-24 shadow-sm transition-colors duration-300">
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'analysis'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:border-gray-500 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <ChartBarIcon />
            Fit Analysis
          </button>
          <button
            onClick={() => setActiveTab('coverLetter')}
            className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'coverLetter'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:border-gray-500 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <DocumentTextIcon />
            Cover Letter
          </button>
          <button
            onClick={() => setActiveTab('interviewPrep')}
            className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'interviewPrep'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:border-gray-500 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <ChatBubbleLeftRightIcon />
            Interview Prep
          </button>
        </nav>
      </div>
      <div className="overflow-auto" style={{maxHeight: 'calc(100vh - 12rem)'}}>
        {renderContent()}
      </div>
    </div>
  );
};

export default OutputPanel;
