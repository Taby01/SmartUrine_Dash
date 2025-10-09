import React, { useState } from 'react';
import type { Patient } from '../types';
import { HealthStatus, Biomarker } from '../types';
import { BIOMARKER_THRESHOLDS } from '../constants';
import { BiomarkerCard } from './BiomarkerCard';
import { BiomarkerTrendChart } from './BiomarkerTrendChart';

interface DashboardProps {
  patient: Patient;
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


export const Dashboard: React.FC<DashboardProps> = ({ patient }) => {
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker | null>(null);

  const latestResult = patient.results.length > 0 ? patient.results[patient.results.length - 1] : null;
  const biomarkers = Object.keys(BIOMARKER_THRESHOLDS) as Biomarker[];

  const handleCardClick = (biomarker: Biomarker) => {
    setSelectedBiomarker(biomarker);
  };

  return (
    <div className="space-y-6">
      {/* Time/Status Header */}
      <div className="bg-white p-4 rounded-lg shadow-md flex justify-start items-center">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-brand-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <div className="ml-3">
            <p className="text-sm text-gray-500">Latest Test Result</p>
            <p className="font-semibold text-gray-800">{latestResult ? new Date(latestResult.date).toLocaleString() : 'No results yet'}</p>
          </div>
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
              <BiomarkerTrendChart 
                  patientData={patient.results}
                  biomarker={selectedBiomarker}
              />
          </div>
      )}
    </div>
  );
};