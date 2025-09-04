import React from 'react';
import { CompassIcon, ArrowRightIcon } from './icons';

interface HeaderProps {
  onStartTest?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartTest }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <CompassIcon className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-800 ml-2">FindWay.ai</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-slate-600 font-medium">
            <a href="#" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">FAQ</a>
        </nav>
        {onStartTest ? (
          <button
            onClick={onStartTest}
            className="hidden md:flex items-center bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 group"
          >
            Start Assessment
            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        ) : (
            <div className="hidden md:block w-[180px]"/> // Placeholder to prevent layout shift
        )}
      </div>
    </header>
  );
};
