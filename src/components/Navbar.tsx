import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, ShoppingCart, LogOut, ChevronDown, Menu, X, User, Settings } from 'lucide-react';
import Cart from './Cart';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFormationsOpen, setIsFormationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  const { state } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const formationsRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formationsRef.current && !formationsRef.current.contains(event.target)) {
        setIsFormationsOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsFormationsOpen(false);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setExpandedCategory(null);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src="/asset/logos/logo-ef-3.jpg"
                  alt="Empower Formation"
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>
            
            {/* Navigation principale - Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-gray-900 hover:text-blue-600 font-medium transition-colors duration-200">
                Accueil
              </Link>
              
              <Link to="/apropos" className="text-gray-900 hover:text-blue-600 font-medium transition-colors duration-200">
                À propos
              </Link>
              
              {/* Menu Formations */}
              <div className="relative" ref={formationsRef}>
                <button
                  onClick={() => setIsFormationsOpen(!isFormationsOpen)}
                  className="flex items-center space-x-1 text-gray-900 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  <span>Nos formations</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isFormationsOpen ? 'rotate-180' : ''}`} />
                </button>
               
                {isFormationsOpen && (
                  <div className="absolute left-0 mt-3 bg-white rounded-xl shadow-lg border border-gray-100 py-6 z-50 w-[400px]">
                    <div className="px-6 space-y-4">
                      <Link 
                        to="/catalog" 
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition-colors"
                      >
                        Voir toutes les formations
                      </Link>

                      {/* Nouvelles options */}
                      <div className="flex flex-col space-y-2">
                        <Link 
                          to="/catalog?type=en-ligne" 
                          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                        >
                          📡 Formations en ligne
                        </Link>
                        <Link 
                          to="/catalog?type=presentiel" 
                          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                        >
                          🏫 Formations en présentiel
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="/blog" className="text-gray-900 hover:text-blue-600 font-medium transition-colors duration-200">
                Blog
              </Link>
            
              <Link to="/contacts" className="text-gray-900 hover:text-blue-600 font-medium transition-colors duration-200">
                Contact
              </Link>
            </div>
            
            {/* Actions de droite */}
            <div className="flex items-center space-x-4">
              
              {/* Desktop Auth */}
              <div className="hidden lg:flex items-center space-x-4">
                {user ? (
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                        <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>Mon profil</span>
                        </Link>
                        <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <Settings className="h-4 w-4 text-gray-500" />
                          <span>Paramètres</span>
                        </Link>
                        <hr className="my-2 border-gray-100" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link to="/login?setIsLogin=true" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                      Inscription
                    </Link>
                    <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                      Connexion
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Panier */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShoppingCart className="h-6 w-6 text-gray-700" />
                {state.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {state.items.length}
                  </span>
                )}
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-1">
              
              <Link to="/" className="block px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg font-medium">
                Accueil
              </Link>
              
              <Link to="/apropos" className="block px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg font-medium">
                À propos
              </Link>

              {/* Formations Mobile */}
              <div className="space-y-1">
                <Link to="/catalog" className="block px-4 py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg">
                  Nos formations
                </Link>
                <div className="ml-4 space-y-1">
                  <Link to="/catalog?type=en-ligne" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    📡 Formations en ligne
                  </Link>
                  <Link to="/catalog?type=presentiel" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    🏫 Formations en présentiel
                  </Link>
                </div>
              </div>
              
              <Link to="/blog" className="block px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg font-medium">
                Blog
              </Link>
              
              <Link to="/contacts" className="block px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg font-medium">
                Contact
              </Link>
              
              {/* Auth Mobile */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                {user ? (
                  <>
                    <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Mon profil</span>
                    </Link>
                    <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg">
                      <Settings className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Paramètres</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Déconnexion</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login?setIsLogin=true" className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
                      Inscription
                    </Link>
                    <Link to="/login" className="block px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium text-center">
                      Connexion
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
