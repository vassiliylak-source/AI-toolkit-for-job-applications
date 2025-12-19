
import React from 'react';
import type { ApplicationStrategy } from '../types';
import { MagicWandIcon, ChartBarIcon } from './Icons';

interface StrategyPanelProps {
  strategy: ApplicationStrategy;
  onExecute: () => void;
  isExecuting: boolean;
  isCompleted: boolean;
}

const StrategyPanel: React.FC<StrategyPanelProps> = ({ strategy, onExecute, isExecuting, isCompleted }) => {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800/40 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <ChartBarIcon className="w-5 h-5 text-brand-primary" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Step 2: Review Strategy</h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-1">Proposed Tone</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{strategy.suggestedTone}"</p>
        </div>

        <div>
          <h3 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-1">Key Achievements to Mine</h3>
          <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400 list-disc list-inside">
            {strategy.keyAchievementsToHighlight.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-1">Gap Management</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">{strategy.narrativeAngle}</p>
        </div>
      </div>

      {!isCompleted && (
        <button
          onClick={onExecute}
          disabled={isExecuting}
          className="w-full mt-6 bg-brand-primary hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
        >
          {isExecuting ? (
            <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Building Application...
            </span>
          ) : (
            <>
                <MagicWandIcon className="w-5 h-5 mr-2" />
                Approve & Build CV
            </>
          )}
        </button>
      )}
      
      {isCompleted && (
          <div className="mt-6 text-center text-xs font-bold text-green-600 dark:text-green-400 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            ✓ Application Strategically Built
          </div>
      )}
    </div>
  );
};

export default StrategyPanel;
