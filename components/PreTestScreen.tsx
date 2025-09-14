import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { type UserData } from '../types';
import { DatabaseService } from '../services/databaseService';
import { ArrowRightIcon, UserIcon, BriefcaseIcon, CalendarIcon, HeartIcon, StarIcon, BookOpenIcon, ArrowLeftIcon } from './icons';

interface PreTestScreenProps {
  onComplete: (data: UserData) => void;
  onBack?: () => void;
}

export const PreTestScreen: React.FC<PreTestScreenProps> = ({ onComplete, onBack }) => {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [education, setEducation] = useState('');
  const [degree, setDegree] = useState('');
  const [department, setDepartment] = useState('');
  const [skills, setSkills] = useState('');
  const [areaOfInterest, setAreaOfInterest] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !education) {
      setError('Please fill in all required fields: Name and Education Level.');
      return;
    }

    if (!user) {
      setError('Please sign in to continue.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // First, ensure user exists in our database
      await DatabaseService.upsertUser(
        user.id,
        user.primaryEmailAddress?.emailAddress || '',
        user.fullName || name
      );

      // Prepare user data
      const userData: UserData = { 
        name, 
        phone, 
        age, 
        gender, 
        education, 
        degree, 
        department, 
        skills, 
        areaOfInterest 
      };

      // Save pretest data to database
      const savedData = await DatabaseService.savePreTestData(user.id, userData);
      
      if (!savedData) {
        console.error('Database save failed, but continuing with local flow');
        // Don't block the user flow - continue even if database save fails
        // setError('Failed to save your information. Please try again.');
        // return;
      }

      // Log activity
      await DatabaseService.logActivity(
        user.id,
        'pretest_completed',
        { education, hasSkills: !!skills, hasInterests: !!areaOfInterest },
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

  const showDetailedEducation = education === 'Undergraduate Student' || education === 'Graduate Student';

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-4 sm:p-8 md:p-12 rounded-2xl shadow-2xl max-w-3xl mx-auto relative">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-3 left-3 md:top-4 md:left-4 p-2 md:p-3 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-300 group z-10"
            title="Back"
          >
            <ArrowLeftIcon className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-400 mb-2">Tell Us About Yourself</h2>
        <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 px-2">
          This information will help us personalize your assessment and career recommendations.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 text-left">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <UserIcon className="h-6 w-7 mr-2 text-gray-400" />
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <svg className="h-6 w-7 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="text-gray-300 font-medium">+91</span>
                </div>
                <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="xxxxxxxxxx"
                  className="w-full pl-16 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <CalendarIcon className="h-6 w-7 mr-2 text-gray-400" />
                Age
              </label>
              <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <svg className="h-6 w-7 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Gender
              </label>
              <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <option value="" disabled>Select gender...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <BriefcaseIcon className="h-6 w-7 mr-2 text-gray-400" />
              Current Education Level <span className="text-red-500 ml-1">*</span>
            </label>
            <select id="education" value={education} onChange={(e) => setEducation(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required >
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
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="degree" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <BriefcaseIcon className="h-6 w-7 mr-2 text-gray-400" />
                    Degree / Program
                  </label>
                  <input type="text" id="degree" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g., B.Tech, BSc, MBA"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <BookOpenIcon className="h-6 w-7 mr-2 text-gray-400" />
                        Department / Major
                    </label>
                    <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g., Computer Science, Biology"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
            </div>
          )}

           <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <StarIcon className="h-6 w-7 mr-2 text-gray-400" />
                Your Skills or Talents
              </label>
              <input type="text" id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., Programming, Public Speaking, Graphic Design"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>

            <div>
              <label htmlFor="areaOfInterest" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <HeartIcon className="h-6 w-7 mr-2 text-gray-400" />
                Area of Interest
              </label>
              <input type="text" id="areaOfInterest" value={areaOfInterest} onChange={(e) => setAreaOfInterest(e.target.value)} placeholder="e.g., Technology, Healthcare, Arts"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>

          {error && <p className="text-sm text-red-400 text-center bg-red-900/20 border border-red-500/50 rounded-lg p-3">{error}</p>}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-500 hover:scale-105 hover:shadow-blue-500/25'
              } text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-all duration-300 transform flex items-center justify-center w-full md:w-auto mx-auto group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  Continue to Assessment
                  <ArrowRightIcon className="ml-2 h-6 w-7 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};