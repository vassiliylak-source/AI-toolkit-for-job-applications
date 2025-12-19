
import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { TailoredCV, ATSAnalysis } from '../types';
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
import ATSHeatmap from './ATSHeatmap';

if (typeof window !== 'undefined') { (window as any).html2canvas = html2canvas; }

interface OutputPanelProps {
  analysis: string;
  atsAnalysis: ATSAnalysis | null;
  coverLetters: { versionA: string; versionB: string; versionExtended: string; } | null;
  interviewPrep: { question: string; answer: string; }[] | null;
  isLoading: boolean;
  tailoredCv: TailoredCV | null;
}

type Tab = 'analysis' | 'coverLetter' | 'interviewPrep';
type CoverLetterVersion = 'A' | 'B' | 'Extended';

const OutputPanel: React.FC<OutputPanelProps> = ({ analysis, atsAnalysis, coverLetters, interviewPrep, isLoading, tailoredCv }) => {
  const [activeTab, setActiveTab] = useState<Tab>('analysis');
  const [selectedVersion, setSelectedVersion] = useState<CoverLetterVersion>('A');
  const [editableCoverLetter, setEditableCoverLetter] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (coverLetters) {
        switch (selectedVersion) {
            case 'A': setEditableCoverLetter(coverLetters.versionA); break;
            case 'B': setEditableCoverLetter(coverLetters.versionB); break;
            case 'Extended': setEditableCoverLetter(coverLetters.versionExtended); break;
        }
    }
  }, [coverLetters, selectedVersion]);

  const handleCopy = () => {
    if (!editableCoverLetter) return;
    navigator.clipboard.writeText(editableCoverLetter).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handleDownloadPrepDoc = () => {
      if (!interviewPrep) return;
      const htmlContent = getInterviewPrepAsHtml('Interview Preparation', interviewPrep);
      const blob = new Blob(['\ufeff', htmlContent], { type: 'application/vnd.ms-word' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Interview_Prep.doc`;
      link.click();
      URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (isLoading) return <Loader message="Generating Strategic Content..." />;

    if (activeTab === 'analysis') {
      return analysis ? (
        <div className="space-y-8">
            {atsAnalysis && <ATSHeatmap analysis={atsAnalysis} />}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: analysis }} />
            </div>
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Email Results</h3>
                <div className="flex gap-2">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="flex-grow p-2 text-sm border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                    <button onClick={() => {}} disabled={!email} className="px-3 py-2 bg-brand-primary text-white font-semibold rounded-lg text-sm"><SendIcon className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10"><p>Your strategic analysis will appear here.</p></div>
      );
    }

    if (activeTab === 'coverLetter') {
      return coverLetters ? (
        <div className="relative">
            <div className="flex justify-between items-center mb-4">
                <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-full flex gap-1">
                    {['A', 'B', 'Extended'].map((v) => (
                        <button key={v} onClick={() => setSelectedVersion(v as CoverLetterVersion)} className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${selectedVersion === v ? 'bg-white dark:bg-gray-600 text-brand-primary shadow-sm' : 'text-gray-500'}`}>
                            {v === 'A' ? 'Direct' : v === 'B' ? 'Personable' : 'Long'}
                        </button>
                    ))}
                </div>
                <button onClick={handleCopy} className="p-2 text-gray-500 hover:text-brand-primary"><CopyIcon className="w-4 h-4" /></button>
            </div>
          <textarea value={editableCoverLetter} onChange={(e) => setEditableCoverLetter(e.target.value)} className="w-full h-[500px] p-4 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-primary transition-all text-gray-800 dark:text-gray-200" />
        </div>
      ) : <div className="text-center text-gray-500 py-10">Generate to see cover letters.</div>;
    }

    if (activeTab === 'interviewPrep') {
      return interviewPrep ? (
        <div className="space-y-4">
            <button onClick={handleDownloadPrepDoc} className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 tracking-wide"><WordIcon className="w-4 h-4" /> Export Interview Prep</button>
            {interviewPrep.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                  <button onClick={() => setOpenQuestionIndex(openQuestionIndex === index ? null : index)} className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700/30 font-semibold text-sm flex justify-between">
                    <span>{item.question}</span>
                    <span className="text-gray-400">{openQuestionIndex === index ? '−' : '+'}</span>
                  </button>
                  {openQuestionIndex === index && (
                    <div className="p-4 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 italic">
                      {item.answer}
                    </div>
                  )}
                </div>
            ))}
        </div>
      ) : <div className="text-center text-gray-500 py-10">Prepare questions after generation.</div>;
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <nav className="flex border-b border-gray-200 dark:border-gray-700 mb-6 gap-6">
        {[
          { id: 'analysis', icon: <ChartBarIcon />, label: 'Fit' },
          { id: 'coverLetter', icon: <DocumentTextIcon />, label: 'Letter' },
          { id: 'interviewPrep', icon: <ChatBubbleLeftRightIcon />, label: 'Prep' }
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-bold text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-400'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>
      <div className="max-h-[800px] overflow-auto pr-2">{renderContent()}</div>
    </div>
  );
};

export default OutputPanel;
