
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Analyzing your unique personality traits...",
  "Mapping your interests to career fields...",
  "Calculating your core aptitudes...",
  "Consulting our AI career counselor...",
  "Building your personalized development plan...",
  "Finalizing your top career matches...",
];

export const LoadingScreen: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-12 rounded-2xl shadow-2xl max-w-lg mx-auto">
        <div className="relative mx-auto w-16 h-16 mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="https://i.postimg.cc/7LzzxY0t/3c95258d-781d-4c26-b284-cf0a52b8e28e-removalai-preview.png" 
              alt="FindWay.ai Logo" 
              className="h-8 w-8 object-contain"
            />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mt-8 mb-6">Generating Your Report</h2>
        <p className="text-gray-300 text-lg transition-opacity duration-500">
            {loadingMessages[messageIndex]}
        </p>
        <div className="flex justify-center mt-6 space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};
