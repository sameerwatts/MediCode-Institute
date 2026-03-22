'use client';

import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const { ref, isVisible } = useScrollReveal();

  const delayClass = delay > 0 ? `scroll-reveal-delay-${delay}` : '';

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${delayClass} ${isVisible ? 'visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
