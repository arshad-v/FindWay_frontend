import React, { useState, useRef, useEffect } from 'react';
import { type ReportData, type UserData, type ChatMessage } from '../types';
import { conversationalCareerCoachAgent } from '../services/aiAgents';
import { ArrowLeftIcon, SendIcon, UserIcon, BotIcon, LightbulbIcon } from './icons';

interface ChatCoachScreenProps {
  report: ReportData;
  userData: UserData;
  onBack: () => void;
}

interface ChatResponse {
  message: string;
  suggestions?: string[];
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2 p-4 bg-gray-700 rounded-2xl max-w-xs">
    <img src="https://iili.io/KIrXCNI.th.png" alt="CareerRoute.ai Logo" className="h-6 w-6 flex-shrink-0" />
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
);

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4`}>
      <div className={`flex items-start space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-gray-600'
        }`}>
          {isUser ? (
            <UserIcon className="h-5 w-5 sm:h-5 sm:w-5 text-white" />
          ) : (
            <img src="https://iili.io/KIrXCNI.th.png" alt="CareerRoute.ai Logo" className="h-3 w-3 sm:h-5 sm:w-5 rounded-full" />
          )}
        </div>
        <div className={`rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 text-gray-100 border border-gray-600'
        }`}>
          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
          <div className="text-xs opacity-70 mt-1 sm:mt-2">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

const SuggestionChips: React.FC<{ suggestions: string[]; onSelect: (suggestion: string) => void }> = ({ suggestions, onSelect }) => (
  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
    {suggestions.map((suggestion, index) => (
      <button
        key={index}
        onClick={() => onSelect(suggestion)}
        className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-full text-xs sm:text-sm text-gray-200 transition-colors duration-200 hover:border-blue-400"
      >
        {suggestion}
      </button>
    ))}
  </div>
);

const WelcomeMessage: React.FC<{ userName: string }> = ({ userName }) => (
  <div className="text-center py-6 sm:py-8 px-3 sm:px-4">
    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
      <img src="https://iili.io/KIrXCNI.th.png" alt="CareerRoute.ai Logo" className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
    </div>
    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Hi {userName}! 👋</h2>
    <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 max-w-md mx-auto">
      I'm your personal career coach. I've reviewed your assessment results and I'm here to help you explore your career path in more detail.
    </p>
    <div className="bg-gray-800 border border-gray-600 rounded-lg sm:rounded-xl p-3 sm:p-4 max-w-lg mx-auto">
      <div className="flex items-start space-x-2 sm:space-x-3">
        <LightbulbIcon className="h-6 w-6 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-left">
          <p className="text-xs sm:text-sm font-semibold text-blue-300 mb-1">Try asking me:</p>
          <ul className="text-xs sm:text-sm text-gray-300 space-y-0.5 sm:space-y-1">
            <li>• "Tell me more about the Data Analyst role"</li>
            <li>• "How can I improve my teamwork skills?"</li>
            <li>• "What's a typical day like in software development?"</li>
            <li>• "How do I get started in my recommended career?"</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export const ChatCoachScreen: React.FC<ChatCoachScreenProps> = ({ report, userData, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setSuggestions([]);

    try {
      const response: ChatResponse = await conversationalCareerCoachAgent(
        textToSend,
        report,
        userData,
        messages
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSuggestions([]);
    handleSendMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-3 sm:px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onBack}
            className="p-1.5 sm:p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 sm:h-5 sm:w-5 text-gray-300" />
          </button>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img src="https://iili.io/KIrXCNI.th.png" alt="CareerRoute.ai Logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-white">Career Coach.ai</h1>
              <p className="text-sm sm:text-base text-gray-400 hidden sm:block">Ask me about your career report</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6">
        {messages.length === 0 ? (
          <WelcomeMessage userName={userData.name} />
        ) : (
          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            {suggestions.length > 0 && (
              <div className="mt-3 sm:mt-4">
                <p className="text-xs sm:text-sm text-gray-400 mb-2">Suggested questions:</p>
                <SuggestionChips suggestions={suggestions} onSelect={handleSuggestionSelect} />
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 bg-gray-800 px-2 sm:px-4 py-3 sm:py-4 sticky bottom-2 sm:bottom-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex w-full flex-col items-center justify-center gap-3">
            <div className="flex h-16 sm:h-14 w-full max-w-[768px] flex-none items-center justify-center gap-2 rounded-full bg-gray-700 px-2 py-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your career assessment..."
                  className="w-full h-auto px-3 sm:px-4 py-3 sm:py-3 bg-transparent text-white rounded-full resize-none focus:outline-none max-h-32 min-h-[40px] sm:min-h-[40px] placeholder-gray-400 text-base sm:text-base border-none"
                  rows={1}
                  disabled={isLoading}
                  style={{ 
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 sm:p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
              >
                <SendIcon className="h-6 w-7 sm:h-5 sm:w-5" />
              </button>
            </div>
            <span className="text-xs text-gray-400 text-center hidden sm:block">
              Career Coach.ai can make mistakes. Verify important information.
            </span>
          </div>
        </div>
      </div>

      {/* Mobile disclaimer completely outside input area */}
      <div className="sm:hidden bg-gray-900 px-4 py-2 text-center">
        <span className="text-xs text-gray-400">
          Career Coach.ai can make mistakes. Verify important information.
        </span>
      </div>
    </div>
  );
};
