import React from 'react';
import { Sparkles } from 'lucide-react';

export const BrandHeader: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-[2px] mb-6 shadow-lg shadow-purple-200">
        <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center" aria-hidden="true">
          <Sparkles className="w-8 h-8 text-purple-500" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
        Meet Mosaic
      </h1>
      <p className="text-lg text-purple-600 font-medium tracking-wide uppercase text-sm">
        Many Stories. One Mosaic.
      </p>
    </header>
  );
};

