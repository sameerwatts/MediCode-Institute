import React from 'react';

interface IAdminHeaderProps {
  userName: string;
}

const AdminHeader: React.FC<IAdminHeaderProps> = ({ userName }) => {
  return (
    <header className="h-14 flex-shrink-0 bg-white border-b border-light-gray flex items-center justify-end px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-sm-text font-bold text-primary select-none">
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm-text font-medium text-dark-gray">{userName}</span>
      </div>
    </header>
  );
};

export default AdminHeader;
