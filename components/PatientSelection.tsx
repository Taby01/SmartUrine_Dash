import React, { useState, useMemo } from 'react';
import type { Patient, Biomarker } from '../types';
import { HealthStatus, Gender } from '../types';
import { BIOMARKER_THRESHOLDS } from '../constants';
import { AddNewPatientModal } from './AddNewPatientModal';

interface PatientSelectionProps {
  patients: Patient[];
  allPatients: Patient[];
  onSelectPatient: (patientId: number) => void;
  onAddPatient: (newPatientData: Omit<Patient, 'id' | 'results' | 'avatar'>) => void;
  onRemovePatient: (patientId: number) => void;
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

const PatientListItem: React.FC<{ patient: Patient; onClick: () => void, onRemove: () => void }> = ({ patient, onClick, onRemove }) => {
  const latestResult = patient.results.length > 0 ? patient.results[patient.results.length - 1] : null;
  let hasAlerts = false;
  if (latestResult) {
    for (const key in latestResult.values) {
        const biomarker = key as Biomarker;
        const value = latestResult.values[biomarker];
        const status = getStatusForValue(biomarker, value);
        if (status === HealthStatus.ALERT || status === HealthStatus.CAUTION) {
            hasAlerts = true;
            break;
        }
    }
  }
  const statusColor = hasAlerts ? 'border-status-red' : 'border-status-green';

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove ${patient.name} from your supervision list?`)) {
        onRemove();
    }
  };

  return (
    <div className={`w-full bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-2 border-l-4 ${statusColor}`}>
      <button onClick={onClick} className="flex-grow flex items-center space-x-4 p-2 rounded-md hover:bg-gray-50 w-full text-left">
          <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-full object-cover" />
          <div className="flex-grow">
            <p className="font-semibold text-gray-800">{patient.name}</p>
            <p className="text-sm text-gray-500">{patient.age} years · {patient.gender}</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-gray-500">Last Test</p>
            <p className="font-medium text-gray-700">{latestResult ? new Date(latestResult.date).toLocaleDateString() : 'N/A'}</p>
          </div>
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </button>
      <button onClick={handleRemoveClick} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export const PatientSelection: React.FC<PatientSelectionProps> = ({ patients, allPatients, onSelectPatient, onAddPatient, onRemovePatient }) => {
  const hospitals = useMemo(() => [...new Set(allPatients.map(p => p.hospital))], [allPatients]);
  
  const [selectedHospital, setSelectedHospital] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<Gender | 'All'>('All');
  const [ageRange, setAgeRange] = useState({ min: '', max: '' });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const filteredPatients = useMemo(() => patients.filter(p => {
    if (selectedHospital !== 'All' && p.hospital !== selectedHospital) return false;
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (genderFilter !== 'All' && p.gender !== genderFilter) return false;
    if (ageRange.min && p.age < parseInt(ageRange.min)) return false;
    if (ageRange.max && p.age > parseInt(ageRange.max)) return false;
    return true;
  }), [patients, selectedHospital, searchTerm, genderFilter, ageRange]);

  const handleAddNewPatient = (newPatientData: Omit<Patient, 'id' | 'results' | 'avatar'>) => {
      onAddPatient(newPatientData);
      setIsAddModalOpen(false);
  }
  
  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">My Patients</h2>
            <p className="text-gray-500 mt-1">Search, filter, and manage your supervised patients.</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                />
                <select value={selectedHospital} onChange={e => setSelectedHospital(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-brand-blue focus:border-brand-blue">
                    <option value="All">All Hospitals</option>
                    {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <select value={genderFilter} onChange={e => setGenderFilter(e.target.value as Gender | 'All')} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-brand-blue focus:border-brand-blue">
                    <option value="All">All Genders</option>
                    {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <div className="flex items-center space-x-2">
                    <input type="number" placeholder="Min Age" value={ageRange.min} onChange={e => setAgeRange(prev => ({...prev, min: e.target.value}))} className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
                    <input type="number" placeholder="Max Age" value={ageRange.max} onChange={e => setAgeRange(prev => ({...prev, max: e.target.value}))} className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Add New Patient
                </button>
            </div>
        </div>

        <div className="space-y-3">
            {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                    <PatientListItem 
                        key={patient.id}
                        patient={patient}
                        onClick={() => onSelectPatient(patient.id)}
                        onRemove={() => onRemovePatient(patient.id)}
                    />
                ))
            ) : (
                <div className="text-center text-gray-500 py-8 bg-white rounded-lg shadow-sm">
                    <p>No patients match the current filters.</p>
                </div>
            )}
        </div>
        <AddNewPatientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddPatient={handleAddNewPatient} />
    </div>
  );
};