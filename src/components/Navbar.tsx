import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, UserCircle, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormationsOpen, setIsFormationsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const formationsRef = useRef<HTMLDivElement>(null);

  const formationCategories = [
    { name: "Formations en ligne", link: "/catalog?type=online" },
    { name: "Formations en présentiel", link: "/catalog?type=in-person" },
  ];

  // Gestion clic extérieur pour fermer le menu formations
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formationsRef.current &&
        !formationsRef.current.contains(event.target as Node)
      ) {
        setIsFormationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              FormationPro
            </Link>
          </div>

          {/* Menu desktop */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className="text-gray-900 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Accueil
            </Link>

            {/* Menu Formations */}
            <div className="relative" ref={formationsRef}>
              <button
                onClick={() => setIsFormationsOpen(!isFormationsOpen)}
                className="flex items-center space-x-1 text-gray-900 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                <span>Nos formations</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isFormationsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isFormationsOpen && (
                <div className="absolute left-0 mt-3 bg-white rounded-xl shadow-lg border border-gray-100 py-4 z-50 w-64">
                  <div className="flex flex-col">
                    {formationCategories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={cat.link}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="text-gray-900 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              À propos
            </Link>

            <Link
              to="/contact"
              className="text-gray-900 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          {/* Actions à droite */}
          <div className="hidden md:flex items-center space-x-4">
            {/* CurrencyToggle component removed due to missing module */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-blue-600" />
                <div className="relative group">
                  <UserCircle className="h-8 w-8 text-gray-600 cursor-pointer" />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
                    >
                      Mon profil
                    </button>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Connexion
              </button>
            )}
          </div>

          {/* Burger mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-900 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <Link
              to="/"
              className="block text-gray-900 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>

            {/* Formations mobile */}
            <div className="space-y-1">
              <p className="px-2 py-1 font-semibold text-gray-900">
                Nos formations
              </p>
              {formationCategories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.link}
                  className="block px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <Link
              to="/about"
              className="block text-gray-900 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>

            <Link
              to="/contact"
              className="block text-gray-900 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            <div className="flex items-center justify-between">
              {/* CurrencyToggle component removed due to missing module */}
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Déconnexion
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Connexion
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;