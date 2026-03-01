'use client';

import React from 'react';

interface IRadioOption {
  label: string;
  value: string;
}

interface IFormRadioGroupProps {
  name: string;
  label: string;
  options: IRadioOption[];
  error?: string;
  registration: object;
}

const FormRadioGroup: React.FC<IFormRadioGroupProps> = ({
  name,
  label,
  options,
  error,
  registration,
}) => {
  return (
    <fieldset className="mb-4">
      <legend className="block text-sm-text font-semibold text-dark mb-2">
        {label}
      </legend>
      <div className="flex gap-6">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer text-sm-text text-dark-gray"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              className={`w-4 h-4 accent-primary ${
                error ? 'outline outline-1 outline-error' : ''
              }`}
              {...(registration as React.InputHTMLAttributes<HTMLInputElement>)}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-error text-sm-text mt-1">
          {error}
        </p>
      )}
    </fieldset>
  );
};

export default FormRadioGroup;
