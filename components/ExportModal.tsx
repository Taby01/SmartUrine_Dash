
import React, { useState, useEffect } from 'react';
import { Biomarker } from '../types';
import { BIOMARKER_THRESHOLDS } from '../constants';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: { dateRange: string; biomarkers: Biomarker[] }) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
  const allBiomarkers = Object.keys(BIOMARKER_THRESHOLDS) as Biomarker[];
  
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<Biomarker[]>(allBiomarkers);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setSelectedDateRange('all');
      setSelectedBiomarkers(allBiomarkers);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleBiomarkerChange = (biomarker: Biomarker) => {
    setSelectedBiomarkers(prev =>
      prev.includes(biomarker) ? prev.filter(b => b !== biomarker) : [...prev, biomarker]
    );
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBiomarkers(e.target.checked ? allBiomarkers : []);
  };

  const handleConfirmExport = () => {
    onExport({
      dateRange: selectedDateRange,
      biomarkers: selectedBiomarkers,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Export Options</h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Range Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Select Date Range</h4>
            <div className="flex flex-wrap gap-2">
              {['Last Month', 'Last 3 Months', 'This Year', 'All Time'].map(range => (
                <button
                  key={range}
                  onClick={() => setSelectedDateRange(range.toLowerCase().replace(' ', ''))}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    selectedDateRange === range.toLowerCase().replace(' ', '')
                      ? 'bg-brand-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Biomarker Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Select Biomarkers</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                <label className="flex items-center p-2 rounded-md hover:bg-gray-50">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                        checked={selectedBiomarkers.length === allBiomarkers.length}
                        onChange={handleSelectAllChange}
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-800">Select All</span>
                </label>
                {allBiomarkers.map(biomarker => (
                    <label key={biomarker} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                            checked={selectedBiomarkers.includes(biomarker)}
                            onChange={() => handleBiomarkerChange(biomarker)}
                        />
                        <span className="ml-3 text-sm text-gray-600">{BIOMARKER_THRESHOLDS[biomarker].name}</span>
                    </label>
                ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmExport}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue-dark"
          >
            Confirm Export
          </button>
        </div>
      </div>
    </div>
  );
};
