'use client';

import React from 'react';

interface IFormTextareaProps {
  id: string;
  label: string;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  rows?: number;
  registration: object;
}

const FormTextarea: React.FC<IFormTextareaProps> = ({
  id,
  label,
  placeholder,
  error,
  maxLength,
  rows = 4,
  registration,
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = React.useState(0);

  const handleInput = () => {
    if (textareaRef.current) {
      setCharCount(textareaRef.current.value.length);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm-text font-semibold text-dark mb-1">
        {label}
      </label>
      <textarea
        id={id}
        ref={textareaRef}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        onInput={handleInput}
        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:border-primary transition-colors duration-200 resize-vertical ${
          error ? 'border-error' : 'border-light-gray'
        }`}
        {...(registration as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
      <div className="flex justify-between mt-1">
        {error ? (
          <p role="alert" className="text-error text-sm-text">
            {error}
          </p>
        ) : (
          <span />
        )}
        {maxLength && (
          <span className="text-gray text-sm-text">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormTextarea;
