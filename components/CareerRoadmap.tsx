
import React from 'react';
import type { CareerRoadmapStep } from '../types';

interface CareerRoadmapProps {
  steps: CareerRoadmapStep[];
}

const CareerRoadmap: React.FC<CareerRoadmapProps> = ({ steps }) => {
  return (
    <div className="relative py-4 pl-8">
      <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
      
      {steps.map((step, idx) => (
        <div key={idx} className="relative mb-8 last:mb-0">
          <div className={`absolute -left-[27px] top-1 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center ${
            step.type === 'skill' ? 'bg-blue-500' : step.type === 'certification' ? 'bg-purple-500' : 'bg-emerald-500'
          }`}>
             <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{step.title}</h4>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{step.timeframe}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
            <div className={`mt-2 text-[9px] font-black uppercase px-2 py-0.5 rounded inline-block ${
               step.type === 'skill' ? 'bg-blue-50 text-blue-600' : step.type === 'certification' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {step.type}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CareerRoadmap;
