import React, { useState } from 'react';
import { type UserData } from '../types';
import { ArrowRightIcon, UserIcon, LightbulbIcon, ZapIcon, BookOpenIcon, StarIcon, UsersIcon } from './icons';

interface PreTestScreenProps {
  onComplete: (data: UserData) => void;
}

export const PreTestScreen: React.FC<PreTestScreenProps> = ({ onComplete }) => {
  const [education, setEducation] = useState('');
  const [majorSubjects, setMajorSubjects] = useState('');
  const [favoriteSubject, setFavoriteSubject] = useState('');
  const [extracurriculars, setExtracurriculars] = useState('');
  const [interests, setInterests] = useState('');
  const [skills, setSkills] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!education) {
      setError('Please select your current education level.');
      return;
    }
    setError(null);
    onComplete({ education, interests, skills, majorSubjects, favoriteSubject, extracurriculars });
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-indigo-600 mb-2">Tell Us About Yourself</h2>
        <p className="text-slate-600 mb-8">
          This information will help us personalize your assessment and career recommendations.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-slate-400" />
              Current Education Level <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
           <div>
            <label htmlFor="majorSubjects" className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
              <BookOpenIcon className="h-5 w-5 mr-2 text-slate-400" />
              Major or Focus Subjects (Optional)
            </label>
            <input
              type="text"
              id="majorSubjects"
              value={majorSubjects}
              onChange={(e) => setMajorSubjects(e.target.value)}
              placeholder="e.g., Physics, History, Biology"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
             <p className="text-xs text-slate-500 mt-1">Separate subjects with a comma.</p>
          </div>
           <div>
            <label htmlFor="favoriteSubject" className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
              <StarIcon className="h-5 w-5 mr-2 text-slate-400" />
              Favorite Subject (Optional)
            </label>
            <input
              type="text"
              id="favoriteSubject"
              value={favoriteSubject}
              onChange={(e) => setFavoriteSubject(e.target.value)}
              placeholder="e.g., Mathematics"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
           <div>
            <label htmlFor="extracurriculars" className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
              <UsersIcon className="h-5 w-5 mr-2 text-slate-400" />
              Extracurricular Activities (Optional)
            </label>
            <input
              type="text"
              id="extracurriculars"
              value={extracurriculars}
              onChange={(e) => setExtracurriculars(e.target.value)}
              placeholder="e.g., Debate Club, Volunteering, Soccer Team"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-slate-500 mt-1">Separate activities with a comma.</p>
          </div>
          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
              <LightbulbIcon className="h-5 w-5 mr-2 text-slate-400" />
              Areas of Interest (Optional)
            </label>
            <input
              type="text"
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., Artificial Intelligence, Graphic Design, Finance"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
             <p className="text-xs text-slate-500 mt-1">Separate interests with a comma.</p>
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
              <ZapIcon className="h-5 w-5 mr-2 text-slate-400" />
              Your Skills (Optional)
            </label>
            <input
              type="text"
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., Python, Public Speaking, Video Editing"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-slate-500 mt-1">Separate skills with a comma.</p>
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-full md:w-auto mx-auto group"
            >
              Continue to Assessment
              <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};