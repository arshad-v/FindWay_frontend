
import React from 'react';
import { ArrowRightIcon, AlertTriangleIcon } from './icons';

interface WelcomeScreenProps {
  onStartTest: () => void;
  error?: string | null;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartTest, error }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold text-indigo-600 mb-4">Discover Your Future</h2>
        <p className="text-lg text-slate-600 mb-8">
          Welcome to FindWay.ai. Our comprehensive assessment will help you understand your strengths, interests, and personality to reveal the career paths that are best suited for you.
        </p>
        
        {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 text-left">
                <div className="flex">
                    <div className="py-1">
                       <AlertTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
                    </div>
                    <div>
                        <p className="font-bold text-red-800">An Error Occurred</p>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        )}

        <div className="bg-indigo-50 p-6 rounded-lg text-left mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-2">How it works:</h3>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start">
              <span className="bg-indigo-200 text-indigo-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3">1</span>
              Answer a series of questions across 5 key dimensions of your personality and aptitude.
            </li>
            <li className="flex items-start">
              <span className="bg-indigo-200 text-indigo-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3">2</span>
              Our AI analyzes your responses to build a unique personal profile.
            </li>
            <li className="flex items-start">
              <span className="bg-indigo-200 text-indigo-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3">3</span>
              Receive a detailed report with career matches and a personalized development plan.
            </li>
          </ul>
        </div>
        
        <button
          onClick={onStartTest}
          className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-full md:w-auto mx-auto group"
        >
          Start Your Assessment
          <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
