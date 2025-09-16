import React, { useState, useEffect } from 'react';
import { PathwayPlan, PathwayStep, UserData } from '../types';
import { pathwayGeneratorAgent } from '../services/aiAgents';
import { 
  MapIcon, 
  MortarboardIcon, 
  ToolsIcon, 
  BuildingIcon, 
  BadgeIcon, 
  UsersGroupIcon,
  RefreshCwIcon
} from './icons';

interface PathwayPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerTitle: string;
  userData: UserData;
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

const getStepIcon = (stepType: PathwayStep['type']) => {
  switch (stepType) {
    case 'Education':
      return MortarboardIcon;
    case 'Skill Development':
      return ToolsIcon;
    case 'Practical Experience':
      return BuildingIcon;
    case 'Certification':
      return BadgeIcon;
    case 'Networking':
      return UsersGroupIcon;
    default:
      return MortarboardIcon;
  }
};

const getStepColor = (stepType: PathwayStep['type']) => {
  switch (stepType) {
    case 'Education':
      return 'bg-blue-500';
    case 'Skill Development':
      return 'bg-green-500';
    case 'Practical Experience':
      return 'bg-purple-500';
    case 'Certification':
      return 'bg-yellow-500';
    case 'Networking':
      return 'bg-pink-500';
    default:
      return 'bg-blue-500';
  }
};

export const PathwayPlannerModal: React.FC<PathwayPlannerModalProps> = ({
  isOpen,
  onClose,
  careerTitle,
  userData
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [pathwayPlan, setPathwayPlan] = useState<PathwayPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !pathwayPlan) {
      generatePathway();
    }
  }, [isOpen, careerTitle]);

  const generatePathway = async () => {
    setLoadingState('loading');
    setError(null);
    
    try {
      const plan = await pathwayGeneratorAgent(userData, careerTitle);
      setPathwayPlan(plan);
      setLoadingState('success');
    } catch (err) {
      console.error('Error generating pathway:', err);
      setError('Failed to generate your personalized pathway. Please try again.');
      setLoadingState('error');
    }
  };

  const handleRetry = () => {
    setPathwayPlan(null);
    generatePathway();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl h-full sm:max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="blue-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <MapIcon className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-bold truncate">Your Pathway to Success</h2>
                <p className="text-blue-100 mt-1 text-sm sm:text-base truncate">
                  {pathwayPlan ? `Becoming a ${pathwayPlan.careerTitle}` : `Becoming a ${careerTitle}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-lg flex-shrink-0 ml-2"
            >
              <svg className="h-6 w-6 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto h-full sm:max-h-[calc(90vh-120px)] pb-20 sm:pb-6">
          {loadingState === 'loading' && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <MapIcon className="absolute inset-0 m-auto h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center px-4">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Crafting your personalized roadmap...</h3>
                <p className="text-gray-400 text-sm sm:text-base">Analyzing your profile and creating the perfect pathway</p>
              </div>
            </div>
          )}

          {loadingState === 'error' && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-16 space-y-4 px-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-400 mb-4 text-sm sm:text-base">{error}</p>
                <button
                  onClick={handleRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm sm:text-base"
                >
                  <RefreshCwIcon className="h-6 w-6" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

          {loadingState === 'success' && pathwayPlan && (
            <div className="space-y-6 sm:space-y-8">
              {/* Timeline */}
              <div className="relative">
                {/* Central timeline line */}
                <div className="absolute left-1/2 transform -translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 hidden md:block"></div>
                
                {/* Mobile timeline line */}
                <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 md:hidden"></div>

                <div className="space-y-8 sm:space-y-12">
                  {pathwayPlan.steps.map((step, index) => {
                    const StepIcon = getStepIcon(step.type);
                    const isEven = index % 2 === 0;
                    
                    return (
                      <div key={index} className="relative">
                        {/* Desktop layout - alternating sides */}
                        <div className={`hidden md:flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                          {/* Content card */}
                          <div className={`w-5/12 ${isEven ? 'pr-8' : 'pl-8'}`}>
                            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className={`p-2 rounded-lg ${getStepColor(step.type)}`}>
                                  <StepIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                                  <span className="text-sm text-gray-400">{step.duration}</span>
                                </div>
                              </div>
                              <p className="text-gray-300 leading-relaxed">{step.description}</p>
                              <div className="mt-3">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getStepColor(step.type)}`}>
                                  {step.type}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Timeline icon */}
                          <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-full ${getStepColor(step.type)} flex items-center justify-center border-4 border-gray-900 shadow-lg`}>
                              <StepIcon className="h-6 w-6 text-white" />
                            </div>
                          </div>

                          {/* Spacer for opposite side */}
                          <div className="w-5/12"></div>
                        </div>

                        {/* Mobile layout - single column */}
                        <div className="md:hidden flex items-start space-x-3 sm:space-x-4">
                          {/* Timeline icon */}
                          <div className="relative z-10 flex-shrink-0">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${getStepColor(step.type)} flex items-center justify-center border-4 border-gray-900 shadow-lg`}>
                              <StepIcon className="h-6 w-6 sm:h-6 sm:w-6 text-white" />
                            </div>
                          </div>

                          {/* Content card */}
                          <div className="flex-1 min-w-0">
                            <div className="bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                              <div className="mb-3">
                                <h3 className="text-base sm:text-lg font-semibold text-white leading-tight">{step.title}</h3>
                                <span className="text-xs sm:text-sm text-gray-400 mt-1 block">{step.duration}</span>
                              </div>
                              <p className="text-gray-300 leading-relaxed mb-3 text-sm sm:text-base">{step.description}</p>
                              <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white ${getStepColor(step.type)}`}>
                                {step.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Success message */}
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Your Journey Starts Now! 🚀</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  This personalized roadmap is designed specifically for your background and goals. 
                  Take it one step at a time, and you'll be amazed at what you can achieve!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
