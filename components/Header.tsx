import React from 'react';
import { CompassIcon, ArrowRightIcon, UserIcon } from './icons';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

interface HeaderProps {
  onStartTest?: () => void;
  onGoHome?: () => void;
  onViewReport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartTest, onGoHome, onViewReport }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-800/90 backdrop-blur-xl border border-slate-600 shadow-2xl rounded-3xl mx-6 sm:mx-12 mt-4 sm:mt-6">
      <div className="container mx-auto px-4 sm:px-6 py-1 sm:py-2 flex justify-between items-center">
        <div className="flex items-center ml-2 sm:ml-4">
          <button 
            onClick={() => {
              onGoHome?.();
              // Scroll to top of page to show hero section
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:opacity-80 transition-opacity duration-300"
          >
            <img 
              src="https://i.postimg.cc/c4j4nLFd/Removal-40.png" 
              alt="FindWay.ai Logo" 
              className="h-14 sm:h-16 w-auto"
            />
          </button>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-gray-300 font-medium">
            <button 
              onClick={() => {
                onGoHome?.();
                // Scroll to top of page to show hero section
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-400 transition-all duration-300 hover:scale-105 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <SignedIn>
              <button 
                onClick={onViewReport}
                className="hover:text-blue-400 transition-all duration-300 hover:scale-105 relative group"
              >
                Report
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </SignedIn>
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
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <SignedOut>
            {onStartTest && (
              <SignInButton>
                <button className="flex items-center bg-blue-600 text-white font-bold py-2 px-3 sm:py-3 sm:px-6 rounded-xl shadow-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                  <span className="hidden sm:inline">Start Assessment</span>
                  <span className="sm:hidden">Start</span>
                  <ArrowRightIcon className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </SignInButton>
            )}
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            {onStartTest && (
              <button
                onClick={onStartTest}
                className="flex items-center bg-blue-600 text-white font-bold py-2 px-3 sm:py-3 sm:px-6 rounded-xl shadow-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 ml-2 sm:ml-4 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Start Assessment</span>
                <span className="sm:hidden">Start</span>
                <ArrowRightIcon className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
