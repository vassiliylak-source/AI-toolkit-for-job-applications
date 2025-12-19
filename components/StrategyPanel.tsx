
import React, { useState } from 'react';
import type { ApplicationStrategy } from '../types';
import { MagicWandIcon, ChartBarIcon, SparklesIcon } from './Icons';

interface StrategyPanelProps {
  strategy: ApplicationStrategy;
  onExecute: () => void;
  onRefine: (feedback: string) => void;
  isExecuting: boolean;
  isRefining: boolean;
  isCompleted: boolean;
}

const StrategyPanel: React.FC<StrategyPanelProps> = ({ strategy, onExecute, onRefine, isExecuting, isRefining, isCompleted }) => {
  const [feedback, setFeedback] = useState('');

  const handleRefineClick = () => {
    if (!feedback.trim()) return;
    onRefine(feedback);
    setFeedback(''); // Clear after sending
  };

  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800/40 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Step 2: Strategy Review</h2>
        </div>
        {isRefining && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-primary"></div>}
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <h3 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-1">Proposed Tone</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{strategy.suggestedTone}"</p>
        </div>

        <div>
          <h3 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-1">Key Focus Achievements</h3>
          <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400 list-disc list-inside">
            {strategy.keyAchievementsToHighlight.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-1">Gap Narrative</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">{strategy.narrativeAngle}</p>
        </div>
      </div>

      {!isCompleted && (
        <div className="space-y-4">
            <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Request Adjustments</label>
                <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="e.g. 'Make the tone more technical' or 'Focus less on my last role'..."
                    className="w-full p-3 text-xs bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900 rounded-xl focus:ring-2 focus:ring-brand-primary transition-all text-gray-800 dark:text-gray-200"
                    rows={3}
                    disabled={isExecuting || isRefining}
                />
            </div>

            <div className="flex flex-col gap-2">
                <button
                    onClick={handleRefineClick}
                    disabled={isExecuting || isRefining || !feedback.trim()}
                    className="w-full bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 text-brand-primary font-bold py-2 px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 text-xs"
                >
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Refine Strategy
                </button>

                <button
                    onClick={onExecute}
                    disabled={isExecuting || isRefining}
                    className="w-full bg-brand-primary hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-lg"
                >
                    {isExecuting ? (
                        <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                        </span>
                    ) : (
                        <>
                            <MagicWandIcon className="w-5 h-5 mr-2" />
                            Approve & Build Application
                        </>
                    )}
                </button>
            </div>
        </div>
      )}
      
      {isCompleted && (
          <div className="mt-6 text-center text-xs font-bold text-green-600 dark:text-green-400 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            ✓ Strategy Fully Executed
          </div>
      )}
    </div>
  );
};

export default StrategyPanel;
