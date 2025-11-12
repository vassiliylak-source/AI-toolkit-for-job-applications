import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 dark:text-gray-400 p-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary mb-4"></div>
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{message}</p>
      <p className="text-sm">Please wait, AI is working its magic.</p>
    </div>
  );
};

export default Loader;