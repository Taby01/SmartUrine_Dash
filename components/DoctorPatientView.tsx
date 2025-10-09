import React, { useState } from 'react';
import type { Patient } from '../types';
import { HealthStatus, Biomarker } from '../types';
import { BIOMARKER_THRESHOLDS } from '../constants';
import { BiomarkerCard } from './BiomarkerCard';
import { BiomarkerTrendChart } from './BiomarkerTrendChart';
import { TestHistory } from './TestHistory';

interface DoctorPatientViewProps {
  patient: Patient;
  onBack: () => void;
}

const getStatusForValue = (biomarker: Biomarker, value: number | string): HealthStatus => {
  const threshold = BIOMARKER_THRESHOLDS[biomarker];
  if (!threshold) return HealthStatus.NORMAL;

  if (threshold.normal(value)) {
    return HealthStatus.NORMAL;
  }
  if (threshold.caution && threshold.caution(value)) {
    return HealthStatus.CAUTION;
  }
  return HealthStatus.ALERT;
};


export const DoctorPatientView: React.FC<DoctorPatientViewProps> = ({ patient, onBack }) => {
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  const latestResult = patient.results.length > 0 ? patient.results[patient.results.length - 1] : null;
  const biomarkers = Object.keys(BIOMARKER_THRESHOLDS) as Biomarker[];

  const handleCardClick = (biomarker: Biomarker) => {
    setSelectedBiomarker(biomarker);
  };

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center flex-wrap">
        <div className="flex items-center space-x-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                <span className="sr-only">Back to Patient List</span>
            </button>
            <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-full object-cover"/>
            <div>
                <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
                <p className="text-sm text-gray-500">{patient.age} years old  ·  {patient.hospital}</p>
            </div>
        </div>
        <div className="mt-2 sm:mt-0">
            <p className="text-sm text-gray-500 text-left sm:text-right">Latest Test</p>
            <p className="font-semibold text-gray-800">{latestResult ? new Date(latestResult.date).toLocaleString() : 'No results yet'}</p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
                onClick={() => setActiveTab('dashboard')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                    ? 'border-brand-blue text-brand-blue-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
                Dashboard
            </button>
            <button
                onClick={() => setActiveTab('history')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                    ? 'border-brand-blue text-brand-blue-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
                Test History
            </button>
        </nav>
      </div>
      
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
            {/* Patient Contact Info */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-gray-600 mb-2">Patient Details</h4>
                        <p className="text-sm text-gray-500"><strong>Address:</strong> {patient.contact.address}</p>
                        <p className="text-sm text-gray-500"><strong>Email:</strong> {patient.contact.email}</p>
                        <p className="text-sm text-gray-500"><strong>Phone:</strong> {patient.contact.phone}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-600 mb-2">Caregiver Details</h4>
                        <p className="text-sm text-gray-500"><strong>Name:</strong> {patient.caregiver.name}</p>
                        <p className="text-sm text-gray-500"><strong>Relation:</strong> {patient.caregiver.relation}</p>
                        <p className="text-sm text-gray-500"><strong>Phone:</strong> {patient.caregiver.phone}</p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t flex space-x-2">
                    <a href={`mailto:${patient.contact.email}`} className="px-3 py-1.5 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue-dark">Contact Patient</a>
                    {patient.caregiver.name !== 'SELF' && 
                    <a href={`tel:${patient.caregiver.phone}`} className="px-3 py-1.5 text-sm font-medium text-gray-800 bg-gray-100 rounded-md hover:bg-gray-200">Contact Caregiver</a>
                    }
                </div>
            </div>

            {/* Biomarker Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {biomarkers.map(biomarker => {
                const biomarkerInfo = BIOMARKER_THRESHOLDS[biomarker];
                const value = latestResult ? latestResult.values[biomarker] : '-';
                const status = latestResult ? getStatusForValue(biomarker, value) : HealthStatus.NORMAL;

                return (
                    <BiomarkerCard
                    key={biomarker}
                    biomarker={biomarker}
                    title={biomarkerInfo.name}
                    status={status}
                    value={value}
                    unit={biomarkerInfo.unit}
                    onClick={() => handleCardClick(biomarker)}
                    />
                );
                })}
            </div>
            
            {/* Biomarker Trend Chart */}
            {selectedBiomarker && (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <button onClick={() => setSelectedBiomarker(null)} className="float-right p-1 rounded-full hover:bg-gray-200 text-gray-500 -mt-2 -mr-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <BiomarkerTrendChart 
                        patientData={patient.results}
                        biomarker={selectedBiomarker}
                    />
                </div>
            )}
        </div>
      )}

      {activeTab === 'history' && (
          <TestHistory patient={patient} />
      )}
    </div>
  );
};