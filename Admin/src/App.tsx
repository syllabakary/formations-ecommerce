import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { AuthProvider, useAuth } from './context/AuthProvider';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Formations from './components/Formations';
import Users from './components/Users';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import Documentation from './components/Documentation';
import CategoryManagement from './components/admin/CategoryManagement';
import LoginModal from './components/LoginModal';
import ErrorBoundary from './components/ErrorBoundary';

// Composant App principal avec AuthProvider
function App() {
  // Composant principal avec authentification
  const AppContent: React.FC = () => {
    useTheme(); // Appliquer le thème

    const { isAuthenticated, login, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Gérer l'affichage de la modal de connexion
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        setShowLoginModal(true);
      } else {
        setShowLoginModal(false);
      }
    }, [isAuthenticated, isLoading]);

    // Gestion de la connexion
    const handleLogin = async (credentials: { email: string; password: string }): Promise<{ success: boolean; requiresVerification?: boolean; userId?: number }> => {
      const result = await login(credentials);
      if (result.success) {
        setShowLoginModal(false);
        setActiveTab('dashboard'); // Rediriger vers le dashboard après connexion
      }
      return result;
    };

    const renderContent = () => {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'formations':
          return <Formations />;
        case 'categories':
          return <CategoryManagement />;
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

    // Écran de chargement pendant la vérification de l'authentification
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#A553C4] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Formation</h2>
            <p className="text-gray-500 dark:text-gray-400">Vérification de l'authentification...</p>
          </div>
        </div>
      );
    }

    // Afficher uniquement la modal de connexion si non authentifié
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-[#A553C4] to-[#6636DD] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-2xl font-bold text-white">FP</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">FormationPro</h1>
              <p className="text-gray-600 dark:text-gray-300">Plateforme d'Administration</p>
            </div>
          </div>

          <LoginModal
            isOpen={showLoginModal}
            onClose={() => {}} // Ne pas permettre de fermer sans se connecter
            onLogin={handleLogin}
          />
        </div>
      );
    }

    // Interface principale pour les utilisateurs authentifiés
    return (
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
    );
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;