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

        {/* Discord Community Section */}
        <section className="py-20 md:py-32 bg-gray-800/50">
            <div className="container mx-auto px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center mb-8">
                        <svg className="h-16 w-16 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Join Our Community</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Connect with like-minded students, share your career journey, get advice from peers, and stay updated with the latest career insights.
                    </p>
                    <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl max-w-2xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-left">
                                <h3 className="text-2xl font-bold text-white mb-2">Discord Community</h3>
                                <p className="text-gray-400">Join thousands of students discovering their career paths</p>
                                <div className="flex items-center mt-4 space-x-4 text-sm text-gray-300">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        <span>5,000+ Members</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        <span>24/7 Active</span>
                                    </div>
                                </div>
                            </div>
                            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                </svg>
                                Join Discord
                            </button>
                        </div>
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
