import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings, 
  Bell,
  FileText,
  Shield,
  X,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'formations', label: 'Formations', icon: BookOpen },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'logs', label: 'Historique', icon: FileText },
    { id: 'documentation', label: 'Documentation', icon: HelpCircle },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
       {/* Sidebar */}
       <div className={`fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 ">
          <div className="flex items-center space-x-3">
            {/* Logo Image */}
            <img 
              src="/asset/LOGO_EMPOWER_FORMATION/LOGO EF - 3 - PNG.png" 
              alt="" 
              className="w-8 h-8 rounded-xl object-cover"
            />
            <div>
              
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Version Info */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">FormationPro Admin</p>
            <p className="text-xs font-medium text-gray-700">Version 2.1.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;