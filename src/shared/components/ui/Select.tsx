import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-text-muted mb-1.5 transition-colors">
          {label}
        </label>
      )}
      <select
        {...props}
        className="appearance-none rounded-lg relative block w-full px-3.5 py-2.5 border border-border dark:border-gray-800 placeholder-text-subtle text-text bg-surface dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green focus:z-10 sm:text-sm transition-all duration-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
