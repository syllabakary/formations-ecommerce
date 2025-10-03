import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Types
interface User {
  id: string;
  email: string;
  phone: string;
  name?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  user_id?: number;
  otp?: string;
  requires_verification?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, phone: string, password: string) => Promise<AuthResponse>;
  verifyOTP: (userId: number, otp: string) => Promise<AuthResponse>;
  resendOTP: (email: string) => Promise<AuthResponse>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

// Contexte
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook pour utiliser le contexte
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



// Configuration API
const API_BASE_URL = 'http://localhost:8000/api'; // Ajuste selon ton backend

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le token depuis localStorage au démarrage
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erreur parsing user data:', error);
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Sauvegarder le token et l'utilisateur
  const saveAuth = (authToken: string, userData: User) => {
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  // Effacer l'authentification
  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  };

  // Obtenir le cookie CSRF (nécessaire pour Sanctum)
  const getCsrfCookie = async (): Promise<void> => {
    try {
      await axios.get(`${API_BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Erreur lors de l\'obtention du cookie CSRF:', error);
    }
  };

  // Fonction générique pour les appels API
  const apiCall = async (endpoint: string, data: Record<string, unknown>): Promise<AuthResponse> => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        withCredentials: true, // Important pour Sanctum (cookies de session)
        validateStatus: () => true // Accepter tous les codes de statut
      };

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, config);
      return response.data as AuthResponse;
    } catch (error) {
      console.error('Erreur API:', error);
      return {
        success: false,
        message: 'Erreur de connexion au serveur'
      };
    }
  };

  // Connexion
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    console.log(`🔑 Tentative de connexion pour: ${email}`);

    // Obtenir le cookie CSRF d'abord
    await getCsrfCookie();

    const response = await apiCall('/login', { email, password });

    if (response.success && response.token && response.user) {
      saveAuth(response.token, response.user);
    } else if (response.requires_verification) {
      console.log(`📱 Vérification OTP requise pour: ${email}`);
    }

    return response;
  };

  // Inscription
  const register = async (email: string, phone: string, password: string): Promise<AuthResponse> => {
    return await apiCall('/register', { email, phone, password });
  };

  // Vérification OTP
  const verifyOTP = async (userId: number, otp: string): Promise<AuthResponse> => {
    const response = await apiCall('/verify-otp', { user_id: userId, otp });
    
    if (response.success && response.token && response.user) {
      saveAuth(response.token, response.user);
    }
    
    return response;
  };

  // Renvoyer OTP
  const resendOTP = async (email: string): Promise<AuthResponse> => {
    return await apiCall('/resend-otp', { email });
  };

  // Déconnexion
  const logout = () => {
    clearAuth();
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};