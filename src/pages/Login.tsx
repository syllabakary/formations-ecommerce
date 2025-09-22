import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import OTPForm from '../components/OTPForm';

type AuthMode = 'login' | 'register' | 'verify-otp';

interface FormData {
  email: string;
  phone: string;
  password: string;
  name: string;
  otpCode: string;
  userId?: number;
}

const Login: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    password: '',
    name: '',
    otpCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [otpEmail, setOtpEmail] = useState(''); // Pour stocker l'email pendant la vérification OTP

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Gérer les changements de formulaire
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer les messages d'erreur lors de la saisie
    if (message) setMessage(null);
  };

  // Afficher un message
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Connexion
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showMessage('error', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      
      if (response.success) {
        showMessage('success', 'Connexion réussie !');
        // La navigation se fera automatiquement via useEffect
      } else {
        showMessage('error', response.message);
      }
    } catch (error) {
      showMessage('error', 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };





  // Retour à la connexion depuis OTP
  const goBackToLogin = () => {
    setMode('login');
    setOtpEmail('');
    setFormData({
      email: '',
      phone: '',
      password: '',
      name: '',
      otpCode: ''
    });
    setMessage(null);
  };

  // Affichage du message
  const MessageDisplay = () => {
    if (!message) return null;
    
    return (
      <div className={`mb-4 p-4 rounded-lg border ${
        message.type === 'success' 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        <p className="text-sm font-medium">{message.text}</p>
      </div>
    );
  };

  // Vue de vérification OTP
  if (mode === 'verify-otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <OTPForm
            userId={formData.userId || 0}
            email={otpEmail}
            otp={formData.otpCode}
            onSuccess={() => {
              showMessage('success', 'Compte vérifié avec succès !');
              navigate('/dashboard');
            }}
            onError={(message) => showMessage('error', message)}
            onLoading={setIsLoading}
            onBack={goBackToLogin}
          />

          <MessageDisplay />
        </div>
      </div>
    );
  }

  // Vue principale (connexion/inscription)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Connexion' : 'Inscription'}
          </h2>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Connectez-vous pour accéder à votre compte'
              : 'Créez votre compte pour commencer'}
          </p>
        </div>

        <MessageDisplay />

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="exemple@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <RegistrationForm
            onSuccess={(userId, otp) => {
              setOtpEmail(formData.email);
              setMode('verify-otp');
              setFormData(prev => ({ ...prev, otpCode: otp, userId }));
              showMessage('success', `Inscription réussie ! Votre code OTP est: ${otp}`);
            }}
            onError={(message) => showMessage('error', message)}
            onLoading={setIsLoading}
          />
        )}

        <div className="text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {mode === 'login' 
              ? "Pas encore de compte ? S'inscrire"
              : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;