import React from 'react';

interface RadioGroupProps {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, value, onChange, error, required }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-gray-50'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 transition-colors ${
                isSelected ? 'border-purple-500' : 'border-gray-300'
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" />}
              </div>
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span className={`text-sm ${isSelected ? 'text-purple-900 font-medium' : 'text-gray-700'}`}>
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};
