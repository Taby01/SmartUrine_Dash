import React from 'react';
import type { Doctor, Patient } from '../types';
import { PatientSelection } from './PatientSelection';
import { DoctorPatientView } from './DoctorPatientView';

interface DoctorDashboardProps {
  doctor: Doctor;
  allPatients: Patient[];
  selectedPatientId: number | null;
  setSelectedPatientId: (id: number | null) => void;
  addPatient: (newPatientData: Omit<Patient, 'id' | 'results' | 'avatar'>) => void;
  removePatient: (patientId: number) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ doctor, allPatients, selectedPatientId, setSelectedPatientId, addPatient, removePatient }) => {
  const doctorPatients = allPatients.filter(p => doctor.patientIds.includes(p.id));
  const selectedPatient = allPatients.find(p => p.id === selectedPatientId) || null;

  const handleBack = () => {
    setSelectedPatientId(null);
  };

  if (selectedPatient) {
    return <DoctorPatientView patient={selectedPatient} onBack={handleBack} />;
  }

  return <PatientSelection 
            patients={doctorPatients} 
            allPatients={allPatients}
            onSelectPatient={setSelectedPatientId}
            onAddPatient={addPatient}
            onRemovePatient={removePatient}
         />;
};