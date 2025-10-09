import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Biomarker, type TestResult } from '../types';
import { BIOMARKER_THRESHOLDS } from '../constants';

interface PatientChartsProps {
  patientData: TestResult[];
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const PatientCharts: React.FC<PatientChartsProps> = ({ patientData }) => {
  if (!patientData || patientData.length === 0) {
    return <p className="text-center text-gray-500">No data available to display charts.</p>;
  }

  const chartData = patientData.map(result => ({
    name: formatDate(result.date),
    pH: result.values[Biomarker.PH],
    Protein: result.values[Biomarker.PROTEIN],
    'Specific Gravity': result.values[Biomarker.SPECIFIC_GRAVITY],
  }));

  const latestResultData = Object.entries(patientData[patientData.length - 1].values)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({
      name: BIOMARKER_THRESHOLDS[key as Biomarker]?.name.substring(0, 10) || key.substring(0,10),
      value: value
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Key Metric Trends</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(2px)',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
              }}
            />
            <Legend wrapperStyle={{fontSize: "12px"}} />
            <Line type="monotone" dataKey="pH" stroke="#38bdf8" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Protein" stroke="#f472b6" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Specific Gravity" name="SG" stroke="#34d399" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
       <div>
        <h4 className="font-semibold text-gray-700 mb-2">Latest Results Overview</h4>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={latestResultData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={10} width={80} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(2px)',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                    }}
                />
                <Bar dataKey="value" fill="#0EA5E9" background={{ fill: '#eee' }} />
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};