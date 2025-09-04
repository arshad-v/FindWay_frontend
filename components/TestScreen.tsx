import React, { useState, useEffect } from 'react';
import { type Answer, type UserData, type Question } from '../types';
import { generateTestQuestions } from '../services/geminiService';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, AlertTriangleIcon } from './icons';

interface TestScreenProps {
  onTestComplete: (answers: Answer[], questions: Question[]) => void;
  userData: UserData;
}

const QuestionLoader: React.FC = () => (
    <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-slate-600 text-lg">Generating your personalized assessment...</p>
        <p className="text-slate-500">This may take a moment.</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string; onRetry: () => void; }> = ({ message, onRetry }) => (
    <div className="text-center py-10">
        <AlertTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800">Something Went Wrong</h3>
        <p className="text-slate-600 my-2">{message}</p>
        <button onClick={onRetry} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Try Again
        </button>
    </div>
);

export const TestScreen: React.FC<TestScreenProps> = ({ onTestComplete, userData }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [questionId: number]: number }>({});

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const generatedQuestions = await generateTestQuestions(userData);
        setQuestions(generatedQuestions);
    } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  };
  
  useEffect(() => {
      fetchQuestions();
  }, [userData]);


  const handleAnswerSelect = (optionIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    setSelectedOptions(prev => {
        const newSelections = {...prev};
        if (newSelections[currentQuestion.id] === optionIndex) {
            delete newSelections[currentQuestion.id];
        } else {
            newSelections[currentQuestion.id] = optionIndex;
        }
        return newSelections;
    });
  };


  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    const finalAnswers: Answer[] = Object.entries(selectedOptions).map(([questionIdStr, optionIndex]) => {
        const questionId = parseInt(questionIdStr, 10);
        const question = questions.find(q => q.id === questionId);
        return {
            questionId: questionId,
            value: question!.options[optionIndex].value
        };
    });
    onTestComplete(finalAnswers, questions);
  };
  
  const areAllQuestionsAnswered = () => Object.keys(selectedOptions).length === questions.length;

  if (isLoading) {
      return <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto"><QuestionLoader /></div>;
  }
  
  if (error) {
      return <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto"><ErrorDisplay message={error} onRetry={fetchQuestions} /></div>;
  }
  
  if (questions.length === 0) {
      return <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto"><ErrorDisplay message="No questions were generated." onRetry={fetchQuestions} /></div>;
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const currentSelectedIndex = selectedOptions[currentQuestion.id];
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-bold text-indigo-600">{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Question */}
      <div className="text-center min-h-[100px] flex items-center justify-center">
        <h3 className="text-2xl font-semibold text-slate-800">{currentQuestion.text}</h3>
      </div>
      
      {/* Options */}
      <div className="my-8 space-y-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={`${currentQuestion.id}-${index}`}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-[1.02] ${
              currentSelectedIndex === index
                ? 'bg-indigo-100 border-indigo-500 text-indigo-800 font-semibold'
                : 'bg-white border-slate-300 hover:border-indigo-400'
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-10">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className="flex items-center px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleFinish}
            disabled={!areAllQuestionsAnswered()}
            className="flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <CheckIcon className="h-5 w-5 mr-2" />
            Finish & See Report
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={currentSelectedIndex === undefined}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};
