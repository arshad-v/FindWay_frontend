import React, { useState, useCallback, useEffect } from 'react';
import { HomeScreen } from './components/WelcomeScreen';
import { PreTestScreen } from './components/PreTestScreen';
import { TestScreen } from './components/TestScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ReportScreen } from './components/ReportScreen';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { type AppState, type Answer, type ReportData, type UserData, type RawScores, Question } from './types';
import { calculateScores } from './utils/scoreCalculator';
import { generateCareerReport } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('home');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [scores, setScores] = useState<RawScores | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartTest = useCallback(() => {
    setAppState('pre-test');
    setUserData(null);
    setScores(null);
    setReport(null);
    setError(null);
  }, []);

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
  
  // Try to load last session on initial render
  useEffect(() => {
    const lastUserDataStr = localStorage.getItem('findway_last_userdata');
    const lastScoresStr = localStorage.getItem('findway_last_scores');
    const lastReportStr = localStorage.getItem('findway_last_report');
    if (lastUserDataStr && lastScoresStr && lastReportStr) {
      try {
        const lastUserData = JSON.parse(lastUserDataStr);
        const lastScores = JSON.parse(lastScoresStr);
        const lastReport = JSON.parse(lastReportStr);
        
        // Add validation for localStorage data to prevent crashes on load
        if (lastReport && lastReport.profileSummary && Array.isArray(lastReport.careerMatches)) {
          setUserData(lastUserData);
          setScores(lastScores);
          setReport(lastReport);
          setAppState('report');
        } else {
          throw new Error("Invalid data structure in localStorage.");
        }
      } catch (e) {
        console.error("Failed to parse last session from localStorage", e);
        localStorage.removeItem('findway_last_userdata');
        localStorage.removeItem('findway_last_scores');
        localStorage.removeItem('findway_last_report');
      }
    }
  }, []);


  const renderContent = () => {
    switch (appState) {
      case 'home':
        return <HomeScreen onStartTest={handleStartTest} error={error} />;
      case 'pre-test':
        return <div className="container mx-auto px-4 py-8"><PreTestScreen onComplete={handlePreTestComplete} /></div>;
      case 'test':
        if (userData) {
          return <div className="container mx-auto px-4 py-8"><TestScreen onTestComplete={handleTestComplete} userData={userData} /></div>;
        }
        // Fallback handled by useEffect, show a loader
        return <div className="container mx-auto px-4 py-8"><LoadingScreen /></div>;
      case 'loading':
         return <div className="container mx-auto px-4 py-8"><LoadingScreen /></div>;
      case 'report':
        if (report && scores && userData) {
          return <ReportScreen report={report} scores={scores} userData={userData} onRetake={handleRetakeTest} />;
        }
        // Fallback handled by useEffect, show a loader
        return <div className="container mx-auto px-4 py-8"><LoadingScreen /></div>;
      default:
        return <HomeScreen onStartTest={handleStartTest} />;
    }
  };

  const isReportScreen = appState === 'report';
  const isHomeScreen = appState === 'home';

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 flex flex-col">
      {!isReportScreen && <Header onStartTest={isHomeScreen ? handleStartTest : undefined} />}
      <main className="flex-grow">
        {renderContent()}
      </main>
      {!isReportScreen && <Footer />}
    </div>
  );
};

export default App;