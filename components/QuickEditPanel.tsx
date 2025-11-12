
import React, { useState } from 'react';
import { SparklesIcon, CopyIcon } from './Icons';

interface QuickEditPanelProps {
  onGenerate: (text: string, request: string) => void;
  result: string;
  isLoading: boolean;
  error: string | null;
  isContextReady: boolean;
}

const QuickEditPanel: React.FC<QuickEditPanelProps> = ({ onGenerate, result, isLoading, error, isContextReady }) => {
    const [text, setText] = useState('');
    const [request, setRequest] = useState('Make this more impactful and concise.');
    const [copySuccess, setCopySuccess] = useState('');

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy.');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col gap-6 h-full shadow-sm transition-colors duration-300 relative">
             {!isContextReady && (
                <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 z-10 flex items-center justify-center rounded-2xl">
                    <div className="text-center p-4">
                        <p className="font-semibold text-gray-700 dark:text-gray-300">AI Writing Assistant</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">First, generate a tailored CV to provide context for the AI.</p>
                    </div>
                </div>
            )}
            <div className={`transition-opacity duration-300 ${!isContextReady ? 'opacity-40 blur-sm pointer-events-none' : ''}`}>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">AI Writing Assistant</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Improve any text snippet using the context of your generated CV and job description.
                    </p>
                </div>
                <div>
                    <label htmlFor="snippet-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text to Improve</label>
                    <textarea
                        id="snippet-text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste a bullet point, sentence, or paragraph here..."
                        className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                        disabled={isLoading || !isContextReady}
                    />
                </div>
                 <div>
                    <label htmlFor="snippet-request" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How should the AI improve it?</label>
                    <input
                        type="text"
                        id="snippet-request"
                        value={request}
                        onChange={(e) => setRequest(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        disabled={isLoading || !isContextReady}
                    />
                </div>

                <button
                    onClick={() => onGenerate(text, request)}
                    disabled={isLoading || !text || !request || !isContextReady}
                    className="w-full bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    {isLoading ? 'Improving...' : 'Improve Text'}
                </button>

                {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                
                { (result || isLoading) &&
                <div className="relative">
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Suggested Improvement</label>
                    <textarea
                        value={isLoading ? 'Generating suggestion...' : result}
                        readOnly
                        className="w-full h-24 p-3 border border-gray-200 dark:border-gray-500 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200"
                    />
                     {result && !isLoading && (
                        <div className="absolute top-8 right-2 flex items-center space-x-2">
                             {copySuccess && <span className="text-xs text-green-600">{copySuccess}</span>}
                            <button
                                onClick={handleCopy}
                                className="flex items-center bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold py-1 px-2 rounded-md text-xs"
                                aria-label="Copy suggestion"
                            >
                                <CopyIcon className="w-3 h-3 mr-1.5" />
                                Copy
                            </button>
                        </div>
                     )}
                </div>
                }
            </div>
        </div>
    );
};

export default QuickEditPanel;
