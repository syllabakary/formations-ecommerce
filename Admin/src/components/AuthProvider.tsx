import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Comptes de démonstration
  const demoUsers = [
    {
      id: 1,
      name: 'Administrateur',
      email: 'admin@formationpro.com',
      password: 'admin123',
      role: 'admin' as const,
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 2,
      name: 'Instructeur Demo',
      email: 'instructor@formationpro.com',
      password: 'instructor123',
      role: 'instructor' as const,
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 3,
      name: 'Étudiant Demo',
      email: 'student@formationpro.com',
      password: 'student123',
      role: 'student' as const,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simuler un délai de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Vérifier les identifiants
      const foundUser = demoUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          avatar: foundUser.avatar
        };

        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Ajouter une notification de connexion
        const notifications = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
        notifications.unshift({
          id: Date.now(),
          type: 'success',
          title: 'Connexion réussie',
          message: `Bienvenue ${foundUser.name} !`,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('systemNotifications', JSON.stringify(notifications.slice(0, 50)));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    
    // Ajouter une notification de déconnexion
    const notifications = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
    notifications.unshift({
      id: Date.now(),
      type: 'info',
      title: 'Déconnexion',
      message: 'Vous avez été déconnecté avec succès',
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('systemNotifications', JSON.stringify(notifications.slice(0, 50)));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};