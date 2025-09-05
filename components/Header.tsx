import React from 'react';
import { CompassIcon, ArrowRightIcon, UserIcon } from './icons';

interface HeaderProps {
  onStartTest?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartTest }) => {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="relative">
            <CompassIcon className="h-10 w-10 text-blue-400 animate-pulse-slow" />
            <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
          </div>
          <h1 className="text-2xl font-bold text-white ml-3 tracking-tight">FindWay.ai</h1>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-gray-300 font-medium">
            <a href="#how-it-works" className="hover:text-blue-400 transition-all duration-300 hover:scale-105 relative group">
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#features" className="hover:text-blue-400 transition-all duration-300 hover:scale-105 relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#contact" className="hover:text-blue-400 transition-all duration-300 hover:scale-105 relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <div className="flex items-center gap-2 text-gray-400 border-l border-gray-700 pl-6">
              <UserIcon className="h-4 w-4" />
              <span className="text-sm">Guest User</span>
            </div>
        </nav>
        {onStartTest ? (
          <button
            onClick={onStartTest}
            className="hidden md:flex items-center bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            Start Assessment
            <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        ) : (
            <div className="hidden md:block w-[200px]"/>
        )}
        
        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};
