
import React from 'react';
import type { ATSAnalysis } from '../types';

interface ATSHeatmapProps {
  analysis: ATSAnalysis;
}

const ATSHeatmap: React.FC<ATSHeatmapProps> = ({ analysis }) => {
  const getScoreColor = (score: number) => {
    if (score > 85) return 'text-green-600 dark:text-green-400';
    if (score > 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase">ATS Match Score</h3>
          <p className={`text-3xl font-black ${getScoreColor(analysis.overallMatchScore)}`}>
            {analysis.overallMatchScore}%
          </p>
        </div>
        <div className="text-right">
          <h3 className="text-sm font-bold text-gray-500 uppercase">Formatting Risk</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            analysis.formattingRisk === 'Low' ? 'bg-green-100 text-green-700' : 
            analysis.formattingRisk === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
          }`}>
            {analysis.formattingRisk} Risk
          </span>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Hard Skills Heatmap</h4>
        <div className="flex flex-wrap gap-2">
          {analysis.foundHardSkills.map((s, i) => (
            <span key={i} className={`text-[10px] px-2 py-1 rounded border font-medium ${
              s.found 
                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' 
                : 'bg-gray-50 text-gray-400 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700 grayscale opacity-60'
            }`}>
              {s.found ? '✓ ' : '○ '}{s.skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Soft Skills Heatmap</h4>
        <div className="flex flex-wrap gap-2">
          {analysis.foundSoftSkills.map((s, i) => (
            <span key={i} className={`text-[10px] px-2 py-1 rounded border font-medium ${
              s.found 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800' 
                : 'bg-gray-50 text-gray-400 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700 grayscale opacity-60'
            }`}>
              {s.found ? '✓ ' : '○ '}{s.skill}
            </span>
          ))}
        </div>
      </div>

      {analysis.missingKeywords.length > 0 && (
        <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-800/30">
          <h4 className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase mb-2">High Priority Missing Terms</h4>
          <p className="text-xs text-orange-600 dark:text-orange-300">{analysis.missingKeywords.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default ATSHeatmap;
