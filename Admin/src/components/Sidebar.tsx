// components/Sidebar.tsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  FileText, 
  LogOut,
  ChevronDown,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen
}) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Configuration des éléments de navigation
  const navigation = [
    {
      name: 'Dashboard',
      key: 'dashboard',
      icon: LayoutDashboard,
      description: 'Vue d\'ensemble'
    },
    {
      name: 'Formations',
      key: 'formations',
      icon: BookOpen,
      description: 'Gestion des formations'
    },
    {
      name: 'Catégories',
      key: 'categories',
      icon: FolderOpen,
      description: 'Gestion des catégories'
    },
    {
      name: 'Utilisateurs',
      key: 'users',
      icon: Users,
      description: 'Gestion des utilisateurs'
    },
    {
      name: 'Statistiques',
      key: 'statistics',
      icon: BarChart3,
      description: 'Analyses et rapports'
    },
    {
      name: 'Documentation',
      key: 'documentation',
      icon: FileText,
      description: 'Guide d\'utilisation'
    },
    {
      name: 'Paramètres',
      key: 'settings',
      icon: Settings,
      description: 'Configuration'
    }
  ];

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      setUserMenuOpen(false);
      setIsOpen(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false); // Fermer la sidebar sur mobile après sélection
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header avec logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#A553C4] to-[#6636DD] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">FP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Formation</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administration</p>
            </div>
          </div>
          
          {/* Bouton fermer pour mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            
            return (
              <button
                key={item.key}
                onClick={() => handleTabChange(item.key)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                }`} />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className={`text-xs mt-0.5 ${
                    isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {item.description}
                  </div>
                </div>
                
                {/* Indicateur pour l'onglet actif */}
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profil utilisateur et déconnexion */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <img
                className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=A553C4&color=fff&size=40`}
                alt={user?.name}
              />
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                userMenuOpen ? 'transform rotate-180' : ''
              }`} />
            </button>

            {/* Menu utilisateur */}
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleTabChange('settings');
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <User className="h-4 w-4 mr-3" />
                  Mon Profil
                </button>
                
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleTabChange('settings');
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Préférences
                </button>
                
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Version de l'application */}
        <div className="px-4 pb-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              FormationPro Admin v1.0.0
            </p>
          </div>
        </div>
      </div>

      {/* Clic à l'extérieur pour fermer le menu utilisateur */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;