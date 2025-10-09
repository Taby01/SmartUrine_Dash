
import React from 'react';
import type { Patient } from '../types';

interface SettingsProps {
    patient: Patient;
}

const SettingsCard: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">{title}</h3>
        {children}
    </div>
);

const Toggle: React.FC<{label: string, enabled: boolean}> = ({ label, enabled }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <button
            type="button"
            className={`${
                enabled ? 'bg-brand-blue' : 'bg-gray-200'
            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue`}
        >
            <span
                className={`${
                enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            />
        </button>
    </div>
);


export const Settings: React.FC<SettingsProps> = ({ patient }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">My Settings</h2>
      
      <SettingsCard title="Profile Information">
        <div className="flex items-center">
            <img src={patient.avatar} alt={patient.name} className="w-16 h-16 rounded-full object-cover"/>
            <div className="ml-4">
                <p className="text-xl font-semibold text-gray-900">{patient.name}</p>
                <p className="text-md text-gray-500">{patient.age} years old</p>
            </div>
        </div>
        <button className="mt-6 px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue-dark">
            Edit Profile
        </button>
      </SettingsCard>

      <SettingsCard title="Notification Preferences">
        <p className="text-sm text-gray-600 mb-4">Manage how you receive health alerts.</p>
        <div className="space-y-2">
            <Toggle label="Email Notifications" enabled={true} />
            <Toggle label="SMS (Text Message) Alerts" enabled={false} />
            <Toggle label="Push Notifications" enabled={true} />
        </div>
        <button className="mt-6 px-4 py-2 text-sm font-medium text-white bg-brand-green rounded-md hover:bg-brand-green-dark">
            Save Preferences
        </button>
      </SettingsCard>
    </div>
  );
};
