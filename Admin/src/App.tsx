import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { AuthProvider } from '../../src/context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Formations from './components/Formations';
import Users from './components/Users';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import Documentation from './components/Documentation';
import FormationPresentiel from './components/FormationPresentiel';

function App() {
  useTheme(); // Appliquer le thème
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'formations':
        return <Formations />;
      case 'formations presentielles':
        return <FormationPresentiel />;
      case 'users':
        return <Users />;
      case 'statistics':
        return <Statistics />;
      case 'documentation':
        return <Documentation />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        <div className="lg:ml-64">
          <Header setSidebarOpen={setSidebarOpen} />
          <main className="p-4 lg:p-8 dark:text-white">
            {renderContent()}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;