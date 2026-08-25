import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-6 transition-all duration-300 hover:shadow-md hover:border-purple-100">
      <h3 className="text-sm font-bold tracking-wider uppercase text-purple-600 mb-6 pb-4 border-b border-gray-100">
        {title}
      </h3>
      <div className="flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
};
