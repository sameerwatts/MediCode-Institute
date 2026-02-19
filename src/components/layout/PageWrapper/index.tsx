import React from 'react';

interface IPageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<IPageWrapperProps> = ({ children }) => {
  return <div className="max-w-[1200px] mx-auto px-4">{children}</div>;
};

export default PageWrapper;
