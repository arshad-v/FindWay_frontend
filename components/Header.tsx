import React, { useState, useEffect, useRef } from 'react';
import { CompassIcon, ArrowRightIcon } from './icons';
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
  onPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartTest, onGoHome, onViewReport, onPricing }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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
            <div className="flex items-center">
              <img 
                src="https://iili.io/KIrXCNI.th.png" 
                alt="CareerRoute.ai Logo" 
                className="h-8 sm:h-10 w-auto"
              />
              <div className="text-2xl sm:text-3xl font-bold">
                
                <span className="text-white">CareerRoute</span>
                <span style={{color: '#3388FF'}}>.ai</span>
                
                
                
              </div>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
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
            <button 
              onClick={() => {
                onGoHome?.();
                setTimeout(() => {
                  const featuresSection = document.getElementById('features');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="hover:text-blue-400 transition-all duration-300 hover:scale-105 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={onPricing}
              className="hover:text-blue-400 transition-all duration-300 hover:scale-105 relative group"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => {
                onGoHome?.();
                setTimeout(() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="hover:text-blue-400 transition-all duration-300 hover:scale-105 relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-2 sm:gap-4">
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

        {/* Mobile Right Side */}
        <div className="md:hidden flex items-center gap-3">
          <SignedOut>
            <SignInButton>
              <button className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white transition-colors duration-300 p-2"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div ref={menuRef} className="md:hidden absolute top-full left-6 right-6 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="py-4">
            <button 
              onClick={() => {
                onGoHome?.();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-6 py-3 text-gray-300 hover:text-blue-400 hover:bg-slate-700/50 transition-all duration-300"
            >
              Home
            </button>
            <SignedIn>
              <button 
                onClick={() => {
                  onViewReport?.();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-6 py-3 text-gray-300 hover:text-blue-400 hover:bg-slate-700/50 transition-all duration-300"
              >
                Report
              </button>
            </SignedIn>
            <button 
              onClick={() => {
                onGoHome?.();
                setIsMobileMenuOpen(false);
                setTimeout(() => {
                  const featuresSection = document.getElementById('features');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="block w-full text-left px-6 py-3 text-gray-300 hover:text-blue-400 hover:bg-slate-700/50 transition-all duration-300"
            >
              Features
            </button>
            <button 
              onClick={() => {
                onGoHome?.();
                setIsMobileMenuOpen(false);
                setTimeout(() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="block w-full text-left px-6 py-3 text-gray-300 hover:text-blue-400 hover:bg-slate-700/50 transition-all duration-300"
            >
              Contact
            </button>
            <button 
              onClick={() => {
                onPricing?.();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-6 py-3 text-gray-300 hover:text-blue-400 hover:bg-slate-700/50 transition-all duration-300"
            >
              Pricing
            </button>
            {onStartTest && (
              <div className="border-t border-slate-600 mt-2 pt-2">
                <SignedOut>
                  <SignInButton>
                    <button className="block w-full text-left px-6 py-3 text-blue-400 font-semibold hover:bg-slate-700/50 transition-all duration-300">
                      Start Assessment
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <button
                    onClick={() => {
                      onStartTest();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-6 py-3 text-blue-400 font-semibold hover:bg-slate-700/50 transition-all duration-300"
                  >
                    Start Assessment
                  </button>
                </SignedIn>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
