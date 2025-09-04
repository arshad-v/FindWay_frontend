import React from 'react';
import { ArrowRightIcon, AlertTriangleIcon, LightbulbIcon, BriefcaseIcon, GrowthIcon } from './icons';

interface HomeScreenProps {
  onStartTest: () => void;
  error?: string | null;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm">{children}</p>
    </div>
);


export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartTest, error }) => {
  return (
    <div className="bg-slate-50">
        {/* Hero Section */}
        <section className="text-center py-20 md:py-32 bg-gradient-to-b from-indigo-50 to-slate-50">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-4 tracking-tight">
                    Discover Your Future Career Path, Today.
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                    Stop guessing. Start knowing. Our AI-driven assessment provides deep, personalized insights to guide you toward a career you'll love.
                </p>
                 {error && (
                    <div className="max-w-xl mx-auto bg-red-50 border-l-4 border-red-400 p-4 mb-6 text-left">
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
                <button
                    onClick={onStartTest}
                    className="bg-indigo-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-auto mx-auto group"
                    >
                    Start Your Free Assessment
                    <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose FindWay.ai?</h2>
                <p className="text-slate-600 max-w-2xl mx-auto mb-12">We go beyond simple quizzes to provide a holistic view of your potential.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <FeatureCard icon={<LightbulbIcon className="h-6 w-6 text-indigo-600" />} title="AI-Powered Insights">
                        Leverage the power of generative AI to analyze your unique traits and receive nuanced feedback you won't find anywhere else.
                    </FeatureCard>
                     <FeatureCard icon={<BriefcaseIcon className="h-6 w-6 text-indigo-600" />} title="Personalized Career Matches">
                        Get matched with careers that align with your personality, interests, and aptitude, complete with compatibility scores.
                    </FeatureCard>
                     <FeatureCard icon={<GrowthIcon className="h-6 w-6 text-indigo-600" />} title="Actionable Development Plan">
                        Receive a custom roadmap for growth, including recommended resources, habits, and exercises to help you succeed.
                    </FeatureCard>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-slate-50">
             <div className="container mx-auto px-4">
                <div className="text-center">
                     <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Journey in 3 Simple Steps</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto mb-12">Quick, easy, and insightful. Get your personalized report in minutes.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-6">
                        <div className="bg-indigo-200 text-indigo-800 font-bold rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4 text-xl">1</div>
                        <h3 className="text-xl font-bold mb-2">Take the Assessment</h3>
                        <p className="text-slate-600">Answer a series of dynamic, AI-generated questions designed to understand you better.</p>
                    </div>
                     <div className="text-center p-6">
                        <div className="bg-indigo-200 text-indigo-800 font-bold rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4 text-xl">2</div>
                        <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
                        <p className="text-slate-600">Our advanced model processes your responses to build a comprehensive personal and professional profile.</p>
                    </div>
                     <div className="text-center p-6">
                        <div className="bg-indigo-200 text-indigo-800 font-bold rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4 text-xl">3</div>
                        <h3 className="text-xl font-bold mb-2">Receive Your Report</h3>
                        <p className="text-slate-600">Unlock a detailed report with career matches, strengths, and a personalized development plan.</p>
                    </div>
                </div>
            </div>
        </section>

         {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-indigo-600 text-white">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Way?</h2>
                <p className="text-indigo-200 max-w-2xl mx-auto mb-8">Your future is waiting. Start the free assessment now and take the first step towards a confident career choice.</p>
                 <button
                    onClick={onStartTest}
                    className="bg-white text-indigo-600 font-bold py-4 px-10 rounded-lg shadow-lg hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-auto mx-auto group"
                    >
                    Get Started Now
                    <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
            </div>
        </section>
    </div>
  );
};
