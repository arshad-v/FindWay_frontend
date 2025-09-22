import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useUser, useSession } from '@clerk/clerk-react';
import { type ReportData, type RawScores, type UserData, type PathwayPlan } from '../types';
import { getNormalizedScoresForChart } from '../utils/scoreCalculator';
import { ScoreChart } from './ScoreChart';
import { PathwayPlannerModal } from './PathwayPlannerModal';
import { DatabaseService } from '../services/databaseService';
import { LightbulbIcon, BriefcaseIcon, GrowthIcon, DownloadIcon, RefreshCwIcon, StarIcon, TargetIcon, BookOpenIcon, ZapIcon, CodeIcon, DollarSignIcon, PaletteIcon, StethoscopeIcon, UsersIcon, UserIcon, CompassIcon, FlagIcon, MessageCircleIcon, MapIcon, LockIcon } from './icons';

interface ReportScreenProps {
  report: ReportData;
  scores: RawScores;
  userData: UserData;
  onRetake: () => void;
  onChatWithCoach?: () => void;
  onNavigateToPricing?: () => void;
}

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode, className?: string }> = ({ icon, title, children, className = '' }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 h-full ${className}`}>
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-xl font-bold text-slate-800 ml-3">{title}</h3>
        </div>
        <div className="text-slate-600">
            {children}
        </div>
    </div>
);

const RecommendationIcon: React.FC<{type: 'Habit' | 'Resource' | 'Exercise'}> = ({type}) => {
    switch (type) {
        case 'Habit': return <StarIcon className="h-6 w-6 text-yellow-500 mr-4 flex-shrink-0"/>;
        case 'Resource': return <BookOpenIcon className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0"/>;
        case 'Exercise': return <ZapIcon className="h-6 w-6 text-green-500 mr-4 flex-shrink-0"/>;
        default: return null;
    }
}

const CareerIcon: React.FC<{title: string}> = ({title}) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('develop') || lowerTitle.includes('software') || lowerTitle.includes('engine') || lowerTitle.includes('tech')) {
        return <CodeIcon className="h-8 w-8 text-white"/>;
    }
    if (lowerTitle.includes('business') || lowerTitle.includes('financ') || lowerTitle.includes('analy') || lowerTitle.includes('manager')) {
        return <DollarSignIcon className="h-8 w-8 text-white"/>;
    }
    if (lowerTitle.includes('design') || lowerTitle.includes('art') || lowerTitle.includes('media')) {
        return <PaletteIcon className="h-8 w-8 text-white"/>;
    }
     if (lowerTitle.includes('health') || lowerTitle.includes('doctor') || lowerTitle.includes('therapist') || lowerTitle.includes('medic')) {
        return <StethoscopeIcon className="h-8 w-8 text-white"/>;
    }
    if (lowerTitle.includes('social') || lowerTitle.includes('counsel') || lowerTitle.includes('teacher')) {
        return <UsersIcon className="h-8 w-8 text-white"/>;
    }
    return <BriefcaseIcon className="h-8 w-8 text-white"/>;
}

const capitalize = (s: string) => {
    if (!s) return '';
    // Handle camelCase like 'orientationStyle' -> 'Orientation Style'
    return s.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
}

const ScoreBreakdownBar: React.FC<{label: string, score: number, maxScore: number, colorClass: string}> = ({label, score, maxScore, colorClass}) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium text-slate-700">{label}</span>
                <span className="font-medium text-slate-500">{score} / {maxScore}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
                <div className={`${colorClass} h-2 rounded-full`} style={{width: `${percentage}%`}}></div>
            </div>
        </div>
    );
};

const DetailedScores: React.FC<{scores: RawScores, analysis: ReportData['detailedAnalyses']}> = ({scores, analysis}) => {
    const categories: {name: keyof RawScores, title: string, color: string, max: number}[] = [
        {name: 'orientationStyle', title: 'Orientation Style', color: 'bg-cyan-500', max: 10},
        {name: 'interest', title: 'Interest', color: 'bg-amber-500', max: 25},
        {name: 'personality', title: 'Personality', color: 'bg-violet-500', max: 5},
        {name: 'aptitude', title: 'Aptitude', color: 'bg-rose-500', max: 5},
        {name: 'eq', title: 'Emotional Quotient (EQ)', color: 'bg-lime-500', max: 5},
    ];

    return (
        <div className="space-y-6">
            {categories.map(cat => (
                 <div key={cat.name} className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/90">
                    <h4 className="text-lg font-bold text-slate-800 mb-4">{cat.title}</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                        {Object.entries(scores[cat.name]).map(([subCat, score]) => (
                             <ScoreBreakdownBar key={subCat} label={capitalize(subCat)} score={score as number} maxScore={cat.max} colorClass={cat.color} />
                        ))}
                    </div>
                    <p className="text-sm text-slate-700 bg-slate-200/70 p-3 rounded-lg">{analysis[cat.name]}</p>
                 </div>
            ))}
        </div>
    );
};

export const ReportScreen: React.FC<ReportScreenProps> = ({ report, scores, userData, onRetake, onChatWithCoach, onNavigateToPricing }) => {
  const { user } = useUser();
  const { session } = useSession();
  const reportContentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pathwayCareer, setPathwayCareer] = useState<string | null>(null);
  const [pathwayCache, setPathwayCache] = useState<{ [key: string]: PathwayPlan }>({});
  const [isProUser, setIsProUser] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const normalizedScores = getNormalizedScoresForChart(scores);

  // Check user's pro status
  useEffect(() => {
    const checkProStatus = async () => {
      if (session) {
        try {
          const status = await DatabaseService.getUserAssessmentStatus(session);
          setIsProUser(status?.isProUser || false);
        } catch (error) {
          console.error('Error checking pro status:', error);
          setIsProUser(false);
        }
      }
    };
    checkProStatus();
  }, [session]);

  const handleGeneratePathway = (careerTitle: string, careerIndex: number) => {
    // First career match (index 0) is always free
    if (careerIndex === 0) {
      setPathwayCareer(careerTitle);
      return;
    }

    // For career matches 2 and 3 (index 1 and 2), check if user is pro
    if (!isProUser) {
      setShowUpgradeModal(true);
      return;
    }

    setPathwayCareer(careerTitle);
  };

  const handleClosePathway = () => {
    setPathwayCareer(null);
  };

  const downloadPdf = async () => {
    // Disabled until payment integration is ready
    // Show Pro upgrade message instead
    alert('🚀 Upgrade to Pro to download your personalized career report as PDF!');
  };  



  return (
    <div className="bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm pdf-hide">
        <div className="container mx-auto px-4 py-3">
            {/* Mobile Layout */}
            <div className="md:hidden">
                {/* Buttons First */}
                <div className="flex flex-col gap-2 mb-6">
                    <div className="flex flex-col gap-2">
                        <button onClick={onRetake} className="flex items-center justify-center px-4 py-2.5 bg-white text-slate-700 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors font-semibold text-sm shadow-sm">
                            <RefreshCwIcon className="h-6 w-6 mr-2" /> Retake Test
                        </button>
                        <button onClick={downloadPdf} className="relative flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 animate-pulse opacity-20"></div>
                            <div className="relative flex items-center">
                                <DownloadIcon className="h-6 w-6 mr-2" /> 
                                <span>Download PDF</span>
                                <div className="ml-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                                    PRO
                                </div>
                            </div>
                        </button>
                        {onChatWithCoach && (
                            <button 
                                onClick={onChatWithCoach} 
                                className="flex items-center justify-center px-4 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm"
                            >
                                <MessageCircleIcon className="h-6 w-6 mr-2" />
                                Chat with AI Career Coach
                            </button>
                        )}
                    </div>
                </div>
                {/* Heading Below */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <CompassIcon className="h-6 w-6 text-indigo-600" />
                        <h1 className="text-lg font-bold text-slate-800">Your Career Report</h1>
                    </div>
                    <p className="text-sm text-slate-500">For {userData.name}</p>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <CompassIcon className="h-8 w-8 text-indigo-600" />
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Your Career Report</h1>
                        <p className="text-sm text-slate-500">For {userData.name}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
                    <button onClick={onRetake} className="flex items-center justify-center px-3 sm:px-4 py-2 bg-white text-slate-700 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors font-semibold text-sm sm:text-base">
                        <RefreshCwIcon className="h-4 w-4 sm:h-6 sm:w-7 mr-1 sm:mr-2" /> 
                        <span className="hidden sm:inline">Retake Test</span>
                        <span className="sm:hidden">Retake</span>
                    </button>
                    <button onClick={downloadPdf} className="relative flex items-center justify-center px-3 sm:px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm sm:text-base overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 animate-pulse opacity-20"></div>
                        <div className="relative flex items-center">
                            <DownloadIcon className="h-4 w-4 sm:h-6 sm:w-7 mr-1 sm:mr-2" /> 
                            <span className="hidden sm:inline">Download PDF</span>
                            <span className="sm:hidden">PDF</span>
                            <div className="ml-1 sm:ml-2 bg-yellow-400 text-black text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold animate-bounce">
                                PRO
                            </div>
                        </div>
                    </button>
                    {onChatWithCoach && (
                        <button 
                            onClick={onChatWithCoach} 
                            className="flex items-center justify-center px-3 sm:px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm sm:text-base"
                        >
                            <MessageCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Chat with AI Career Coach</span>
                            <span className="sm:hidden">Chat Coach</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
      </header>
      
      <div className="w-full px-0 py-4 md:py-8">
        <div ref={reportContentRef} className="w-full max-w-none">
            <div className="space-y-4 md:space-y-8">
            
            <div className="p-4 md:p-8 bg-slate-50 rounded-none print:p-6 print:shadow-none print:bg-white w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SectionCard icon={<UserIcon className="h-8 w-8 text-indigo-500" />} title="AI Profile Summary">
                        <p className="leading-relaxed">{report.profileSummary}</p>
                    </SectionCard>
                    <SectionCard icon={<CompassIcon className="h-8 w-8 text-indigo-500" />} title="Your Profile Overview">
                        <ScoreChart scores={normalizedScores} />
                    </SectionCard>
                </div>
                <div className="mt-8">
                    <SectionCard icon={<BriefcaseIcon className="h-8 w-8 text-indigo-500" />} title="Top 3 Career Matches">
                        <div className="space-y-8 mt-2">
                            {report.careerMatches?.map((match, index) => (
                                <div key={index} className="bg-slate-100 p-6 rounded-xl border border-slate-200">
                                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                                        <div className="flex-shrink-0 bg-indigo-500 rounded-xl h-16 w-16 flex items-center justify-center">
                                            <CareerIcon title={match.title} />
                                        </div>
                                        <div className="flex-grow w-full">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                                                <h4 className="font-bold text-xl text-indigo-900">{match.title}</h4>
                                                <div className="text-sm font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full self-start mt-2 sm:mt-0">
                                                    {match.compatibility}% Match
                                                </div>
                                            </div>
                                            <p className="text-slate-700 mb-6 text-sm leading-6">{match.description}</p>
                                            
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Job Scope & Features */}
                                                <div className="bg-white/90 p-4 rounded-lg border border-slate-200">
                                                    <h5 className="font-semibold text-slate-700 mb-3 flex items-center">
                                                        <TargetIcon className="h-6 w-6 mr-2 text-blue-500" />
                                                        Job Scope & Features
                                                    </h5>
                                                    <div className="space-y-2 text-sm leading-6">
                                                        <p><strong>Key Responsibilities:</strong> {match.keyResponsibilities || 'Strategic planning, team leadership, project management, stakeholder communication, performance optimization'}</p>
                                                        <p><strong>Required Skills:</strong> {match.requiredSkills || 'Technical expertise, analytical thinking, communication, problem-solving, leadership'}</p>
                                                        <p><strong>Growth Path:</strong> {match.growthPath || 'Junior → Senior → Lead → Manager → Director → VP'}</p>
                                                    </div>
                                                </div>

                                                {/* Salary Information */}
                                                <div className="bg-white/90 p-4 rounded-lg border border-slate-200">
                                                    <h5 className="font-semibold text-slate-700 mb-3 flex items-center">
                                                        <DollarSignIcon className="h-6 w-6 mr-2 text-green-500" />
                                                        Salary Ranges
                                                    </h5>
                                                    <div className="space-y-3 text-sm leading-6">
                                                        <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                                                            <p className="font-semibold text-green-800">🇮🇳 India</p>
                                                            <p><strong>Entry Level:</strong> {match.salaryIndia?.entry || '₹3-8 LPA'}</p>
                                                            <p><strong>Mid Level:</strong> {match.salaryIndia?.mid || '₹8-20 LPA'}</p>
                                                            <p><strong>Senior Level:</strong> {match.salaryIndia?.senior || '₹20-50 LPA'}</p>
                                                        </div>
                                                        <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                                                            <p className="font-semibold text-blue-800">🌍 Abroad (USD)</p>
                                                            <p><strong>Entry Level:</strong> {match.salaryAbroad?.entry || '$50K-80K'}</p>
                                                            <p><strong>Mid Level:</strong> {match.salaryAbroad?.mid || '$80K-150K'}</p>
                                                            <p><strong>Senior Level:</strong> {match.salaryAbroad?.senior || '$150K-300K+'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Market Trends */}
                                            <div className="mt-4">
                                                <div className="text-sm leading-6 bg-white/80 p-3 rounded-lg border border-slate-200/80">
                                                    <p><strong className="font-semibold text-slate-600">Market Trends:</strong> {match.trends}</p>
                                                </div>
                                            </div>

                                            {/* Ready to Start - Responsive Design */}
                                            <div className="mt-6">
                                                {/* Mobile Simple Version */}
                                                <div className="block lg:hidden">
                                                    <div className="bg-indigo-600 rounded-lg p-4 text-center">
                                                        <h3 className="text-lg font-bold text-white mb-2">Ready to Start?</h3>
                                                        <p className="text-white/90 text-sm mb-4">Get your personalized roadmap</p>
                                                        <button
                                                            onClick={() => handleGeneratePathway(match.title, index)}
                                                            className={`${
                                                                index === 0 || isProUser 
                                                                    ? 'bg-white text-indigo-600 hover:bg-gray-50' 
                                                                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
                                                            } px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 w-full relative overflow-hidden`}
                                                        >
                                                            {index === 0 || isProUser ? (
                                                                <>
                                                                    <MapIcon className="h-6 w-7" />
                                                                    <span>Generate My Pathway</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <LockIcon className="h-5 w-5" />
                                                                    <span>Upgrade to Pro</span>
                                                                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
                                                                        PRO
                                                                    </div>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Desktop Full Version */}
                                                <div className="hidden lg:block">
                                                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-2xl p-6 shadow-xl border border-white/20">
                                                        {/* Background Pattern */}
                                                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                                                        
                                                        <div className="relative z-10 flex flex-row items-center justify-between gap-6">
                                                            <div className="flex-1 text-left">
                                                                <div className="flex items-center justify-start mb-3">
                                                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
                                                                        <MapIcon className="h-6 w-6 text-white" />
                                                                    </div>
                                                                    <h3 className="text-2xl font-bold text-white">Ready to Start Your Journey?</h3>
                                                                </div>
                                                                <p className="text-white/90 text-base leading-relaxed mb-4">
                                                                    Get your personalized step-by-step roadmap tailored to your background and goals. 
                                                                    Transform your career aspirations into actionable milestones.
                                                                </p>
                                                                <div className="flex items-center justify-start space-x-4 text-sm text-white/80">
                                                                    <div className="flex items-center">
                                                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                                                        <span>AI-Powered</span>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                                                        <span>Personalized</span>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                                                                        <span>Actionable</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex-shrink-0">
                                                                <button
                                                                    onClick={() => handleGeneratePathway(match.title, index)}
                                                                    className={`group relative ${
                                                                        index === 0 || isProUser 
                                                                            ? 'bg-white text-indigo-600 hover:text-indigo-700' 
                                                                            : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
                                                                    } px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 min-w-[200px] overflow-hidden`}
                                                                >
                                                                    {index === 0 || isProUser ? (
                                                                        <>
                                                                            <div className="flex items-center justify-center space-x-3">
                                                                                <MapIcon className="h-6 w-7 group-hover:rotate-12 transition-transform duration-300" />
                                                                                <span>Generate My Pathway</span>
                                                                            </div>
                                                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="flex items-center justify-center space-x-3">
                                                                                <LockIcon className="h-6 w-7" />
                                                                                <span>Upgrade to Pro</span>
                                                                            </div>
                                                                            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-bl-xl font-bold">
                                                                                PRO
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>
            </div>
            
            <div className="p-4 md:p-8 bg-slate-50 rounded-none print:p-6 print:shadow-none print:bg-white w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <SectionCard icon={<LightbulbIcon className="h-8 w-8 text-yellow-500" />} title="Dominant Strengths">
                        <div className="space-y-4">
                            {report.strengths?.map((strength, index) => (
                                <div key={index} className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                                    <p className="font-bold text-yellow-900">{strength.title}</p>
                                    <p className="text-sm text-slate-700 mt-1">{strength.description}</p>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                    <SectionCard icon={<GrowthIcon className="h-8 w-8 text-green-500" />} title="Development Plan">
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-md text-slate-700 flex items-center mb-3"><TargetIcon className="h-5 w-5 text-red-500 mr-2"/>Areas for Improvement</h4>
                                <div className="space-y-3">
                                    {report.developmentPlan?.areasForImprovement?.map((area, index) => (
                                        <div key={index} className="bg-red-50 p-3 rounded-lg">
                                            <p className="font-bold text-red-900 text-sm">{area.title}</p>
                                            <p className="text-xs text-slate-600">{area.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-md text-slate-700 mb-3">Actionable Recommendations</h4>
                                <div className="space-y-3">
                                    {report.developmentPlan?.recommendations?.map((rec, index) => (
                                        <div key={index} className="flex items-start bg-green-50 p-3 rounded-lg">
                                            <RecommendationIcon type={rec.type} />
                                            <div>
                                                <p className="font-bold text-green-900 text-sm">{rec.type}</p>
                                                <p className="text-xs text-slate-600">{rec.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SectionCard>
                </div>
                <SectionCard icon={<TargetIcon className="h-8 w-8 text-blue-500" />} title="In-Depth Analysis">
                    <DetailedScores scores={scores} analysis={report.detailedAnalyses} />
                </SectionCard>
            </div>

            <div className="p-4 md:p-8 bg-slate-50 rounded-none print:p-6 print:shadow-none print:bg-white w-full">
                <SectionCard icon={<FlagIcon className="h-8 w-8 text-indigo-500" />} title="Your Journey Forward">
                    <p className="leading-relaxed text-lg">{report.concludingRemarks}</p>
                </SectionCard>
            </div>
            </div>
        </div>
      </div>

      {/* Pathway Planner Modal */}
      {pathwayCareer && (
        <PathwayPlannerModal
          isOpen={!!pathwayCareer}
          onClose={handleClosePathway}
          careerTitle={pathwayCareer}
          userData={userData}
        />
      )}

      {/* Upgrade to Pro Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative shadow-2xl">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <LockIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Unlock Career Pathways</h3>
              <p className="text-gray-600">
                Get personalized roadmaps for all your top career matches with our Pro plan!
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-800 mb-4">Pro Features Include:</h4>
              <div className="grid grid-cols-1 gap-2 text-left text-sm text-gray-700">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>2 Assessment Tokens</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>50+ Page Detailed Reports</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Advanced Career Insights</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Unlimited AI Career Coach</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>AI Chat Memory & Context</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Save & Download Reports</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Priority Support</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Career Roadmap Planning</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Industry Trend Analysis</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  if (onNavigateToPricing) {
                    onNavigateToPricing();
                  } else {
                    // Fallback navigation
                    window.location.href = '#pricing';
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Upgrade to Pro - ₹99
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors duration-200"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
