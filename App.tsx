import React, { useState, useCallback, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PreTestScreen } from './components/PreTestScreen';
import { TestScreen } from './components/TestScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ReportScreen } from './components/ReportScreen';
import { Header } from './components/Header';
import { type AppState, type Answer, type ReportData, type UserData, type RawScores, type Question } from './types';
import { calculateScores } from './utils/scoreCalculator';
import { getAiService } from './services/geminiService';

const aiService = getAiService();

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [scores, setScores] = useState<RawScores | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestComplete = useCallback(async (answers: Answer[]) => {
    if (!userData) {
      setError("User data is missing. Please restart the assessment.");
      setAppState('welcome');
      return;
    }
    setAppState('loading');
    setError(null);
    try {
      const calculatedScores = calculateScores(answers, questions);
      setScores(calculatedScores);
      
      localStorage.setItem('findway_last_userdata', JSON.stringify(userData));
      localStorage.setItem('findway_last_scores', JSON.stringify(calculatedScores));

      const generatedReport = await aiService.generateCareerReport(calculatedScores, userData);
      setReport(generatedReport);
      localStorage.setItem('findway_last_report', JSON.stringify(generatedReport));
      setAppState('report');
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate your report. Please try again. Error: ${errorMessage}`);
      setAppState('welcome'); 
    }
  }, [userData, questions]);

  const handleStartTest = useCallback(() => {
    setAppState('pre-test');
    setUserData(null);
    setScores(null);
    setReport(null);
    setQuestions([]);
    setError(null);
  }, []);
  
  const handlePreTestComplete = useCallback(async (data: UserData) => {
    setUserData(data);
    setAppState('generating-questions');
    setError(null);
    try {
        const generatedQuestions = await aiService.generateAssessmentQuestions(data);
        if (generatedQuestions.length === 0) {
            throw new Error("AI failed to generate questions.");
        }
        setQuestions(generatedQuestions);
        setAppState('test');
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Failed to generate a personalized assessment. Please try again. Error: ${errorMessage}`);
        setAppState('welcome');
    }
  }, []);

  const handleRetakeTest = useCallback(() => {
    handleStartTest();
  }, [handleStartTest]);
  
  useEffect(() => {
    const lastUserDataStr = localStorage.getItem('findway_last_userdata');
    const lastScoresStr = localStorage.getItem('findway_last_scores');
    const lastReportStr = localStorage.getItem('findway_last_report');
    if (lastUserDataStr && lastScoresStr && lastReportStr) {
      try {
        const lastUserData = JSON.parse(lastUserDataStr);
        const lastScores = JSON.parse(lastScoresStr);
        const lastReport = JSON.parse(lastReportStr);
        setUserData(lastUserData);
        setScores(lastScores);
        setReport(lastReport);
        setAppState('report');
      } catch (e) {
        console.error("Failed to parse last session from localStorage", e);
        localStorage.clear();
      }
    }
  }, []);


  const renderContent = () => {
    switch (appState) {
      case 'welcome':
        return <WelcomeScreen onStartTest={handleStartTest} error={error} />;
      case 'pre-test':
        return <PreTestScreen onComplete={handlePreTestComplete} />;
      case 'generating-questions':
        return <LoadingScreen message="Generating a personalized assessment for you..." />;
      case 'test':
        return <TestScreen questions={questions} onTestComplete={handleTestComplete} />;
      case 'loading':
        return <LoadingScreen />;
      case 'report':
        if (report && scores && userData) {
          return <ReportScreen report={report} scores={scores} onRetake={handleRetakeTest} />;
        }
        handleStartTest();
        return <WelcomeScreen onStartTest={handleStartTest} error="There was an issue loading your report. Please start a new test." />;
      default:
        return <WelcomeScreen onStartTest={handleStartTest} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
