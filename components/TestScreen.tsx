import React, { useState, useEffect } from 'react';
import { type Answer, type UserData, type Question } from '../types';
import { generateTestQuestions } from '../services/geminiService';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, AlertTriangleIcon } from './icons';

interface TestScreenProps {
  onTestComplete: (answers: Answer[], questions: Question[]) => void;
  userData: UserData;
}

const QuestionLoader: React.FC = () => (
    <div className="text-center py-12">
        <div className="relative mx-auto w-16 h-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <img 
                    src="https://i.postimg.cc/7LzzxY0t/3c95258d-781d-4c26-b284-cf0a52b8e28e-removalai-preview.png" 
                    alt="FindWay.ai Logo" 
                    className="h-8 w-8 object-contain"
                />
            </div>
        </div>
        <p className="mt-6 text-gray-300 text-xl">Generating your personalized assessment...</p>
        <p className="text-gray-400 mt-2">This may take a moment.</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string; onRetry: () => void; }> = ({ message, onRetry }) => (
    <div className="text-center py-12">
        <AlertTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white">Something Went Wrong</h3>
        <p className="text-gray-400 my-4">{message}</p>
        <button onClick={onRetry} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all duration-300 hover:scale-105">
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
      return <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto"><QuestionLoader /></div>;
  }
  
  if (error) {
      return <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto"><ErrorDisplay message={error} onRetry={fetchQuestions} /></div>;
  }
  
  if (questions.length === 0) {
      return <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto"><ErrorDisplay message="No questions were generated." onRetry={fetchQuestions} /></div>;
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const currentSelectedIndex = selectedOptions[currentQuestion.id];
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-4 sm:p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-bold text-blue-400">{progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div className="bg-blue-500 h-3 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/25" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Question */}
      <div className="text-center min-h-[80px] sm:min-h-[100px] flex items-center justify-center">
        <h3 className="text-lg sm:text-2xl font-semibold text-white leading-relaxed px-2">{currentQuestion.text}</h3>
      </div>
      
      {/* Options */}
      <div className="my-8 space-y-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={`${currentQuestion.id}-${index}`}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full text-left p-3 sm:p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg text-sm sm:text-base ${
              currentSelectedIndex === index
                ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-semibold shadow-lg shadow-blue-500/25'
                : 'bg-gray-700/50 border-gray-600 hover:border-blue-400 text-gray-300 hover:bg-gray-700/70'
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-10 gap-4">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base"
        >
          <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
          Back
        </button>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleFinish}
            disabled={!areAllQuestionsAnswered()}
            className="flex items-center px-4 sm:px-8 py-3 sm:py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-green-500/25 hover:scale-105 text-sm sm:text-base"
          >
            <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Finish & See Report</span>
            <span className="sm:hidden">Finish</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={currentSelectedIndex === undefined}
            className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            Next
            <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};
