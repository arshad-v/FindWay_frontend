import React from 'react';
import { ArrowRightIcon, AlertTriangleIcon, LightbulbIcon, BriefcaseIcon, GrowthIcon, CompassIcon, StarIcon, ZapIcon } from './icons';
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import LightRays from './LightRays';
import TextType from './TextType';

interface HomeScreenProps {
  onStartTest: () => void;
  error?: string | null;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay?: string }> = ({ icon, title, children, delay = "0s" }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm p-4 sm:p-8 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group`}>
        <div className="flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-blue-500/10 mb-4 sm:mb-6 group-hover:bg-blue-500/20 transition-all duration-300">
            {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{children}</p>
    </div>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartTest, error }) => {
  return (
    <div className="bg-black relative min-h-screen w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative text-center py-20 sm:py-24 md:py-40 overflow-hidden bg-black">
            {/* Light Rays Background */}
            <div className="absolute inset-0 w-full h-full">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#00ffff"
                    raysSpeed={1.5}
                    lightSpread={0.6}
                    rayLength={2.5}
                    followMouse={true}
                    mouseInfluence={0.15}
                    noiseAmount={0.05}
                    distortion={0.08}
                    fadeDistance={1.5}
                    saturation={1.2}
                    className="hero-light-rays"
                />
            </div>
            <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-10 sm:pt-0">
                <div className="h-[4.5rem] sm:h-auto">
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white mb-8 sm:mb-8 md:mb-10 tracking-tight leading-tight">
                        <TextType 
                            text={["Discover Your Future Career", "Find Your Perfect Path", "Shape Your Dream Career"]}
                            typingSpeed={75}
                            pauseDuration={1500}
                            showCursor={true}
                            cursorCharacter="|"
                            cursorClassName="text-blue-400"
                            textColors={["#ffffff", "#60a5fa", "#34d399"]}
                            as="span"
                            className="inline-block text-center w-full"
                            startOnVisible={true}
                            loop={true}
                        />
                    </h1>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mt-4 sm:mt-0 mb-12 sm:mb-12 leading-relaxed px-2">
                    Stop guessing. Start knowing. Our AI-driven assessment provides deep, personalized insights to guide you toward a career you'll love.
                </p>

                {error && (
                    <div className="max-w-xl mx-auto bg-red-900/20 border border-red-500/50 backdrop-blur-sm p-6 mb-12 sm:mb-8 text-left rounded-xl">
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
                    <SignedOut>
                        <SignInButton>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 sm:py-5 sm:px-12 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center w-auto mx-auto group relative overflow-hidden text-base sm:text-lg">
                                <ZapIcon className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                                <span className="hidden sm:inline">Start Your Free Assessment</span>
                                <span className="sm:hidden">Start Assessment</span>
                                <ArrowRightIcon className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <button
                            onClick={onStartTest}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 sm:py-5 sm:px-12 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center w-auto mx-auto group relative overflow-hidden text-base sm:text-lg"
                        >
                            <ZapIcon className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="hidden sm:inline">Start Your Free Assessment</span>
                            <span className="sm:hidden">Start Assessment</span>
                            <ArrowRightIcon className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                    </SignedIn>
                    <p className="text-gray-400 mt-3 sm:mt-4 text-xs sm:text-sm px-5">✨ Quick signup • Takes 5 minutes • Instant results</p>
                </div>

                {/* Logo for Mobile, App Name for Web */}
                <div className="relative mt-0.05 pointer-events-none opacity-10">
                    <div className="block sm:hidden mb-32">
                        {/* Mobile: Show only logo */}
                        <div className="flex justify-center px-4">
                            <img
                                src="https://i.postimg.cc/7LzzxY0t/3c95258d-781d-4c26-b284-cf0a52b8e28e-removalai-preview.png"
                                alt="FindWay.ai Logo"
                                className="h-[8rem] w-auto"
                            />
                        </div>
                    </div>
                    {/* Web: Show only app name */}
                    <div className="hidden sm:flex justify-center px-4 sm:px-10">
                        <div className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-extrabold text-gray-500 whitespace-nowrap">
                            <span>FindWay</span><span>.ai</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 sm:py-20 md:py-32 relative">
            <div className="container mx-auto px-4 sm:px-6 text-center">
                <div>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Why Choose FindWay.ai?</h2>
                    <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto mb-8 sm:mb-16 leading-relaxed px-2">We go beyond simple quizzes to provide a holistic view of your potential with cutting-edge AI technology.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 text-left">
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

        {/* Comprehensive Assessment Features */}
        <section className="py-12 sm:py-20 md:py-32 bg-black">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Comprehensive Career Assessment</h2>
                    <p className="text-base sm:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed px-2">
                        Our multi-dimensional assessment evaluates every aspect of your professional potential through scientifically-backed methodologies.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-700/50">
                        <div className="flex items-center mb-6">
                            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mr-4">
                                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.53-1.053l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-white">Psychometric Analysis</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Deep psychological profiling using validated psychometric instruments to understand your personality traits, cognitive patterns, and behavioral tendencies.
                        </p>
                        <ul className="text-sm text-gray-300 space-y-2">
                            <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>Big Five Personality Assessment</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>Cognitive Style Analysis</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>Work Preference Evaluation</li>
                        </ul>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-700/50">
                        <div className="flex items-center mb-6">
                            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-green-500/10 flex items-center justify-center mr-4">
                                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-white">Aptitude Testing</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Comprehensive evaluation of your natural abilities and cognitive strengths across multiple domains to identify your peak performance areas.
                        </p>
                        <ul className="text-sm text-gray-300 space-y-2">
                            <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>Logical & Analytical Reasoning</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>Numerical & Spatial Intelligence</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>Verbal & Communication Skills</li>
                        </ul>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-700/50">
                        <div className="flex items-center mb-6">
                            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mr-4">
                                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-white">Interest Profiling</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Detailed exploration of your passions, motivations, and career interests using Holland's RIASEC model and modern interest inventories.
                        </p>
                        <ul className="text-sm text-gray-300 space-y-2">
                            <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>Career Interest Mapping</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>Industry Preference Analysis</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>Work Environment Matching</li>
                        </ul>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-700/50">
                        <div className="flex items-center mb-6">
                            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mr-4">
                                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-white">Skill Assessment</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Comprehensive evaluation of your current competencies, transferable skills, and learning potential across technical and soft skill domains.
                        </p>
                        <ul className="text-sm text-gray-300 space-y-2">
                            <li className="flex items-center"><span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>Technical Skill Proficiency</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>Soft Skills Evaluation</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>Learning Agility Assessment</li>
                        </ul>
                    </div>
                </div>

                {/* PDF Report Feature */}
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-8 sm:p-12 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-blue-500/20 flex items-center justify-center">
                            <svg className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">Downloadable PDF Career Report</h3>
                    <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
                        Receive a comprehensive, professionally formatted PDF report containing all your assessment results, career recommendations, and personalized development roadmap.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-600/50">
                            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">25+</div>
                            <div className="text-sm text-gray-300">Pages of Insights</div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-600/50">
                            <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">50+</div>
                            <div className="text-sm text-gray-300">Career Matches</div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-600/50">
                            <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">10+</div>
                            <div className="text-sm text-gray-300">Skill Categories</div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-600/50">
                            <div className="text-2xl sm:text-3xl font-bold text-orange-400 mb-2">∞</div>
                            <div className="text-sm text-gray-300">Lifetime Access</div>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm text-gray-300">
                        <span className="bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-600/50">📊 Visual Charts & Graphs</span>
                        <span className="bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-600/50">🎯 Personalized Action Plan</span>
                        <span className="bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-600/50">📚 Resource Recommendations</span>
                        <span className="bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-600/50">💼 Interview Preparation Tips</span>
                    </div>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-32 bg-black">
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
        <section className="py-20 md:py-32 bg-black">
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
        <section id="contact" className="py-20 md:py-32 bg-black text-white relative overflow-hidden">
            <div className="container mx-auto px-6 text-center relative z-10">
                <div>
                    <StarIcon className="h-16 w-16 text-yellow-400 mx-auto mb-8" />
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Find Your Way?</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">Your future is waiting. Start the free assessment now and take the first step towards a confident career choice.</p>
                </div>
                <div>
                    <SignedOut>
                        <SignInButton>
                            <button className="bg-white text-gray-900 font-bold py-5 px-12 rounded-2xl shadow-2xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center w-auto mx-auto group relative overflow-hidden text-lg">
                                Get Started Now
                                <ArrowRightIcon className="ml-3 h-6 w-6" />
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <button
                            onClick={onStartTest}
                            className="bg-white text-gray-900 font-bold py-5 px-12 rounded-2xl shadow-2xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center w-auto mx-auto group relative overflow-hidden text-lg"
                        >
                            Get Started Now
                            <ArrowRightIcon className="ml-3 h-6 w-6" />
                        </button>
                    </SignedIn>
                    <p className="text-gray-400 mt-6 text-sm">Join thousands of students who've discovered their perfect career path</p>
                </div>
            </div>
        </section>
    </div>
  );
};
