// context/AuthProvider.tsx - Version corrigée avec Sanctum et OTP
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  avatar?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; requiresVerification?: boolean; userId?: number; otp?: string }>;
  logout: () => void;
  isLoading: boolean;
  getToken: () => string | null;
  verifyOTP: (userId: number, otp: string) => Promise<{ success: boolean; message: string }>;
  resendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook avec vérification de contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const TOKEN_KEY = (import.meta.env.VITE_ADMIN_TOKEN_KEY as string) || 'auth_token';

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fonction pour récupérer le token
  const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  };

  // Fonction pour sauvegarder l'authentification
  const saveAuthData = (userData: User, token: string) => {
    const userWithToken = { ...userData, token };

    localStorage.setItem('currentUser', JSON.stringify(userWithToken));
    localStorage.setItem(TOKEN_KEY, token);
    apiService.setToken(token);

    // Notification de succès
    const notifications = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
    notifications.unshift({
      id: Date.now(),
      type: 'success',
      title: 'Connexion réussie',
      message: `Bienvenue ${userData.name} !`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('systemNotifications', JSON.stringify(notifications.slice(0, 50)));

    setUser(userWithToken);
    console.log('🔐 Utilisateur connecté:', userData.email, 'Token:', token.substring(0, 20) + '...');
  };

  // Fonction pour nettoyer les données d'authentification
  const clearAuthData = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    apiService.setToken(null);
    setUser(null);
    console.log('🚪 Session nettoyée');
  };

  // Vérification de l'authentification au démarrage
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('🔍 Vérification de l\'authentification...');

        const savedUser = localStorage.getItem('currentUser');
        const savedToken = getToken();

        if (savedUser && savedToken) {
          const userData = JSON.parse(savedUser);

          // Vérifier si le token est encore valide en appelant l'API
          try {
            await apiService.getCurrentUser();
            console.log('✅ Session restaurée pour:', userData.email);
            setUser({ ...userData, token: savedToken });
          } catch (error) {
            console.log('❌ Token expiré, nettoyage de la session');
            clearAuthData();
          }
        } else {
          console.log('ℹ️ Aucune session existante');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification de l\'authentification:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [TOKEN_KEY]);

  // Fonction de connexion
  const login = async (credentials: { email: string; password: string }): Promise<{ success: boolean; requiresVerification?: boolean; userId?: number; otp?: string }> => {
    setIsLoading(true);

    try {
      console.log('🔑 Tentative de connexion pour:', credentials.email);

      // Utiliser l'apiService pour la connexion (CSRF géré dans apiService.login)
      const response = await apiService.login(credentials.email, credentials.password);

      if (response?.token && response?.user) {
        const userData = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role || 'admin',
          avatar: response.user.avatar
        };

        saveAuthData(userData, response.token);
        return { success: true };
      }

      // Si la réponse indique qu'une vérification est requise
      if (response?.requires_verification) {
        console.log('📱 Vérification OTP requise pour:', credentials.email);
        return {
          success: false,
          requiresVerification: true,
          userId: response.user_id || null,
          otp: response.otp || null
        };
      }

      console.error('❌ Erreur de connexion:', response?.message);
      return { success: false };
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de vérification OTP
  const verifyOTP = async (userId: number, otp: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🔐 Vérification OTP pour user:', userId);

      const response = await apiService.verifyOTP(userId, otp);

      if (response?.token && response?.user) {
        const userData = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role || 'admin',
          avatar: response.user.avatar
        };

        saveAuthData(userData, response.token);
        return { success: true, message: 'Compte vérifié avec succès' };
      }

      return { success: false, message: response?.message || 'Erreur lors de la vérification' };
    } catch (error) {
      console.error('❌ Erreur lors de la vérification OTP:', error);
      return { success: false, message: 'Erreur lors de la vérification' };
    }
  };

  // Fonction de renvoi OTP
  const resendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('📧 Renvoi OTP pour:', email);

      const response = await apiService.request('/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (response?.success) {
        return { success: true, message: 'Nouveau code OTP envoyé avec succès' };
      }

      return { success: false, message: response?.message || 'Erreur lors de l\'envoi' };
    } catch (error) {
      console.error('❌ Erreur lors du renvoi OTP:', error);
      return { success: false, message: 'Erreur lors de l\'envoi' };
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    console.log('🚪 Déconnexion de:', user?.email);

    try {
      // Appeler l'API de déconnexion
      await apiService.logout();
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    }

    // Nettoyer les données locales
    clearAuthData();

    // Ajouter notification de déconnexion
    const notifications = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
    notifications.unshift({
      id: Date.now(),
      type: 'info',
      title: 'Déconnexion',
      message: 'Vous avez été déconnecté avec succès',
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('systemNotifications', JSON.stringify(notifications.slice(0, 50)));

    // Recharger la page pour réinitialiser l'état
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!getToken(),
    login,
    logout,
    isLoading,
    getToken,
    verifyOTP,
    resendOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;