import React from 'react';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark',
  outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary-light',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm-text',
  md: 'px-6 py-3 text-body',
  lg: 'px-8 py-4 text-h4',
};

const Button: React.FC<IButtonProps> = ({ variant = 'primary', size = 'md', children, className = '', ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
