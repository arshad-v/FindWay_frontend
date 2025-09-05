import React from 'react';
import { ArrowRightIcon, AlertTriangleIcon, LightbulbIcon, BriefcaseIcon, GrowthIcon, CompassIcon, StarIcon, ZapIcon } from './icons';

interface HomeScreenProps {
  onStartTest: () => void;
  error?: string | null;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay?: string }> = ({ icon, title, children, delay = "0s" }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group`}>
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-500/10 mb-6 group-hover:bg-blue-500/20 transition-all duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{children}</p>
    </div>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartTest, error }) => {
  return (
    <div className="bg-gray-900 relative">
        {/* Hero Section */}
        <section className="relative text-center py-24 md:py-40 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div>
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <CompassIcon className="h-20 w-20 text-blue-400" />
                        </div>
                    </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                    Discover Your Future
                    <span className="block text-blue-400">
                        Career Path
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                    Stop guessing. Start knowing. Our AI-driven assessment provides deep, personalized insights to guide you toward a career you'll love.
                </p>
                 {error && (
                    <div className="max-w-xl mx-auto bg-red-900/20 border border-red-500/50 backdrop-blur-sm p-6 mb-8 text-left rounded-xl">
                        <div className="flex">
                            <div className="py-1">
                               <AlertTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
                            </div>
                            <div>
                                <p className="font-bold text-red-400">An Error Occurred</p>
                                <p className="text-sm text-red-300">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
                <div>
                    <button
                        onClick={onStartTest}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 px-12 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center w-auto mx-auto group relative overflow-hidden text-lg"
                        >
                        <ZapIcon className="mr-3 h-6 w-6" />
                        Start Your Free Assessment
                        <ArrowRightIcon className="ml-3 h-6 w-6" />
                    </button>
                    <p className="text-gray-400 mt-4 text-sm">✨ No signup required • Takes 5 minutes • Instant results</p>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 relative">
            <div className="container mx-auto px-6 text-center">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose FindWay.ai?</h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed">We go beyond simple quizzes to provide a holistic view of your potential with cutting-edge AI technology.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <FeatureCard icon={<LightbulbIcon className="h-8 w-8 text-blue-400" />} title="AI-Powered Insights" delay="0.1s">
                        Leverage the power of generative AI to analyze your unique traits and receive nuanced feedback you won't find anywhere else.
                    </FeatureCard>
                     <FeatureCard icon={<BriefcaseIcon className="h-8 w-8 text-blue-400" />} title="Personalized Career Matches" delay="0.2s">
                        Get matched with careers that align with your personality, interests, and aptitude, complete with compatibility scores.
                    </FeatureCard>
                     <FeatureCard icon={<GrowthIcon className="h-8 w-8 text-blue-400" />} title="Actionable Development Plan" delay="0.3s">
                        Receive a custom roadmap for growth, including recommended resources, habits, and exercises to help you succeed.
                    </FeatureCard>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-32 bg-gray-800/30 backdrop-blur-sm">
             <div className="container mx-auto px-6">
                <div className="text-center">
                     <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Your Journey in 3 Simple Steps</h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed">Quick, easy, and insightful. Get your personalized report in minutes.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center p-8">
                        <div className="relative mb-8">
                            <div className="bg-blue-500 text-white font-bold rounded-2xl h-16 w-16 flex items-center justify-center mx-auto text-2xl shadow-lg">1</div>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Take the Assessment</h3>
                        <p className="text-gray-400 leading-relaxed">Answer a series of dynamic, AI-generated questions designed to understand you better.</p>
                    </div>
                     <div className="text-center p-8">
                        <div className="relative mb-8">
                            <div className="bg-blue-500 text-white font-bold rounded-2xl h-16 w-16 flex items-center justify-center mx-auto text-2xl shadow-lg">2</div>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">AI Analysis</h3>
                        <p className="text-gray-400 leading-relaxed">Our advanced model processes your responses to build a comprehensive personal and professional profile.</p>
                    </div>
                     <div className="text-center p-8">
                        <div className="relative mb-8">
                            <div className="bg-blue-500 text-white font-bold rounded-2xl h-16 w-16 flex items-center justify-center mx-auto text-2xl shadow-lg">3</div>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Receive Your Report</h3>
                        <p className="text-gray-400 leading-relaxed">Unlock a detailed report with career matches, strengths, and a personalized development plan.</p>
                    </div>
                </div>
            </div>
        </section>

         {/* Final CTA Section */}
        <section id="contact" className="py-20 md:py-32 bg-gray-950 text-white relative overflow-hidden">
            <div className="container mx-auto px-6 text-center relative z-10">
                <div>
                    <StarIcon className="h-16 w-16 text-yellow-400 mx-auto mb-8" />
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Find Your Way?</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">Your future is waiting. Start the free assessment now and take the first step towards a confident career choice.</p>
                </div>
                <div>
                    <button
                        onClick={onStartTest}
                        className="bg-white text-gray-900 font-bold py-5 px-12 rounded-2xl shadow-2xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center w-auto mx-auto group relative overflow-hidden text-lg"
                        >
                        Get Started Now
                        <ArrowRightIcon className="ml-3 h-6 w-6" />
                    </button>
                    <p className="text-gray-400 mt-6 text-sm">Join thousands of students who've discovered their perfect career path</p>
                </div>
            </div>
        </section>
    </div>
  );
};
