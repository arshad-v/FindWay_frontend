import React, { useState, useCallback, useEffect } from 'react';
import { HomeScreen } from './components/WelcomeScreen';
import { PreTestScreen } from './components/PreTestScreen';
import { TestScreen } from './components/TestScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ReportScreen } from './components/ReportScreen';
import { PricingScreen } from './components/PricingScreen';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { type AppState, type Answer, type ReportData, type UserData, type RawScores, Question } from './types';
import { calculateScores } from './utils/scoreCalculator';
import { generateCareerReport } from './services/geminiService';
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

const App: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [appState, setAppState] = useState<AppState | 'pricing'>('home');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [scores, setScores] = useState<RawScores | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartTest = useCallback(() => {
    // Check if Clerk is loaded
    if (!isLoaded) {
      setError("Authentication is loading. Please wait a moment.");
      return;
    }
    
    if (!isSignedIn) {
      // Redirect to Clerk authentication - this will be handled by SignInButton
      return;
    }

    // User is signed in, proceed with the test
    setError(null);
    setAppState('pre-test');
    setUserData(null);
    setScores(null);
    setReport(null);
  }, [isSignedIn, isLoaded]);

  // This effect guards against invalid state transitions that could cause render loops.
  useEffect(() => {
    if (appState === 'test' && !userData) {
      console.warn("Invalid state: trying to access test without user data. Resetting.");
      handleStartTest();
    } else if (appState === 'report' && (!report || !scores || !userData)) {
      // If we are in 'report' state but have no data, it's an invalid state.
      // We check localStorage to see if this is an initial load that might succeed.
      // If there's nothing in storage, it's a true error, so we reset.
      const hasSessionData = localStorage.getItem('findway_last_report');
      if (!hasSessionData) {
        console.warn("Invalid state: trying to access report without data. Resetting.");
        handleStartTest();
      }
    }
  }, [appState, userData, report, scores, handleStartTest]);


  const handleTestComplete = useCallback(async (answers: Answer[], questions: Question[]) => {
    if (!userData) {
      setError("User data is missing. Please restart the assessment.");
      setAppState('home');
      return;
    }
    setAppState('loading');
    setError(null);
    try {
      const calculatedScores = calculateScores(answers, questions);
      setScores(calculatedScores);
      
      // Save to local storage to simulate history
      localStorage.setItem('findway_last_userdata', JSON.stringify(userData));
      localStorage.setItem('findway_last_scores', JSON.stringify(calculatedScores));

      const generatedReport = await generateCareerReport(calculatedScores, userData);
      // Add a more robust check for a valid report structure
      if (generatedReport && generatedReport.profileSummary && Array.isArray(generatedReport.careerMatches)) {
        setReport(generatedReport);
        localStorage.setItem('findway_last_report', JSON.stringify(generatedReport));
        setAppState('report');
      } else {
        console.error("Received invalid report structure from AI:", generatedReport);
        throw new Error("The AI model did not return a valid report. The structure was incorrect.");
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate your report. Please try again. Error: ${errorMessage}`);
      setAppState('home'); 
    }
  }, [userData]);
  
  const handlePreTestComplete = useCallback((data: UserData) => {
    setUserData(data);
    setAppState('test');
  }, []);

  const handleRetakeTest = useCallback(() => {
    handleStartTest();
  }, [handleStartTest]);

  const handleGoHome = useCallback(() => {
    setAppState('home');
    setUserData(null);
    setScores(null);
    setReport(null);
    setError(null);
  }, []);

  const handleViewReport = useCallback(() => {
    // Check if Clerk is loaded
    if (!isLoaded) {
      setError("Authentication is loading. Please wait a moment.");
      return;
    }
    
    if (!isSignedIn) {
      setError("Please sign in to view your report.");
      return;
    }

    // Check if we have existing report data
    if (report && scores && userData) {
      setAppState('report');
      setError(null);
    } else {
      // Try to load from localStorage or show error
      const savedUserData = localStorage.getItem('findway_userData');
      const savedScores = localStorage.getItem('findway_scores');
      const savedReport = localStorage.getItem('findway_report');
      
      if (savedUserData && savedScores && savedReport) {
        try {
          setUserData(JSON.parse(savedUserData));
          setScores(JSON.parse(savedScores));
          setReport(JSON.parse(savedReport));
          setAppState('report');
          setError(null);
        } catch (e) {
          console.error('Error loading saved data:', e);
          setError("Unable to load your previous report. Please take the assessment again.");
        }
      } else {
        // Navigate to report page with error
        setAppState('report');
        setError("No previous report found. Please take the assessment first.");
      }
    }
  }, []);

  const handlePricing = useCallback(() => {
    setAppState('pricing');
    setError(null);
  }, []);
  
  // Initialize app state on mount
  useEffect(() => {
    // Ensure we start on home page
    setAppState('home');
    setUserData(null);
    setScores(null);
    setReport(null);
    setError(null);
  }, []);


  const renderContent = () => {
    switch (appState) {
      case 'home':
        return <HomeScreen onStartTest={handleStartTest} error={error} />;
      case 'pre-test':
        return <div className="container mx-auto px-4 py-8"><PreTestScreen onComplete={handlePreTestComplete} onBack={() => setAppState('home')} /></div>;
      case 'test':
        if (userData) {
          return <div className="container mx-auto px-4 py-8"><TestScreen onTestComplete={handleTestComplete} userData={userData} /></div>;
        }
        // Fallback handled by useEffect, show a loader
        return <div className="container mx-auto px-4 py-8"><LoadingScreen /></div>;
      case 'loading':
         return <div className="container mx-auto px-4 py-8"><LoadingScreen /></div>;
      case 'pricing':
        return <PricingScreen onBack={() => setAppState('home')} />;
      case 'report':
        if (report && scores && userData) {
          return <ReportScreen report={report} scores={scores} userData={userData} onRetake={handleRetakeTest} />;
        }
        // Show error message on report page when no report is available
        return (
          <div className="container mx-auto px-4 py-8 text-center">
            <div className="max-w-xl mx-auto bg-red-900/20 border border-red-500/50 backdrop-blur-sm p-6 mb-8 text-left rounded-xl">
              <div className="flex">
                <div className="py-1">
                  <svg className="h-6 w-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-red-400">An Error Occurred</p>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleStartTest}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-300"
            >
              Take Assessment
            </button>
          </div>
        );
      default:
        return <HomeScreen onStartTest={handleStartTest} />;
    }
  };

  const isReportScreen = appState === 'report';
  const isHomeScreen = appState === 'home';

  return (
    <div className="bg-black min-h-screen text-gray-100 flex flex-col w-full overflow-x-hidden">
      <Header onStartTest={handleStartTest} onGoHome={handleGoHome} onViewReport={handleViewReport} onPricing={handlePricing} />
      <main className="flex-grow">
        <SignedIn>
          {renderContent()}
        </SignedIn>
        <SignedOut>
          {appState === 'home' || appState === 'pricing' ? renderContent() : <HomeScreen onStartTest={handleStartTest} error={error} />}
        </SignedOut>
      </main>
      {!isReportScreen && <Footer />}
    </div>
  );
};

export default App;