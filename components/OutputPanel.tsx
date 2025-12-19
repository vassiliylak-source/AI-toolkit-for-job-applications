
import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { TailoredCV } from '../types';
import { 
    CopyIcon, 
    DownloadIcon, 
    WordIcon, 
    ChartBarIcon, 
    DocumentTextIcon, 
    ChatBubbleLeftRightIcon, 
    QuestionMarkCircleIcon, 
    SendIcon,
    MagicWandSmallIcon 
} from './Icons';
import { getInterviewPrepAsHtml, cvToPlainText } from '../utils/docGenerators';
import { htmlToPlainText } from '../utils/textUtils';

// Attach html2canvas to window for jspdf compatibility
if (typeof window !== 'undefined') {
    (window as any).html2canvas = html2canvas;
}

interface OutputPanelProps {
  analysis: string;
  coverLetters: { versionA: string; versionB: string; versionExtended: string; } | null;
  interviewPrep: { question: string; answer: string; }[] | null;
  isLoading: boolean;
  tailoredCv: TailoredCV | null;
  jdKeySkills?: string[];
}

type Tab = 'analysis' | 'coverLetter' | 'interviewPrep';
type CoverLetterVersion = 'A' | 'B' | 'Extended';

const OutputPanel: React.FC<OutputPanelProps> = ({ analysis, coverLetters, interviewPrep, isLoading, tailoredCv, jdKeySkills }) => {
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
      const header = "<?xml version='1.0' encoding='UTF-8'?><?mso-application progid='Word.Document'?><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Interview Prep</title></head><body>";
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
            {jdKeySkills && jdKeySkills.length > 0 && (
                <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-3 flex items-center">
                        <MagicWandSmallIcon className="w-4 h-4 mr-2" />
                        Key Skills Employer is Looking For
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {jdKeySkills.map((skill, idx) => (
                            <span key={idx} className="bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-1 rounded-md border border-indigo-200 dark:border-indigo-800/50 shadow-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: analysis }} />
            </div>
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Email Results to Yourself</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="flex-grow p-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                    <button 
                        onClick={handleSendEmail}
                        disabled={!email}
                        className="flex items-center justify-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
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
                    {['A', 'B', 'Extended'].map((v) => (
                        <button 
                            key={v}
                            onClick={() => setSelectedVersion(v as CoverLetterVersion)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${selectedVersion === v ? 'bg-white dark:bg-gray-600 text-brand-primary shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50'}`}
                        >
                            {v === 'A' ? 'Direct' : v === 'B' ? 'Personable' : 'Extended'}
                        </button>
                    ))}
                </div>
                <div className="flex items-center space-x-2">
                    {copySuccess && <span className="text-xs text-green-600">{copySuccess}</span>}
                    <button onClick={handleCopy} className="flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-1 px-2 rounded-md text-xs">
                        <CopyIcon className="w-3 h-3 mr-1.5" />
                        Copy
                    </button>
                </div>
            </div>
          <textarea
            value={editableCoverLetter}
            onChange={(e) => setEditableCoverLetter(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary transition-colors duration-200 text-sm resize-y bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 min-h-[400px]"
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
                <button onClick={handleDownloadPrepDoc} className="flex items-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 font-semibold py-2 px-3 rounded-lg text-xs">
                    <WordIcon className="w-4 h-4 mr-2" />
                    Download DOC
                </button>
                <button onClick={handleDownloadPrepPdf} className="flex items-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 font-semibold py-2 px-3 rounded-lg text-xs">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download PDF
                </button>
            </div>
            <div className="space-y-3">
              {interviewPrep.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenQuestionIndex(openQuestionIndex === index ? null : index)}
                    className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700/30 flex justify-between items-center"
                  >
                    <div className="flex items-center">
                        <QuestionMarkCircleIcon className="w-6 h-6 mr-3 text-brand-primary" />
                        <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{item.question}</span>
                    </div>
                  </button>
                  {openQuestionIndex === index && (
                    <div className="p-5 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.answer}</p>
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
        <nav className="-mb-px flex space-x-4">
          {[
            { id: 'analysis', icon: <ChartBarIcon />, label: 'Fit Analysis' },
            { id: 'coverLetter', icon: <DocumentTextIcon />, label: 'Cover Letter' },
            { id: 'interviewPrep', icon: <ChatBubbleLeftRightIcon />, label: 'Interview Prep' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="overflow-auto" style={{maxHeight: 'calc(100vh - 12rem)'}}>
        {renderContent()}
      </div>
    </div>
  );
};

export default OutputPanel;
