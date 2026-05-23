import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-text-muted mb-1.5 transition-colors">
          {label}
        </label>
      )}
      <input
        {...props}
        className="appearance-none rounded-lg relative block w-full px-3.5 py-2.5 border border-border dark:border-gray-800 placeholder-text-subtle text-text bg-surface dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green focus:z-10 sm:text-sm transition-all duration-200"
      />
    </div>
  );
};

export default Input;
