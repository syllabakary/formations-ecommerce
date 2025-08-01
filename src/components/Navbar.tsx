import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, ShoppingCart, LogOut, ChevronDown, Menu, X, User, Settings } from 'lucide-react';
import Cart from './Cart';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFormationsOpen, setIsFormationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  // État pour les menus de catégories en version mobile
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  const { state } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const formationsRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Fermer les menus déroulants quand on clique en dehors
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

  // Fermer les menus déroulants quand on change de page
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

  const toggleCategoryExpansion = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  // Structure des catégories de formation
  const formationCategories = [
    {
      name: "Développement",
      subcategories: ["Web", "Mobile", "DevOps", "Backend", "Frontend"]
    },
    {
      name: "Data Science",
      subcategories: ["Machine Learning", "Intelligence Artificielle", "Big Data", "Analyse de données"]
    },
    {
      name: "Design",
      subcategories: ["UI/UX", "UX Research", "Graphic Design", "Motion Design"]
    },
    {
      name: "Marketing",
      subcategories: ["Digital", "SEO", "Social Media", "Content Marketing"]
    },
    {
      name: "Management",
      subcategories: ["Gestion de Projet", "Leadership", "Ressources Humaines"]
    },
    {
      name: "RH",
      subcategories: ["Audit", "Leadership", "Ressources Humaines"]
    },
  ];

  return (
    <>
      <nav className="bg-gradient-to-r from-purple-800 via-purple-900 to-indigo-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
              <img 
  src="/asset/LOGO EMPOWER FORMATION/LOGO EF - 3.jpg" 
  alt="Logo Empower Formation"
  className="h-auto w-auto max-h-12 md:max-h-12 lg:max-h-8 object-contain"
/>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative mr-4"
              >
                <ShoppingCart className="h-6 w-6 hover:text-purple-300" />
                {state.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.items.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-purple-700"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link to="/" className="text-white hover:text-pink-300 transition-colors px-3 py-2 rounded-md font-medium">
                Accueil
              </Link>
              <Link to="/apropos" className="text-white hover:text-pink-300 transition-colors px-3 py-2 rounded-md font-medium">
                À propos de Nous
              </Link>
              
              {/* Menu déroulant des formations - Desktop */}
              <div className="relative" ref={formationsRef}>
                <button
                  onClick={() => setIsFormationsOpen(!isFormationsOpen)}
                  className="flex items-center space-x-1 text-white hover:text-pink-300 transition-colors px-3 py-2 rounded-md font-medium"
                >
                  <span>Nos Formations</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isFormationsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFormationsOpen && (
                  <div className="absolute right-auto left-auto mt-2 bg-white rounded-xl shadow-lg py-4 z-50 w-max max-w-screen-md">
                    <div className="flex flex-col">
                      <Link to="/catalog" className="px-4 py-2 text-purple-900 font-medium hover:bg-purple-100 rounded-t-lg whitespace-nowrap">
                        Toutes les formations
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      
                      {/* Grid pour les catégories en desktop */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
                        {formationCategories.map((category) => (
                          <div key={category.name} className="mb-2">
                            <Link 
                              to={`/catalog?category=${category.name}`}
                              className="font-medium text-purple-900 hover:text-purple-700 mb-2 block"
                            >
                              {category.name}
                            </Link>
                            <div className="flex flex-col space-y-1">
                              {category.subcategories.map((subcategory) => (
                                <Link
                                  key={subcategory}
                                  to={`/catalog?category=${category.name}&subcategory=${subcategory}`}
                                  className="text-sm text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 rounded"
                                >
                                  {subcategory}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-200 my-2"></div>
                      <Link to="/catalog" className="px-4 py-2 text-gray-800 hover:bg-purple-100 rounded-b-lg">
                        Nos Formations
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="/blog" className="text-white hover:text-pink-300 transition-colors px-3 py-2 rounded-md font-medium">
                Blog
              </Link>
             
              <Link to="/contacts" className="text-white hover:text-pink-300 transition-colors px-3 py-2 rounded-md font-medium">
                Contactez-nous
              </Link>
              {user ? (
                <>
                  {/* Menu profil */}
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center space-x-2 text-white hover:text-pink-300 transition-colors px-3 py-2 rounded-md font-medium"
                    >
                      <User className="h-4 w-4" />
                      <span>Mon Espace</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50">
                        <Link to="/dashboard" className="px-4 py-3 text-gray-800 hover:bg-purple-100 flex items-center space-x-2 block">
                          <User className="h-4 w-4 text-purple-700" />
                          <span>Mon profil</span>
                        </Link>
                        <Link to="/settings" className="px-4 py-3 text-gray-800 hover:bg-purple-100 flex items-center space-x-2 block">
                          <Settings className="h-4 w-4 text-purple-700" />
                          <span>Paramètres</span>
                        </Link>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="px-5 py-2 rounded-md bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transition-colors shadow-md font-medium"
                >
                  Se connecter
                </Link>
              )}
              
              <button
                className="relative group"
                onClick={() => setIsCartOpen(true)}
              >
                <div className="p-2 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all">
                  <ShoppingCart className="h-5 w-5 group-hover:text-pink-300" />
                </div>
                {state.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                    {state.items.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu amélioré */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-purple-900 shadow-inner">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-white hover:bg-purple-800 rounded-md">
                Accueil
              </Link>
              <Link to="/apropos" className="block px-3 py-2 text-white hover:bg-purple-800 rounded-md">
                À propos de nous
              </Link>
              
              
              {/* Menu mobile des formations avec accordéon */}
              <div className="space-y-1">
                {formationCategories.map((category) => (
                  <div key={category.name} className="border-l-2 border-purple-700 ml-2">
                    {/* Titre de catégorie cliquable */}
                    <button 
                      onClick={() => toggleCategoryExpansion(category.name)}
                      className="flex justify-between items-center w-full px-3 py-2 text-white hover:bg-purple-800 rounded-md"
                    >
                      <span className="font-medium">{category.name}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedCategory === category.name ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Sous-catégories avec animation */}
                    {expandedCategory === category.name && (
                      <div className="ml-4 space-y-1 animate-fadeIn">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory}
                            to={`/catalog?category=${category.name}&subcategory=${subcategory}`}
                            className="block px-3 py-2 text-purple-200 hover:bg-purple-800 rounded-md text-sm"
                          >
                            {subcategory}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                <Link to="/catalog" className="block px-3 py-2 text-white hover:bg-purple-800 rounded-md mt-2">
                  Nos formations
                </Link>
              </div>
              
              <Link to="/blog" className="block px-3 py-2 text-white hover:bg-purple-800 rounded-md">
                Blog
              </Link>
              <Link to="/contacts" className="block px-3 py-2 text-white hover:bg-purple-800 rounded-md">
                Contactez-nous
              </Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-3 py-2 text-white hover:bg-purple-800 rounded-md">
                    Mon Profil
                  </Link>
                  <Link to="/settings" className="block px-3 py-2 text-white hover:bg-purple-800 rounded-md">
                    Paramètres
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 text-white hover:bg-red-700 rounded-md"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="block px-3 py-2 text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-md"
                >
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;