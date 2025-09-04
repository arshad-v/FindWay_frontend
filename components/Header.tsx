
import React from 'react';
import { CompassIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <CompassIcon className="h-8 w-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-slate-800 ml-2">FindWay.ai</h1>
      </div>
    </header>
  );
};
