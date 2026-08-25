import React from 'react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  error?: string;
  required?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, options, error, required, className = '', ...props }) => {
  const id = props.id || props.name;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`appearance-none w-full px-4 py-3 bg-white rounded-xl border ${
            error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-purple-400 focus:ring-purple-100'
          } focus:outline-none focus:ring-4 transition-all duration-200 text-gray-900 cursor-pointer`}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};
