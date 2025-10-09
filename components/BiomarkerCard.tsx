import React from 'react';
import { HealthStatus, Biomarker } from '../types';
import { getBiomarkerIcon } from './BiomarkerIcons';

interface BiomarkerCardProps {
  biomarker: Biomarker;
  title: string;
  status: HealthStatus;
  value: string | number;
  unit?: string;
  onClick: () => void;
}

const statusStyles: Record<HealthStatus, { border: string; bg: string; text: string; iconText: string }> = {
  [HealthStatus.NORMAL]: {
    border: 'border-status-green',
    bg: 'bg-status-green/10',
    text: 'text-gray-700',
    iconText: 'text-status-green',
  },
  [HealthStatus.CAUTION]: {
    border: 'border-status-yellow',
    bg: 'bg-status-yellow/10',
    text: 'text-status-yellow',
    iconText: 'text-status-yellow',
  },
  [HealthStatus.ALERT]: {
    border: 'border-status-red',
    bg: 'bg-status-red/10',
    text: 'text-status-red',
    iconText: 'text-status-red',
  },
};

export const BiomarkerCard: React.FC<BiomarkerCardProps> = ({ biomarker, title, status, value, unit, onClick }) => {
  const styles = statusStyles[status];
  const icon = getBiomarkerIcon(biomarker);

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg shadow-md bg-white flex flex-col justify-between text-left border-l-4 ${styles.border} transition-all duration-200 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue`}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <div className={`p-1 rounded-full ${styles.bg} ${styles.iconText}`}>
            {icon}
        </div>
      </div>
      <p className={`text-2xl font-bold mt-2 ${status !== HealthStatus.NORMAL ? styles.text : 'text-gray-900'}`}>
        {value}
        {unit && <span className="text-base font-normal ml-1.5">{unit}</span>}
      </p>
    </button>
  );
};
