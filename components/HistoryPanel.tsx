import React from 'react';
import type { HistoryEntry } from '../types';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onClear: () => void;
  isLoading: boolean;
}

const RestoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 3v5h5" />
    <path d="M21 19v-5h-5" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L20.5 8" />
    <path d="M20.49 15a9 9 0 0 1-14.85 3.36L3.5 16" />
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onRestore, onClear, isLoading }) => {
  const getJobTitleSnippet = (jobDescription: string) => {
    const firstLine = jobDescription.split('\n')[0].trim();
    return firstLine.length > 50 ? `${firstLine.substring(0, 50)}...` : firstLine;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Generation History</h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            disabled={isLoading}
            className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 disabled:opacity-50 transition-colors duration-200"
            aria-label="Clear all history"
          >
            <TrashIcon className="w-4 h-4 mr-1" />
            Clear History
          </button>
        )}
      </div>
      <div className="space-y-3 overflow-y-auto max-h-60 pr-2">
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No history yet. Your generated CVs will appear here.</p>
        ) : (
          history.map((entry) => (
            <div key={entry.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <div className="flex-grow overflow-hidden">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={entry.jobDescription}>
                  {getJobTitleSnippet(entry.jobDescription) || 'Untitled Generation'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(entry.timestamp).toLocaleString()}</p>
              </div>
              <button
                onClick={() => onRestore(entry)}
                disabled={isLoading}
                className="flex-shrink-0 ml-4 flex items-center bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-1 px-2 border border-gray-300 dark:border-gray-500 rounded-md text-xs transition-colors duration-200 disabled:opacity-50"
                aria-label={`Restore generation from ${new Date(entry.timestamp).toLocaleString()}`}
              >
                <RestoreIcon className="w-3 h-3 mr-1.5" />
                Restore
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;