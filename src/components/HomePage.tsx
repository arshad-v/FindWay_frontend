import React from 'react';
import { ArrowRightIcon, CheckIcon, StarIcon, ShieldIcon, ClockIcon } from './icons';

interface HomePageProps {
  onStartAssessment: () => void;
  error?: string | null;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartAssessment, error }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Discover Your
            <span className="block text-blue-400">Perfect Career</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered career guidance that analyzes your personality, interests, and aptitudes to reveal the career paths where you'll truly thrive.
          </p>
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 p-4 mb-8 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-center">
                <div className="text-red-400 mr-3">⚠️</div>
                <div>
                  <p className="font-semibold text-red-300">Error Occurred</p>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onStartAssessment}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto group text-lg"
          >
            Start Your Assessment
            <ArrowRightIcon className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Why Choose FindWay.ai?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <StarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">AI-Powered Analysis</h3>
              <p className="text-gray-300 leading-relaxed">
                Advanced artificial intelligence analyzes your responses across multiple dimensions to provide accurate career recommendations.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="bg-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <ShieldIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Scientifically Validated</h3>
              <p className="text-gray-300 leading-relaxed">
                Our assessment is based on proven psychometric principles and validated career guidance methodologies.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Quick & Comprehensive</h3>
              <p className="text-gray-300 leading-relaxed">
                Complete your assessment in just 10-15 minutes and receive a detailed, personalized career report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Tell Us About Yourself</h3>
              <p className="text-gray-300">
                Share your educational background, interests, and skills to help us personalize your assessment.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Complete Assessment</h3>
              <p className="text-gray-300">
                Answer personalized questions designed specifically for your background and interests.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Get Your Report</h3>
              <p className="text-gray-300">
                Receive detailed career matches, strengths analysis, and a personalized development plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Preview Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">
            What You'll Discover
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <CheckIcon className="h-8 w-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3 text-white">Your Strengths Profile</h3>
              <p className="text-gray-300">
                Understand your dominant personality traits and natural abilities that will drive your success.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <CheckIcon className="h-8 w-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3 text-white">Top Career Matches</h3>
              <p className="text-gray-300">
                Get specific job recommendations with industry trends and educational requirements.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <CheckIcon className="h-8 w-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3 text-white">Development Plan</h3>
              <p className="text-gray-300">
                Receive actionable recommendations to enhance your skills and prepare for your chosen career.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <CheckIcon className="h-8 w-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3 text-white">Downloadable Report</h3>
              <p className="text-gray-300">
                Get a professional PDF report you can save, share, or use for college and career planning.
              </p>
            </div>
          </div>
          
          <button
            onClick={onStartAssessment}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto group text-lg"
          >
            Begin Your Journey
            <ArrowRightIcon className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  );
};