import React from 'react';
import { CompassIcon } from './icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <CompassIcon className="h-8 w-8 text-indigo-400" />
              <h2 className="text-xl font-bold text-white ml-2">FindWay.ai</h2>
            </div>
            <p className="text-sm text-slate-400">Your AI-powered guide to a fulfilling career.</p>
          </div>
          <div className="md:col-start-3">
            <h3 className="font-semibold text-white mb-4">Navigate</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} FindWay.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
