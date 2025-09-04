import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Analyzing your unique personality traits...",
  "Mapping your interests to career fields...",
  "Calculating your core aptitudes...",
  "Consulting our AI career counselor...",
  "Building your personalized development plan...",
  "Finalizing your top career matches...",
];

interface LoadingScreenProps {
    message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (!message) { // Only cycle if no custom message is provided
            const interval = setInterval(() => {
                setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [message]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="bg-white p-12 rounded-2xl shadow-lg max-w-lg mx-auto">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">
            {message ? "Please Wait" : "Generating Your Report"}
        </h2>
        <p className="text-slate-600 transition-opacity duration-500">
            {message || loadingMessages[messageIndex]}
        </p>
      </div>
    </div>
  );
};