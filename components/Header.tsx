
import React from 'react';
import { Page, UserRole, type Patient, type Doctor } from '../types';

interface HeaderProps {
  currentPage: Page;
  user: Patient | Doctor;
  userRole: UserRole;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, user, userRole, onMenuClick }) => {
  const getTitle = () => {
    if (userRole === UserRole.DOCTOR) {
        return "Patient Dashboard";
    }
    return currentPage;
  };

  return (
    <header className="flex-shrink-0 bg-white border-b h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="lg:hidden mr-4 text-gray-600 hover:text-gray-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{getTitle()}</h2>
      </div>
      <div className="flex items-center">
        <div className="relative">
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
        </div>
        <div className="ml-4 flex items-center">
            <img className="w-10 h-10 rounded-full object-cover" src={user.avatar} alt="User Avatar"/>
            <div className="ml-3 hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{userRole === UserRole.PATIENT ? 'Patient Portal' : 'Doctor Portal'}</p>
            </div>
        </div>
      </div>
    </header>
  );
};