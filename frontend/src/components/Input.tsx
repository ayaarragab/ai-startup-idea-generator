import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({ label, error, fullWidth = false, className = '', ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="text-neutral-700">{label}</label>
      )}
      <input
        className={`px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
      {error && (
        <span className="text-red-600">{error}</span>
      )}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function TextArea({ label, error, fullWidth = false, className = '', ...props }: TextAreaProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="text-neutral-700">{label}</label>
      )}
      <textarea
        className={`px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-50 disabled:cursor-not-allowed resize-vertical min-h-[100px] ${className}`}
        {...props}
      />
      {error && (
        <span className="text-red-600">{error}</span>
      )}
    </div>
  );
}
