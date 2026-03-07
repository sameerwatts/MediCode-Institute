import React from 'react';

interface IAdminHeaderProps {
  userName: string;
  onToggleSidebar: () => void;
}

const AdminHeader: React.FC<IAdminHeaderProps> = ({ userName, onToggleSidebar }) => {
  return (
    <header className="h-14 flex-shrink-0 bg-white border-b border-light-gray flex items-center px-4 md:px-6">
      {/* Hamburger — mobile only */}
      <button
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="flex flex-col items-center justify-center gap-[5px] w-12 h-12 md:hidden rounded-full bg-light active:scale-90 transition-transform duration-150 ease-out"
      >
        <span className="block w-5 h-[2px] bg-dark rounded-full" />
        <span className="block w-5 h-[2px] bg-dark rounded-full" />
        <span className="block w-[10px] h-[2px] bg-dark rounded-full self-start ml-[14px]" />
      </button>

      {/* User info — pushed to the right */}
      <div className="ml-auto flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-sm-text font-bold text-primary select-none">
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm-text font-medium text-dark-gray">{userName}</span>
      </div>
    </header>
  );
};

export default AdminHeader;
