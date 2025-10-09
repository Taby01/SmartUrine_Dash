import React from 'react';
import { HealthStatus } from '../types';

interface KpiCardProps {
  title: string;
  status: HealthStatus;
  value: string | number;
  unit?: string;
}

// FIX: Replaced JSX.Element with React.ReactNode to resolve namespace error.
const statusStyles: Record<HealthStatus, { bg: string; text: string; icon: React.ReactNode; }> = {
  [HealthStatus.NORMAL]: {
    bg: 'bg-status-green/10',
    text: 'text-status-green',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  },
  [HealthStatus.CAUTION]: {
    bg: 'bg-status-yellow/10',
    text: 'text-status-yellow',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>,
  },
  [HealthStatus.ALERT]: {
    bg: 'bg-status-red/10',
    text: 'text-status-red',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>,
  },
};

export const KpiCard: React.FC<KpiCardProps> = ({ title, status, value, unit }) => {
  const styles = statusStyles[status];

  return (
    <div className={`p-5 rounded-lg shadow-md bg-white flex items-center space-x-4 border-l-4 ${
        status === HealthStatus.NORMAL ? 'border-status-green' :
        status === HealthStatus.CAUTION ? 'border-status-yellow' :
        'border-status-red'
    }`}>
        <div className={`p-3 rounded-full ${styles.bg} ${styles.text}`}>
            {styles.icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-2xl font-bold ${styles.text}`}>
              {value}
              {unit && <span className="text-base font-medium ml-1.5 align-baseline">{unit}</span>}
            </p>
        </div>
    </div>
  );
};