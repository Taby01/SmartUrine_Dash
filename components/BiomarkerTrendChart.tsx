import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Biomarker, type TestResult } from '../types';
import { BIOMARKER_THRESHOLDS } from '../constants';

interface BiomarkerTrendChartProps {
  patientData: TestResult[];
  biomarker: Biomarker;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const BiomarkerTrendChart: React.FC<BiomarkerTrendChartProps> = ({ patientData, biomarker }) => {
  const biomarkerInfo = BIOMARKER_THRESHOLDS[biomarker];

  const chartData = patientData
    .map(result => ({
      name: formatDate(result.date),
      value: result.values[biomarker],
    }))
    .filter(item => typeof item.value === 'number'); // Only chart numerical values

  let chartContent;

  if (!biomarkerInfo) {
    chartContent = <p className="text-center text-gray-500">Biomarker details not found.</p>;
  } else if (chartData.length < 2) {
    chartContent = <p className="text-center text-gray-500">Not enough data to plot a trend for {biomarkerInfo.name}.</p>;
  } else {
    chartContent = (
      <>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{biomarkerInfo.name} Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(2px)',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value) => [`${value} ${biomarkerInfo.unit || ''}`, biomarkerInfo.name]}
            />
            <Legend wrapperStyle={{fontSize: "12px"}} />
            <Line type="monotone" dataKey="value" name={biomarkerInfo.name} stroke="#0EA5E9" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </>
    );
  }

  return (
    <>
      {chartContent}
    </>
  );
};
