import React from 'react';

const Link = ({
  href,
  children,
  onClick,
  className,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <a href={href} onClick={onClick} className={className}>
    {children}
  </a>
);

export default Link;
