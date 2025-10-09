import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Alerts } from './components/Alerts';
import { Settings } from './components/Settings';
import { TestHistory } from './components/TestHistory';
import { LoginPage } from './components/LoginPage';
import { DoctorDashboard } from './components/DoctorDashboard';
import type { Patient, Doctor } from './types';
import { Page, UserRole } from './types';
import { patients as initialPatients, doctors as initialDoctors } from './constants';


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Patient | Doctor | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);

  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // State lifted from DoctorDashboard
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const handleLogin = (user: Patient | Doctor, role: UserRole) => {
    let currentUserInState: Patient | Doctor | undefined;
    if (role === UserRole.PATIENT) {
        currentUserInState = patients.find(p => p.id === user.id);
    } else {
        currentUserInState = doctors.find(d => d.id === user.id);
    }
    
    if (currentUserInState) {
        setCurrentUser(currentUserInState);
        setUserRole(role);
        setIsAuthenticated(true);
        setCurrentPage(role === UserRole.DOCTOR ? Page.DASHBOARD : Page.DASHBOARD);
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserRole(null);
    setSelectedPatientId(null); // Reset patient selection on logout
  };
  
  const handleAddPatient = (newPatientData: Omit<Patient, 'id' | 'results' | 'avatar'>) => {
      setPatients(prevPatients => {
          const newId = (prevPatients.length > 0 ? Math.max(...prevPatients.map(p => p.id)) : 0) + 1;
          const newPatient: Patient = {
              ...newPatientData,
              id: newId,
              results: [],
              avatar: `https://picsum.photos/seed/${newPatientData.name.split(' ')[0]}/100/100`,
          };

          setDoctors(prevDoctors => {
              const updatedDoctors = prevDoctors.map(doc => {
                  if (doc.id === (currentUser as Doctor).id) {
                      const updatedDoc = {...doc, patientIds: [...doc.patientIds, newId]};
                      setCurrentUser(updatedDoc); // Update current user state as well
                      return updatedDoc;
                  }
                  return doc;
              });
              return updatedDoctors;
          });

          return [...prevPatients, newPatient];
      });
  };

  const handleRemovePatient = (patientId: number) => {
      setDoctors(prevDoctors => {
          return prevDoctors.map(doc => {
              if (doc.id === (currentUser as Doctor).id) {
                  const newPatientIds = doc.patientIds.filter(id => id !== patientId);
                  setCurrentUser(prevUser => ({...prevUser as Doctor, patientIds: newPatientIds}));
                  return {...doc, patientIds: newPatientIds};
              }
              return doc;
          });
      });
  };

  if (!isAuthenticated || !currentUser) {
    return <LoginPage onLogin={handleLogin} initialPatients={patients} initialDoctors={doctors} />;
  }
  
  const renderPatientContent = (patient: Patient) => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard patient={patient} />;
      case Page.HISTORY:
        return <TestHistory patient={patient} />;
      case Page.SETTINGS:
        return <Settings patient={patient} />;
      default:
        return <Dashboard patient={patient} />;
    }
  };
  
  const mainContent = () => {
      if (userRole === UserRole.DOCTOR) {
          const doctor = currentUser as Doctor;
          switch (currentPage) {
              case Page.DASHBOARD:
                  return <DoctorDashboard 
                            doctor={doctor}
                            allPatients={patients}
                            selectedPatientId={selectedPatientId}
                            setSelectedPatientId={setSelectedPatientId}
                            addPatient={handleAddPatient}
                            removePatient={handleRemovePatient}
                         />;
              case Page.ALERTS:
                  return <Alerts 
                            doctor={doctor}
                            setSelectedPatientId={setSelectedPatientId}
                            setCurrentPage={setCurrentPage}
                         />;
              case Page.SETTINGS:
                   return <div className="text-center p-8 bg-white rounded-lg shadow-md">Doctor Settings page coming soon.</div>;
              default:
                  return <DoctorDashboard doctor={doctor} allPatients={patients} selectedPatientId={selectedPatientId} setSelectedPatientId={setSelectedPatientId} addPatient={handleAddPatient} removePatient={handleRemovePatient} />;
          }
      }
      if (userRole === UserRole.PATIENT) {
          return renderPatientContent(currentUser as Patient);
      }
      return <div>Error: User role not recognized.</div>;
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar
        user={currentUser}
        userRole={userRole!}
        currentPage={currentPage}
        onNavigate={(page) => {
            if(userRole === UserRole.DOCTOR && selectedPatientId) {
                setSelectedPatientId(null);
            }
            setCurrentPage(page);
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={currentUser}
          userRole={userRole!}
          currentPage={currentPage} 
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          {mainContent()}
        </main>
      </div>
    </div>
  );
};

export default App;