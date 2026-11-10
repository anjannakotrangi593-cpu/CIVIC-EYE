import React from 'react';
import { ComplaintStatus } from '../../types';

interface Props {
  status: ComplaintStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'sm' }) => {
  const normalized = status.toLowerCase();

  let label = 'Submitted';
  let classes = 'bg-amber-50 text-amber-700 border-amber-200';

  switch (normalized) {
    case 'submitted':
    case 'pending':
      label = 'Pending';
      classes = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'verified':
      label = 'Verified';
      classes = 'bg-sky-50 text-sky-700 border-sky-200';
      break;
    case 'in_progress':
    case 'in progress':
      label = 'In Progress';
      classes = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'resolved':
    case 'completed':
      label = 'Completed';
      classes = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'rejected':
      label = 'Rejected';
      classes = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'duplicate':
      label = 'Duplicate';
      classes = 'bg-gray-100 text-gray-700 border-gray-200';
      break;
    default:
      label = status;
      classes = 'bg-gray-50 text-gray-700 border-gray-200';
  }

  const sizeClass =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs font-semibold'
      : size === 'md'
      ? 'px-2.5 py-1 text-xs font-bold'
      : 'px-3 py-1.5 text-sm font-bold';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border ${sizeClass} ${classes}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {label}
    </span>
  );
};
