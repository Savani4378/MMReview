import React from 'react';
import { Sparkles } from 'lucide-react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
  onSuggest?: () => void;
  isSuggesting?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, required, onSuggest, isSuggesting, className = '', ...props }) => {
  const id = props.id || props.name;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex justify-between items-end">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {onSuggest && (
          <button
            type="button"
            onClick={onSuggest}
            disabled={isSuggesting}
            className="flex items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Generate a suggestion using AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isSuggesting ? 'Generating...' : 'AI Suggest'}
          </button>
        )}
      </div>
      <textarea
        id={id}
        className={`w-full px-4 py-3 bg-white rounded-xl border ${
          error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-purple-400 focus:ring-purple-100'
        } focus:outline-none focus:ring-4 transition-all duration-200 text-gray-900 placeholder-gray-400 resize-y min-h-[100px]`}
        {...props}
      />
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};
