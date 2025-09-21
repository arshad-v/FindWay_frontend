import React from 'react';

export const AppLoadingScreen: React.FC = () => {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8 animate-pulse">
          <img 
            src="https://iili.io/KYhL76l.png" 
            alt="CareerRoute.ai Logo" 
            className="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-2xl"
          />
        </div>
        
        {/* App Name */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            <span className="text-white">CareerRoute</span>
            <span style={{color: '#3388FF'}}>.ai</span>
          </h1>
          <p className="text-gray-400 text-lg">Your AI Career Guide</p>
        </div>

        {/* Welcome Content */}
        <div className="mb-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-4 animate-fade-in">
            Welcome to Your Future! 🚀
          </h2>
          
        </div>
        
        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
        
        <p className="text-gray-500 text-sm">Preparing your career discovery journey...</p>
      </div>
    </div>
  );
};
