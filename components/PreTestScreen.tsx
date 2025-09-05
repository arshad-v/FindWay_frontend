import React, { useState } from 'react';
import { type UserData } from '../types';
import { ArrowRightIcon, UserIcon, BriefcaseIcon, CalendarIcon, HeartIcon, StarIcon, BookOpenIcon } from './icons';

interface PreTestScreenProps {
  onComplete: (data: UserData) => void;
}

export const PreTestScreen: React.FC<PreTestScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [education, setEducation] = useState('');
  const [degree, setDegree] = useState('');
  const [department, setDepartment] = useState('');
  const [skills, setSkills] = useState('');
  const [areaOfInterest, setAreaOfInterest] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !education) {
      setError('Please fill in all required fields: Name and Education Level.');
      return;
    }
    setError(null);
    onComplete({ name, age, education, degree, department, skills, areaOfInterest });
  };
  
  const showDetailedEducation = education === 'Undergraduate Student' || education === 'Graduate Student';

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 md:p-12 rounded-2xl shadow-2xl max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-blue-400 mb-2">Tell Us About Yourself</h2>
        <p className="text-gray-300 mb-8">
          This information will help us personalize your assessment and career recommendations.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
            </div>
            <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Age
                </label>
                <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
          </div>
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
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
                    <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Degree / Program
                  </label>
                  <input type="text" id="degree" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g., B.Tech, BSc, MBA"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <BookOpenIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Department / Major
                    </label>
                    <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g., Computer Science, Biology"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
            </div>
          )}

           <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <StarIcon className="h-5 w-5 mr-2 text-gray-400" />
                Your Skills or Talents
              </label>
              <input type="text" id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., Programming, Public Speaking, Graphic Design"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>

            <div>
              <label htmlFor="areaOfInterest" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <HeartIcon className="h-5 w-5 mr-2 text-gray-400" />
                Area of Interest
              </label>
              <input type="text" id="areaOfInterest" value={areaOfInterest} onChange={(e) => setAreaOfInterest(e.target.value)} placeholder="e.g., Technology, Healthcare, Arts"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>

          {error && <p className="text-sm text-red-400 text-center bg-red-900/20 border border-red-500/50 rounded-lg p-3">{error}</p>}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25 flex items-center justify-center w-full md:w-auto mx-auto group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              Continue to Assessment
              <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};