import React from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({ label, error, required, className = '', ...props }) => {
  const id = props.id || props.name;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-3 bg-white rounded-xl border ${
          error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-purple-400 focus:ring-purple-100'
        } focus:outline-none focus:ring-4 transition-all duration-200 text-gray-900 placeholder-gray-400`}
        {...props}
      />
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};
