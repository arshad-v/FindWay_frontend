import React, { useState } from 'react';
import { useUser, useSession } from '@clerk/clerk-react';
import { type UserData } from '../types';
import { DatabaseService } from '../services/databaseService';
import { ArrowRightIcon, UserIcon, BriefcaseIcon, CalendarIcon, HeartIcon, StarIcon, BookOpenIcon, ArrowLeftIcon } from './icons';

interface PreTestScreenProps {
  onComplete: (data: UserData) => void;
  onBack?: () => void;
}

// Predefined areas of interest for chips
const AREAS_OF_INTEREST = [
  'Technology', 'Healthcare', 'Arts & Design', 'Business & Finance', 'Education', 'Engineering',
  'Marketing', 'Science & Research', 'Media & Entertainment', 'Sports & Fitness', 'Social Work',
  'Law & Legal', 'Agriculture', 'Environment', 'Travel & Tourism', 'Food & Culinary',
  'Fashion', 'Photography', 'Music', 'Writing', 'Psychology', 'Architecture', 'Data Science',
  'Artificial Intelligence', 'Cybersecurity', 'Digital Marketing', 'Human Resources', 'Sales',
  'Project Management', 'Consulting', 'Real Estate', 'Banking', 'Insurance', 'Retail',
  'Manufacturing', 'Logistics', 'Aviation', 'Automotive', 'Telecommunications', 'Gaming'
];

export const PreTestScreen: React.FC<PreTestScreenProps> = ({ onComplete, onBack }) => {
  const { user } = useUser();
  const { session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1 fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  
  // Step 2 fields
  const [education, setEducation] = useState('');
  const [degree, setDegree] = useState('');
  const [department, setDepartment] = useState('');
  const [skills, setSkills] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [interestSearch, setInterestSearch] = useState('');
  const [assessmentLanguage, setAssessmentLanguage] = useState<'English' | 'Malayalam'>('English');
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStep1Loading, setIsStep1Loading] = useState(false);

  const handleStep1Next = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError('Please enter your name.');
      return;
    }
    if (!phone) {
      setError('Please enter your phone number.');
      return;
    }

    if (!user || !session) {
      setError('Please sign in to continue.');
      return;
    }

    setIsStep1Loading(true);
    setError(null);

    try {
      // Update user information in Supabase
      await DatabaseService.upsertUser(
        session,
        user.primaryEmailAddress?.emailAddress || '',
        user.fullName || name
      );

      // Move to step 2
      setCurrentStep(2);
    } catch (error) {
      console.error('Error updating user information:', error);
      setError('Failed to save user information. Please try again.');
    } finally {
      setIsStep1Loading(false);
    }
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
    setError(null);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!education) {
      setError('Please select your education level.');
      return;
    }
    if (showDetailedEducation && !degree) {
      setError('Please enter your degree/program.');
      return;
    }
    if (showDetailedEducation && !department) {
      setError('Please enter your department/major.');
      return;
    }
    if (!skills) {
      setError('Please enter your skills or talents.');
      return;
    }
    if (selectedInterests.length === 0) {
      setError('Please select at least one area of interest.');
      return;
    }

    if (!user || !session) {
      setError('Please sign in to continue.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare user data
      const userData: UserData = { 
        name, 
        phone, 
        age, 
        gender: '', // Removed gender field as requested
        education, 
        degree, 
        department, 
        skills, 
        areaOfInterest: selectedInterests.join(', '),
        assessmentLanguage
      };

      // Save pretest data to database
      const savedData = await DatabaseService.savePreTestData(session, userData);
      
      if (!savedData) {
        console.error('Database save failed, but continuing with local flow');
        console.log('PreTestScreen: savedData is null/undefined');
        // Don't block the user flow - continue even if database save fails
      } else {
        console.log('PreTestScreen: Data saved successfully:', savedData);
      }

      // Log activity
      await DatabaseService.logActivity(
        session,
        'pretest_completed',
        { education, hasSkills: !!skills, hasInterests: selectedInterests.length > 0 },
        undefined,
        navigator.userAgent
      );

      // Continue with the original flow
      onComplete(userData);
    } catch (error) {
      console.error('Error submitting pretest data:', error);
      setError('An error occurred while saving your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredInterests = AREAS_OF_INTEREST.filter(interest =>
    interest.toLowerCase().includes(interestSearch.toLowerCase())
  );

  const addInterest = (interest: string) => {
    if (!selectedInterests.includes(interest)) {
      setSelectedInterests([...selectedInterests, interest]);
    }
    setInterestSearch('');
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(item => item !== interest));
  };

  const showDetailedEducation = education === 'Undergraduate Student' || education === 'Graduate Student';

  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto relative">

        {currentStep === 1 ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-400 mb-2">Basic Information</h2>
            <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 px-2">
              Let's start with some basic details about you.
            </p>
            <form onSubmit={handleStep1Next} className="space-y-4 text-left">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Full Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone Number <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-300 font-medium text-sm">+91</span>
                  </div>
                  <input 
                    type="tel" 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="xxxxxxxxxx"
                    className="w-full pl-12 pr-3 py-2.5 text-sm bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required 
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-400 text-center bg-red-900/20 border border-red-500/50 rounded-lg p-3">{error}</p>}
              
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isStep1Loading}
                  className={`${
                    isStep1Loading 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-500 hover:scale-105 hover:shadow-blue-500/25'
                  } text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 transform flex items-center justify-center w-full sm:w-auto mx-auto group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  {isStep1Loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      
                    </>
                  ) : (
                    <>
                      Start
                      <ArrowRightIcon className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-400 mb-2">Education & Interests</h2>
            <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 px-2">
              Tell us about your educational background and areas of interest.
            </p>
            <form onSubmit={handleFinalSubmit} className="space-y-4 text-left">
            <div>
                <label htmlFor="assessmentLanguage" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                  </svg>
                  Assessment Language <span className="text-red-500 ml-1">*</span>
                </label>
                <select 
                  id="assessmentLanguage" 
                  value={assessmentLanguage} 
                  onChange={(e) => setAssessmentLanguage(e.target.value as 'English' | 'Malayalam')}
                  className="w-full px-3 py-2.5 text-sm bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  required 
                >
                  <option value="English">English</option>
                  <option value="Malayalam">മലയാളം (Malayalam)</option>
                </select>
                <p className="text-xs text-gray-400 mt-2">
                  Choose the language for assessment questions and options. The final report will be in English.
                </p>
              </div>
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <BriefcaseIcon className="h-6 w-6 mr-2 text-gray-400" />
                  Current Education Level <span className="text-red-500 ml-1">*</span>
                </label>
                <select 
                  id="education" 
                  value={education} 
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  required 
                >
                  <option value="" disabled>Select one...</option>
                  <option value="High School (Science)">High School (Science)</option>
                  <option value="High School (Commerce)">High School (Commerce)</option>
                  <option value="High School (Humanities)">High School (Humanities)</option>
                  <option value="Undergraduate Student">Undergraduate Student</option>
                  <option value="Graduate Student">Graduate Student</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {showDetailedEducation && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
                      Degree / Program <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="degree" 
                      value={degree} 
                      onChange={(e) => setDegree(e.target.value)} 
                      placeholder="e.g., B.Tech, BSc, MBA"
                      className="w-full px-3 py-2.5 text-sm bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <BookOpenIcon className="h-6 w-6 mr-2 text-gray-400" />
                      Department / Major <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="department" 
                      value={department} 
                      onChange={(e) => setDepartment(e.target.value)} 
                      placeholder="e.g., Computer Science, Biology"
                      className="w-full px-3 py-2.5 text-sm bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required 
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <StarIcon className="h-6 w-6 mr-2 text-gray-400" />
                  Your Skills or Talents <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  id="skills" 
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)} 
                  placeholder="e.g., Programming, Public Speaking, Graphic Design"
                  className="w-full px-3 py-2.5 text-sm bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required 
                />
              </div>

              

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <HeartIcon className="h-6 w-7 mr-2 text-gray-400" />
                  Areas of Interest <span className="text-red-500 ml-1">*</span>
                </label>
                
                {/* Input with chips container */}
                <div className="relative">
                  <div className="min-h-[48px] px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                    {/* Flex container for chips and input */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Selected interests as chips */}
                      {selectedInterests.map((interest) => (
                        <span
                          key={interest}
                          className="group relative inline-flex items-center px-3 py-1 bg-gray-600 text-white text-sm rounded-full hover:bg-gray-700 transition-all duration-300 overflow-hidden cursor-pointer"
                        >
                          <span className="transition-transform duration-300 group-hover:-translate-x-2">
                            {interest}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeInterest(interest)}
                            className="absolute right-2 text-gray-300 hover:text-white focus:outline-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      
                      {/* Input field - flex-1 makes it take remaining space */}
                      <input
                        type="text"
                        value={interestSearch}
                        onChange={(e) => setInterestSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (interestSearch.trim() && !selectedInterests.includes(interestSearch.trim())) {
                              setSelectedInterests([...selectedInterests, interestSearch.trim()]);
                              setInterestSearch('');
                            }
                          }
                          if (e.key === 'Backspace' && !interestSearch && selectedInterests.length > 0) {
                            removeInterest(selectedInterests[selectedInterests.length - 1]);
                          }
                        }}
                        placeholder={selectedInterests.length === 0 ? "Type interests and press Enter" : "Add more..."}
                        className="flex-1 min-w-[120px] bg-transparent text-white placeholder-gray-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Dropdown suggestions */}
                  {interestSearch && (
                    <div className="absolute z-10 w-full mt-1 max-h-40 overflow-y-auto bg-gray-700 border border-gray-600 rounded-lg shadow-lg">
                      {filteredInterests.slice(0, 8).map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => addInterest(interest)}
                          className={`w-full text-left px-4 py-2 text-white hover:bg-gray-600 transition-colors ${
                            selectedInterests.includes(interest) ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={selectedInterests.includes(interest)}
                        >
                          {interest}
                        </button>
                      ))}
                      {filteredInterests.length === 0 && (
                        <div className="px-4 py-2 text-gray-400 text-sm">
                          No matches found. Press Enter to add "{interestSearch}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-400 mt-2">
                  Type and press Enter to add custom interests, or select from suggestions
                </p>
              </div>

              {error && <p className="text-sm text-red-400 text-center bg-red-900/20 border border-red-500/50 rounded-lg p-3">{error}</p>}
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 ${
                    isSubmitting 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-500 hover:scale-105 hover:shadow-blue-500/25'
                  } text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform flex items-center justify-center group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  {isSubmitting ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      Continue to Assessment
                      <ArrowRightIcon className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};