import React from 'react';

type TStatus = 'pending' | 'approved' | 'rejected' | 'registered';

interface IStatusBadgeProps {
  status: TStatus;
}

const statusConfig: Record<TStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800',
  },
  approved: {
    label: 'Approved',
    className: 'bg-green-100 text-green-800',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800',
  },
  registered: {
    label: 'Registered',
    className: 'bg-blue-100 text-blue-800',
  },
};

const StatusBadge: React.FC<IStatusBadgeProps> = ({ status }) => {
  const { label, className } = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm-text font-medium ${className}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
