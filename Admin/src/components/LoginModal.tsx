import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import Modal from './Modal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { email: string; password: string }) => Promise<boolean>;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await onLogin(formData);
      if (success) {
        onClose();
        setFormData({ email: '', password: '' });
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', password: '' });
    setError('');
    setShowPassword(false);
    onClose();
  };

  // Comptes de démonstration
  const demoAccounts = [
    { email: 'admin@formationpro.com', password: 'admin123', role: 'Administrateur' },
    { email: 'instructor@formationpro.com', password: 'instructor123', role: 'Instructeur' },
    { email: 'student@formationpro.com', password: 'student123', role: 'Étudiant' }
  ];

  const fillDemoAccount = (account: typeof demoAccounts[0]) => {
    setFormData({ email: account.email, password: account.password });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Connexion Administrateur" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo et titre */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#A553C4] to-[#6636DD] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bienvenue</h2>
          <p className="text-gray-600">Connectez-vous à votre espace d'administration</p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Champ Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse email *
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent transition-colors"
              placeholder="admin@formationpro.com"
              disabled={isLoading}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Champ Mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent transition-colors"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Options de connexion */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2 text-[#A553C4] focus:ring-[#A553C4] rounded"
            />
            <span className="text-sm text-gray-700">Se souvenir de moi</span>
          </label>
          <button
            type="button"
            className="text-sm text-[#A553C4] hover:text-[#6636DD] transition-colors"
          >
            Mot de passe oublié ?
          </button>
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Connexion...</span>
            </div>
          ) : (
            'Se connecter'
          )}
        </button>

        {/* Comptes de démonstration */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Comptes de démonstration :</h4>
          <div className="space-y-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillDemoAccount(account)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{account.role}</p>
                    <p className="text-xs text-gray-600">{account.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">Cliquer pour remplir</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Informations de sécurité */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-blue-800 text-sm font-medium">Connexion sécurisée</p>
              <p className="text-blue-700 text-xs mt-1">
                Vos données sont protégées par un chiffrement SSL et une authentification sécurisée.
              </p>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;