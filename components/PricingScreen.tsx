import React from 'react';
import { CompassIcon, StarIcon, ZapIcon, HomeIcon } from './icons';

interface PricingScreenProps {
  onBack?: () => void;
}

export const PricingScreen: React.FC<PricingScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-8 md:py-0">
      <div className="max-w-4xl mx-auto text-center w-full">

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-16 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-full">
                <ZapIcon className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 px-2">
            Pricing Plans
          </h1>
          
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-black font-bold text-base md:text-lg mb-6 md:mb-8">
            <StarIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Coming Soon
          </div>

          {/* Description */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 md:mb-8 leading-relaxed max-w-3xl mx-auto px-2">
            We're crafting the perfect pricing plans to make career guidance accessible for everyone. 
            Stay tuned for flexible options that fit your journey!
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 px-2">
            <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
              <div className="bg-blue-500/20 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 mx-auto">
                <CompassIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">Free Assessments</h3>
              <p className="text-gray-400 text-xs md:text-sm">Basic career guidance for students</p>
            </div>
            
            <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
              <div className="bg-indigo-500/20 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 mx-auto">
                <StarIcon className="h-5 w-5 md:h-6 md:w-6 text-indigo-400" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">Premium Plans</h3>
              <p className="text-gray-400 text-xs md:text-sm">Advanced insights and personalized coaching</p>
            </div>
            
            <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 sm:col-span-2 md:col-span-1">
              <div className="bg-purple-500/20 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 mx-auto">
                <ZapIcon className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">Enterprise</h3>
              <p className="text-gray-400 text-xs md:text-sm">Solutions for schools and organizations</p>
            </div>
          </div>

          {/* Notify Button */}
          <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-8 border border-white/10 mx-2">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Get Notified</h3>
            <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">Be the first to know when our pricing plans are available!</p>
            <div className="flex flex-col gap-3 md:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-sm text-sm md:text-base"
              />
              <button className="w-full md:w-auto px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base">
                Notify Me
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10 px-2">
            <p className="text-gray-400 text-sm md:text-base">
              Expected Launch: <span className="text-white font-semibold">Q2 2024</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
