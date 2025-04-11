import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ShoppingCart, LogOut } from 'lucide-react';
import Cart from './Cart';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { state } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-purple-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8" />
                <span className="text-xl font-bold">EMPOWER FORMATION</span>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link to="/" className="hover:text-purple-300 transition-colors">
                  Accueil
                </Link>
                <Link to="/catalog" className="hover:text-purple-300 transition-colors">
                  Formations
                </Link>
                <Link to="/blog" className="hover:text-purple-300 transition-colors">
                  Blog
                </Link>
                {user ? (
                  <>
                    <Link to="/dashboard" className="hover:text-purple-300 transition-colors">
                      Mes Formations
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="px-4 py-2 rounded bg-[#C71585] hover:bg-[#A020F0] transition-colors">
                    Se connecter
                  </Link>
                )}
                <button 
                  className="relative"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-6 w-6 hover:text-purple-300" />
                  {state.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#C71585] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {state.items.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;