
import React from 'react';
import type { CvTemplate } from '../types';

interface TemplateCardProps {
  name: string;
  id: CvTemplate;
  selected: boolean;
  onClick: () => void;
  disabled: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ name, id, selected, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full border-2 rounded-lg p-3 text-center transition-all duration-200 disabled:opacity-50 ${
        selected ? 'border-brand-primary bg-indigo-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-brand-secondary dark:hover:border-brand-secondary'
      }`}
    >
      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{name}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">{id}</div>
       {/* Simple visual representation */}
      <div className="mt-2 h-10 w-full flex flex-col space-y-1 p-1">
        {id === 'modern' && <><div className="bg-gray-300 dark:bg-gray-600 h-1 w-1/4 rounded"></div><div className="bg-gray-300 dark:bg-gray-600 h-1 w-full rounded"></div><div className="bg-gray-300 dark:bg-gray-600 h-1 w-3/4 rounded"></div><div className="bg-gray-300 dark:bg-gray-600 h-1 w-1/2 rounded"></div></>}
        {id === 'classic' && <><div className="bg-gray-300 dark:bg-gray-600 h-1 w-1/3 rounded mx-auto"></div><div className="border-b border-gray-300 dark:border-gray-600 my-1"></div><div className="bg-gray-300 dark:bg-gray-600 h-1 w-full rounded"></div><div className="bg-gray-300 dark:bg-gray-600 h-1 w-full rounded"></div></>}
        {id === 'creative' && <div className="flex space-x-2 h-full"><div className="w-1/3 bg-gray-300 dark:bg-gray-600 h-full rounded"></div><div className="w-2/3 h-full flex flex-col space-y-1"><div className="bg-gray-300 dark:bg-gray-600 h-1 w-full rounded"></div><div className="bg-gray-300 dark:bg-gray-600 h-1 w-2/3 rounded"></div></div></div>}
        {id === 'minimalist' && <><div className="bg-gray-300 dark:bg-gray-600 h-px w-1/4 my-1"></div><div className="bg-gray-300 dark:bg-gray-600 h-px w-full my-1"></div><div className="bg-gray-300 dark:bg-gray-600 h-px w-3/4 my-1"></div><div className="bg-gray-300 dark:bg-gray-600 h-px w-1/2 my-1"></div></>}
        {id === 'corporate' && <><div className="bg-gray-400 dark:bg-gray-500 h-2 w-full rounded-t"></div><div className="p-1"><div className="bg-gray-300 dark:bg-gray-600 h-1 w-full rounded mt-1"></div><div className="bg-gray-300 dark:bg-gray-600 h-1 w-3/4 rounded mt-1"></div></div></>}
        {id === 'elegant' && <><div className="bg-gray-300 dark:bg-gray-600 h-1 w-1/3 rounded mx-auto"></div><div className="bg-gray-200 dark:bg-gray-700 h-px w-full my-1"></div><div className="bg-gray-300 dark:bg-gray-600 h-1 w-full rounded"></div><div className="bg-gray-300 dark:bg-gray-600 h-1 w-full rounded mt-1"></div></>}
        {id === 'tech' && <div className="flex space-x-2 h-full"><div className="w-1/4 bg-gray-600 dark:bg-gray-500 h-full rounded"></div><div className="w-3/4 h-full flex flex-col space-y-1"><div className="bg-gray-300 dark:bg-gray-600 h-1 w-full rounded"></div><div className="bg-gray-300 dark:bg-gray-600 h-1 w-2/3 rounded"></div></div></div>}
        {id === 'infographic' && <div className="flex space-x-2 h-full items-center"><div className="w-1/4 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div><div className="w-3/4 h-full flex flex-col space-y-2 justify-center"><div className="bg-gray-300 dark:bg-gray-600 h-1 w-full rounded"></div><div className="bg-gray-300 dark:bg-gray-600 h-1 w-2/3 rounded"></div></div></div>}
        {id === 'bold' && <><div className="bg-brand-primary h-2 w-1/2 rounded"></div><div className="bg-gray-300 dark:bg-gray-600 h-1 w-full rounded mt-2"></div><div className="bg-gray-300 dark:bg-gray-600 h-1 w-3/4 rounded mt-1"></div></>}
      </div>
    </button>
  );
};

export default TemplateCard;
