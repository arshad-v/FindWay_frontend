import React, { useState, useMemo } from 'react';
import { type Answer, type Question } from '../types';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from './icons';

interface TestScreenProps {
  questions: Question[];
  onTestComplete: (answers: Answer[]) => void;
}

const likertOptions = [
    { text: "Strongly Disagree", value: 1 },
    { text: "Disagree", value: 2 },
    { text: "Neutral", value: 3 },
    { text: "Agree", value: 4 },
    { text: "Strongly Agree", value: 5 },
];

export const TestScreen: React.FC<TestScreenProps> = ({ questions, onTestComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  if (questions.length === 0) {
      return (
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-slate-800">No questions loaded.</h3>
            <p className="text-slate-600 mt-2">There might be an issue with generating your assessment. Please try again.</p>
        </div>
      );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  const handleAnswerSelect = (value: number) => {
    const existingAnswerIndex = answers.findIndex(a => a.questionId === currentQuestion.id);
    const newAnswers = [...answers];
    if (existingAnswerIndex > -1) {
      newAnswers[existingAnswerIndex] = { questionId: currentQuestion.id, value };
    } else {
      newAnswers.push({ questionId: currentQuestion.id, value });
    }
    setAnswers(newAnswers);
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
  
  const currentAnswerValue = useMemo(() => {
    return answers.find(a => a.questionId === currentQuestion.id)?.value;
  }, [answers, currentQuestion]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
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

      <div className="text-center min-h-[100px]">
        <h3 className="text-2xl font-semibold text-slate-800">{currentQuestion.text}</h3>
      </div>
      
      <div className="my-8 space-y-4">
        {likertOptions.map(option => (
          <button
            key={option.value}
            onClick={() => handleAnswerSelect(option.value)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-[1.02] ${
              currentAnswerValue === option.value
                ? 'bg-indigo-100 border-indigo-500 text-indigo-800 font-semibold'
                : 'bg-white border-slate-300 hover:border-indigo-400'
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>

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
            onClick={() => onTestComplete(answers)}
            disabled={answers.length !== questions.length}
            className="flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <CheckIcon className="h-5 w-5 mr-2" />
            Finish & See Report
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!currentAnswerValue}
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