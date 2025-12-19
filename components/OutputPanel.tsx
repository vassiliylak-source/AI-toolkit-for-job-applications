
import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import type { TailoredCV, ATSAnalysis, CareerRoadmapStep, SalaryInsight } from '../types';
import { 
    CopyIcon, 
    WordIcon, 
    ChartBarIcon, 
    DocumentTextIcon, 
    ChatBubbleLeftRightIcon, 
    SparklesIcon,
    MagicWandSmallIcon
} from './Icons';
import { getInterviewPrepAsHtml } from '../utils/docGenerators';
import ATSHeatmap from './ATSHeatmap';
import InterviewCoach from './InterviewCoach';
import CareerRoadmap from './CareerRoadmap';

interface OutputPanelProps {
  analysis: string;
  atsAnalysis: ATSAnalysis | null;
  careerRoadmap?: CareerRoadmapStep[];
  salaryInsight?: SalaryInsight;
  coverLetters: { versionA: string; versionB: string; versionExtended: string; } | null;
  interviewPrep: { question: string; answer: string; }[] | null;
  isLoading: boolean;
  tailoredCv: TailoredCV | null;
}

type Tab = 'analysis' | 'coverLetter' | 'interviewPrep' | 'coach' | 'roadmap';

const OutputPanel: React.FC<OutputPanelProps> = ({ analysis, atsAnalysis, careerRoadmap, salaryInsight, coverLetters, interviewPrep, isLoading, tailoredCv }) => {
  const [activeTab, setActiveTab] = useState<Tab>('analysis');
  const [selectedVersion, setSelectedVersion] = useState<'A' | 'B' | 'Extended'>('A');
  const [editableCoverLetter, setEditableCoverLetter] = useState('');

  useEffect(() => {
    if (coverLetters) {
        setEditableCoverLetter(coverLetters[`version${selectedVersion}` as keyof typeof coverLetters]);
    }
  }, [coverLetters, selectedVersion]);

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

    switch (activeTab) {
      case 'analysis':
        return (
          <div className="space-y-8">
              {atsAnalysis && <ATSHeatmap analysis={atsAnalysis} />}
              {salaryInsight && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/40">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-black uppercase text-indigo-700 dark:text-indigo-400">Salary Strategy</h3>
                    <span className="text-lg font-black text-indigo-900 dark:text-indigo-100">{salaryInsight.estimatedRange}</span>
                  </div>
                  <div className="space-y-3">
                    {salaryInsight.negotiationPoints.map((p, i) => (
                      <div key={i} className="flex gap-2 text-xs text-indigo-600 dark:text-indigo-300">
                        <span className="font-bold">→</span> {p}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: analysis }} />
              </div>
          </div>
        );
      case 'roadmap':
        return careerRoadmap ? <CareerRoadmap steps={careerRoadmap} /> : <div className="text-center py-10 text-gray-500">No roadmap generated.</div>;
      case 'coach':
        return interviewPrep ? <InterviewCoach questions={interviewPrep} context={analysis} /> : <div className="text-center py-10 text-gray-500">Generate to start coaching.</div>;
      case 'coverLetter':
        return coverLetters ? (
          <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
                  {['A', 'B', 'Extended'].map((v) => (
                      <button key={v} onClick={() => setSelectedVersion(v as any)} className={`flex-1 py-2 text-[10px] font-bold rounded-full transition-all ${selectedVersion === v ? 'bg-white dark:bg-gray-600 text-brand-primary shadow-sm' : 'text-gray-400'}`}>
                          {v === 'A' ? 'Direct' : v === 'B' ? 'Personable' : 'Long Form'}
                      </button>
                  ))}
              </div>
              <textarea value={editableCoverLetter} onChange={(e) => setEditableCoverLetter(e.target.value)} className="w-full h-[400px] p-4 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" />
          </div>
        ) : null;
      case 'interviewPrep':
        return interviewPrep ? (
          <div className="space-y-4">
              <button onClick={handleDownloadPrepDoc} className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2"><WordIcon className="w-4 h-4" /> Download Prep Pack</button>
              {interviewPrep.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <p className="font-bold text-sm text-brand-primary mb-2">Q: {item.question}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">Suggested Answer: {item.answer}</p>
                  </div>
              ))}
          </div>
        ) : null;
      default: return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        {[
          { id: 'analysis', icon: <ChartBarIcon />, label: 'Fit' },
          { id: 'roadmap', icon: <MagicWandSmallIcon />, label: 'Path' },
          { id: 'coach', icon: <SparklesIcon />, label: 'Coach' },
          { id: 'coverLetter', icon: <DocumentTextIcon />, label: 'Letter' },
          { id: 'interviewPrep', icon: <ChatBubbleLeftRightIcon />, label: 'Prep' }
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={`flex items-center gap-2 py-4 px-3 border-b-2 font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-400'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      <div className="max-h-[800px] overflow-auto pr-2">{renderContent()}</div>
    </div>
  );
};

export default OutputPanel;
