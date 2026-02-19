import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'primary-dark': '#1D4ED8',
        'primary-light': '#DBEAFE',
        secondary: '#10B981',
        'secondary-dark': '#059669',
        accent: '#F59E0B',
        dark: '#1E293B',
        'dark-gray': '#475569',
        gray: '#94A3B8',
        'light-gray': '#E2E8F0',
        light: '#F8FAFC',
        error: '#EF4444',
        success: '#22C55E',
        warning: '#F59E0B',
        medical: '#7C3AED',
        cs: '#2563EB',
      },
      screens: {
        xs: '320px',
        sm: '576px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      fontFamily: {
        sans: ["'Inter'", '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'sans-serif'],
      },
      fontSize: {
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.5rem',
        h4: '1.25rem',
        body: '1rem',
        'sm-text': '0.875rem',
        'xs-text': '0.75rem',
      },
      spacing: {
        section: '5rem',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.07)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
