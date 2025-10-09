import React from 'react';
// FIX: Imported Biomarker from types.ts instead of constants.ts and consolidated type imports.
import { HealthStatus, Biomarker, type TestResult } from '../types';
import { BIOMARKER_THRESHOLDS } from '../constants';

interface ResultsTableProps {
  results: TestResult[];
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

const ValueCell: React.FC<{ biomarker: Biomarker; value: number | string }> = ({ biomarker, value }) => {
  const status = getStatusForValue(biomarker, value);
  const unit = BIOMARKER_THRESHOLDS[biomarker].unit;
  
  const statusClasses: Record<HealthStatus, string> = {
    [HealthStatus.NORMAL]: 'text-gray-700',
    [HealthStatus.CAUTION]: 'text-yellow-600 font-semibold bg-yellow-50 px-2 py-0.5 rounded',
    [HealthStatus.ALERT]: 'text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded',
  };

  return (
    <td className={`px-4 py-3 text-sm whitespace-nowrap ${statusClasses[status]}`}>
      {value} {unit}
      {status !== HealthStatus.NORMAL && (
        <span className="ml-1">
          {status === HealthStatus.CAUTION ? '▲' : '●'}
        </span>
      )}
    </td>
  );
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return <p className="text-center text-gray-500">No recent results found.</p>;
  }

  const biomarkers = Object.keys(BIOMARKER_THRESHOLDS) as Biomarker[];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            {biomarkers.map((b) => (
              <th key={b} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {BIOMARKER_THRESHOLDS[b].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((result) => (
            <tr key={result.date} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                {new Date(result.date).toLocaleString()}
              </td>
              {biomarkers.map((b) => (
                <ValueCell key={b} biomarker={b} value={result.values[b]} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};