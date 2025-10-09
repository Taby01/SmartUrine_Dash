import React, { useState, useMemo } from 'react';
import { alerts as allAlertsData } from '../constants';
import type { Doctor, Alert } from '../types';
import { AlertLevel, AlertStatus, Page } from '../types';

interface AlertsProps {
    doctor: Doctor;
    setSelectedPatientId: (id: number) => void;
    setCurrentPage: (page: Page) => void;
}

const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

const AlertItem: React.FC<{ alert: Alert, onAction: (id: string, newStatus: AlertStatus) => void, onViewDetails: (patientId: number) => void }> = ({ alert, onAction, onViewDetails }) => {
    const levelClasses = alert.level === AlertLevel.HIGH ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex-grow">
                <div className="flex items-center flex-wrap mb-2 sm:mb-0">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${levelClasses}`}>
                        {alert.level} Risk
                    </span>
                    <p className="ml-3 text-sm font-semibold text-gray-800">{alert.patientName}</p>
                    <p className="ml-2 text-sm text-gray-500 hidden sm:block">- {timeSince(new Date(alert.timestamp))}</p>
                </div>
                <p className="mt-1 text-gray-600">{alert.message}</p>
                <p className="mt-1 text-sm text-gray-500 sm:hidden">{new Date(alert.timestamp).toLocaleString()}</p>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 space-x-2">
                {alert.status === AlertStatus.ACTIVE && <>
                    <button onClick={() => onAction(alert.id, AlertStatus.SNOOZED)} className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Snooze</button>
                    <button onClick={() => onAction(alert.id, AlertStatus.REVIEWED)} className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-md hover:bg-green-200">Reviewed</button>
                </>}
                 <button onClick={() => onViewDetails(alert.patientId)} className="px-3 py-1 text-sm font-medium text-brand-blue-dark bg-brand-blue-light rounded-md hover:bg-blue-200">Details</button>
            </div>
        </div>
    );
}

export const Alerts: React.FC<AlertsProps> = ({ doctor, setSelectedPatientId, setCurrentPage }) => {
  const [alerts, setAlerts] = useState<Alert[]>(
    allAlertsData.filter(alert => doctor.patientIds.includes(alert.patientId))
  );
  const [activeTab, setActiveTab] = useState<'active' | 'log'>('active');

  const handleAlertAction = (id: string, newStatus: AlertStatus) => {
    setAlerts(currentAlerts => currentAlerts.map(alert => alert.id === id ? {...alert, status: newStatus} : alert));
  };
  
  const handleViewDetails = (patientId: number) => {
      setSelectedPatientId(patientId);
      setCurrentPage(Page.DASHBOARD);
  }

  const activeAlerts = useMemo(() => alerts.filter(a => a.status === AlertStatus.ACTIVE).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [alerts]);
  const loggedAlerts = useMemo(() => alerts.filter(a => a.status !== AlertStatus.ACTIVE).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [alerts]);

  const renderAlertsList = (list: Alert[]) => {
      if (list.length === 0) {
          return (
             <div className="bg-white text-center p-8 rounded-lg shadow-sm">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">All Clear</h3>
                <p className="mt-1 text-sm text-gray-500">There are no alerts in this category.</p>
            </div>
          );
      }
      return list.map(alert => <AlertItem key={alert.id} alert={alert} onAction={handleAlertAction} onViewDetails={handleViewDetails} />);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Patient Alerts</h2>
        
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'active'
                        ? 'border-brand-blue text-brand-blue-dark'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Active Alerts <span className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{activeAlerts.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('log')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'log'
                        ? 'border-brand-blue text-brand-blue-dark'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Log
                </button>
            </nav>
        </div>
        
        <div className="space-y-4">
            {activeTab === 'active' ? renderAlertsList(activeAlerts) : renderAlertsList(loggedAlerts)}
        </div>
    </div>
  );
};