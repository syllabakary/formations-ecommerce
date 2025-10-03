export interface Formation {
  id: number;
  title: string;
  category: string;
  level: string;
  type: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  duration: string;
  students: number;
  rating: number;
  reviews: number;
  instructor: string;
  modules: number;
  skills: string[];
  trending: boolean;
  bestseller: boolean;
  progress: number;
  difficulty: string;
  status: 'Publié' | 'Brouillon' | 'Archivé';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'Étudiant' | 'Instructeur' | 'Admin';
  avatar: string;
  joinDate: string;
  lastActive: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  coursesCreated?: number;
  status: 'Actif' | 'Inactif' | 'Suspendu';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  userId?: number;
}

export interface Stats {
  totalRevenue: number;
  totalUsers: number;
  totalFormations: number;
  completionRate: number;
  monthlyGrowth: {
    revenue: number;
    users: number;
    formations: number;
  };
}

export interface AppSettings {
  general: {
    siteName: string;
    siteUrl: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
  };
  notifications: {
    newRegistrations: boolean;
    commentsAndReviews: boolean;
    payments: boolean;
    weeklyReports: boolean;
    systemUpdates: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    passwordMinLength: number;
    requireSpecialChars: boolean;
  };
  appearance: {
    theme: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  localization: {
    language: string;
    timezone: string;
    currency: string;
    dateFormat: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
}

export interface UserSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}