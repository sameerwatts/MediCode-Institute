import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-light-gray border-t-primary rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
