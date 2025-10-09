
import React, { useState } from 'react';
import type { Patient } from '../types';
import { ResultsTable } from './ResultsTable';
import { ExportModal } from './ExportModal';
import type { Biomarker } from '../types';

interface HistoryProps {
    patient: Patient;
}

export const TestHistory: React.FC<HistoryProps> = ({ patient }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleExport = (options: { dateRange: string; biomarkers: Biomarker[] }) => {
        console.log('Exporting with options:', options);
        // In a real application, you would filter patient.results based on the options
        // and then generate the PDF, CSV, or email.
        setIsModalOpen(false);
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Test Result History</h2>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">All Results</h3>
                    <div className="mt-2 sm:mt-0 space-x-2">
                        <button onClick={() => setIsModalOpen(true)} className="px-3 py-1.5 text-sm font-medium text-brand-blue-dark bg-brand-blue-light rounded-md hover:bg-blue-200">Export PDF</button>
                        <button onClick={() => setIsModalOpen(true)} className="px-3 py-1.5 text-sm font-medium text-brand-green-dark bg-brand-green-light rounded-md hover:bg-green-200">Export CSV</button>
                        <button onClick={() => setIsModalOpen(true)} className="px-3 py-1.5 text-sm font-medium text-purple-800 bg-purple-100 rounded-md hover:bg-purple-200">Email Results</button>
                    </div>
                </div>
                <ResultsTable results={patient.results.slice().reverse()} />
            </div>
             <ExportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onExport={handleExport}
            />
        </div>
    );
};