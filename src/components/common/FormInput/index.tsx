'use client';

import React, { useState } from 'react';

interface IFormInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  error?: string;
  showToggle?: boolean;
  registration: object;
}

const EyeIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const FormInput: React.FC<IFormInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  showToggle = false,
  registration,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === 'password' && showToggle
      ? showPassword
        ? 'text'
        : 'password'
      : type;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm-text font-semibold text-dark mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:border-primary transition-colors duration-200 read-only:bg-gray-100 read-only:text-dark-gray read-only:cursor-not-allowed ${
            error ? 'border-error' : 'border-light-gray'
          }`}
          {...(registration as React.InputHTMLAttributes<HTMLInputElement>)}
        />
        {type === 'password' && showToggle && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-dark-gray transition-colors"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="text-error text-sm-text mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
