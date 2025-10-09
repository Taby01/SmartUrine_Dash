import React, { useState } from 'react';
import type { Patient, Doctor } from '../types';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (user: Patient | Doctor, role: UserRole) => void;
  initialPatients: Patient[];
  initialDoctors: Doctor[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, initialPatients, initialDoctors }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'patient') {
      if (username === 'admin' && password === 'password123') {
        const patientUser = initialPatients.find(p => p.id === 1); // Eleanor Vance
        if (patientUser) {
          onLogin(patientUser, UserRole.PATIENT);
        } else {
          setError('Default patient user not found.');
        }
      } else {
        setError('Invalid username or password.');
      }
    } else { // Doctor login
      if (username === 'david' && password === '1234') {
        const doctorUser = initialDoctors.find(d => d.name === 'Dr. David');
        if (doctorUser) {
          onLogin(doctorUser, UserRole.DOCTOR);
        } else {
          setError('Default doctor user not found.');
        }
      } else {
        setError('Invalid username or password.');
      }
    }
  };

  const getPlaceholder = (field: 'user' | 'pass') => {
      if (activeTab === 'patient') {
          return field === 'user' ? 'admin' : 'password123';
      }
      return field === 'user' ? 'david' : '1234';
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <svg className="w-10 h-10 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"></path>
          </svg>
          <h1 className="text-3xl font-bold text-gray-800 ml-3">SmartUrine</h1>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => {setActiveTab('patient'); setError('');}}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'patient'
                    ? 'border-brand-blue text-brand-blue-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Patient Login
              </button>
              <button
                onClick={() => {setActiveTab('doctor'); setError('');}}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'doctor'
                    ? 'border-brand-blue text-brand-blue-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Doctor Login
              </button>
            </nav>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-700 mb-1">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-6">Please sign in to your {activeTab} portal.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  placeholder={getPlaceholder('user')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  placeholder={getPlaceholder('pass')}
                />
              </div>
            </div>
            
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
              >
                Sign in
              </button>
            </div>
          </form>

          {activeTab === 'patient' && (
            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-brand-blue hover:text-brand-blue-dark">
                Create one
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};