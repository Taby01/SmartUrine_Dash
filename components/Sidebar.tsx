import React from 'react';
import type { Patient, Doctor } from '../types';
import { Page, UserRole } from '../types';

interface SidebarProps {
  user: Patient | Doctor;
  userRole: UserRole;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const NavLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-white bg-brand-blue'
        : 'text-gray-600 hover:bg-brand-blue-light hover:text-brand-blue-dark'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  userRole,
  currentPage,
  onNavigate,
  isOpen,
  setIsOpen,
  onLogout,
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className={`fixed lg:static top-0 left-0 h-full bg-white shadow-xl z-40 w-64 lg:w-72 flex-shrink-0 flex flex-col transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center h-24 border-b p-4">
          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
          <div className="ml-3">
            <p className="font-semibold text-gray-800">{user.name}</p>
            {userRole === UserRole.PATIENT ? (
              <p className="text-sm text-gray-500">{(user as Patient).age} years</p>
            ) : (
              <p className="text-sm text-gray-500">Doctor Portal</p>
            )}
          </div>
        </div>
        <nav className="py-4 flex-1">
          {userRole === UserRole.PATIENT ? (
            <>
              <NavLink
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>}
                label="Dashboard"
                isActive={currentPage === Page.DASHBOARD}
                onClick={() => { onNavigate(Page.DASHBOARD); setIsOpen(false); }}
              />
              <NavLink
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}
                label="Test History"
                isActive={currentPage === Page.HISTORY}
                onClick={() => { onNavigate(Page.HISTORY); setIsOpen(false); }}
              />
              <NavLink
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
                label="Settings"
                isActive={currentPage === Page.SETTINGS}
                onClick={() => { onNavigate(Page.SETTINGS); setIsOpen(false); }}
              />
            </>
          ) : (
             <>
                <NavLink
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
                    label="Patients"
                    isActive={currentPage === Page.DASHBOARD}
                    onClick={() => { onNavigate(Page.DASHBOARD); setIsOpen(false); }}
                />
                <NavLink
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>}
                    label="Alerts"
                    isActive={currentPage === Page.ALERTS}
                    onClick={() => { onNavigate(Page.ALERTS); setIsOpen(false); }}
              />
             </>
          )}
        </nav>
        <div className="p-4 border-t">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 transition-colors duration-200 rounded-md hover:bg-red-50 hover:text-red-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span className="ml-3">Logout</span>
            </button>
            <div className="flex items-center justify-center h-10 mt-4">
                <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"></path></svg>
                <h1 className="text-lg font-bold text-gray-800 ml-2">SmartUrine</h1>
            </div>
        </div>
      </div>
    </>
  );
};