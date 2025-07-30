import { Formation, User } from '../types';

export const initialFormations: Formation[] = [
  {
    id: 1,
    title: "Design UX/UI Moderne",
    category: "Design",
    level: "Débutant",
    type: "Formation",
    price: 41750,
    originalPrice: 59700,
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Créez des expériences utilisateur exceptionnelles avec Figma",
    duration: "28h",
    students: 1456,
    rating: 4.9,
    reviews: 287,
    instructor: "Emma Rodriguez",
    modules: 9,
    skills: ["Figma", "Prototypage", "Design System", "User Research"],
    trending: true,
    bestseller: false,
    progress: 0,
    difficulty: "Facile",
    status: "Publié",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Développement React Avancé",
    category: "Développement",
    level: "Avancé",
    type: "Formation",
    price: 59900,
    originalPrice: 79900,
    image: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Maîtrisez React avec hooks, context et patterns avancés",
    duration: "45h",
    students: 892,
    rating: 4.8,
    reviews: 156,
    instructor: "Thomas Dubois",
    modules: 12,
    skills: ["React", "TypeScript", "Next.js", "Testing"],
    trending: false,
    bestseller: true,
    progress: 0,
    difficulty: "Difficile",
    status: "Publié",
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z"
  },
  {
    id: 3,
    title: "Marketing Digital 2024",
    category: "Marketing",
    level: "Intermédiaire",
    type: "Formation",
    price: 39500,
    originalPrice: 49900,
    image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Stratégies marketing digital pour les entreprises modernes",
    duration: "32h",
    students: 2341,
    rating: 4.7,
    reviews: 423,
    instructor: "Marie Laurent",
    modules: 8,
    skills: ["SEO", "Social Media", "Analytics", "Content Marketing"],
    trending: true,
    bestseller: false,
    progress: 0,
    difficulty: "Moyen",
    status: "Brouillon",
    createdAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-05T09:15:00Z"
  }
];

export const initialUsers: User[] = [
  {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "+33 6 12 34 56 78",
    role: "Étudiant",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    joinDate: "2024-01-15",
    lastActive: "Il y a 2h",
    coursesEnrolled: 3,
    coursesCompleted: 1,
    status: "Actif",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Thomas Martin",
    email: "thomas.martin@email.com",
    phone: "+33 6 98 76 54 32",
    role: "Instructeur",
    avatar: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150",
    joinDate: "2023-08-22",
    lastActive: "Il y a 30min",
    coursesEnrolled: 0,
    coursesCompleted: 0,
    coursesCreated: 5,
    status: "Actif",
    createdAt: "2023-08-22T08:00:00Z",
    updatedAt: "2023-08-22T08:00:00Z"
  },
  {
    id: 3,
    name: "Sophie Laurent",
    email: "sophie.laurent@email.com",
    phone: "+33 6 45 67 89 01",
    role: "Étudiant",
    avatar: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=150",
    joinDate: "2024-02-10",
    lastActive: "Il y a 1j",
    coursesEnrolled: 2,
    coursesCompleted: 2,
    status: "Actif",
    createdAt: "2024-02-10T16:20:00Z",
    updatedAt: "2024-02-10T16:20:00Z"
  },
  {
    id: 4,
    name: "Pierre Moreau",
    email: "pierre.moreau@email.com",
    phone: "+33 6 23 45 67 89",
    role: "Admin",
    avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150",
    joinDate: "2023-01-05",
    lastActive: "Il y a 5min",
    coursesEnrolled: 0,
    coursesCompleted: 0,
    status: "Actif",
    createdAt: "2023-01-05T12:00:00Z",
    updatedAt: "2023-01-05T12:00:00Z"
  }
];

export const initialSettings = {
  general: {
    siteName: 'FormationPro',
    siteUrl: 'https://formationpro.com',
    description: 'Plateforme de formation en ligne pour développer vos compétences',
    contactEmail: 'contact@formationpro.com',
    contactPhone: '+33 1 23 45 67 89'
  },
  notifications: {
    newRegistrations: true,
    commentsAndReviews: true,
    payments: true,
    weeklyReports: false,
    systemUpdates: true
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireSpecialChars: true
  },
  appearance: {
    theme: 'light' as const,
    primaryColor: '#A553C4',
    secondaryColor: '#6636DD',
    accentColor: '#2D139B'
  },
  localization: {
    language: 'fr',
    timezone: 'Europe/Paris',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY'
  },
  email: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@formationpro.com',
    fromName: 'FormationPro'
  }
};

export const initialSessions = [
  {
    id: '1',
    device: 'Chrome sur Windows',
    location: 'Paris, France',
    lastActive: 'Actif maintenant',
    current: true
  },
  {
    id: '2',
    device: 'Safari sur iPhone',
    location: 'Lyon, France',
    lastActive: 'Il y a 2 heures',
    current: false
  },
  {
    id: '3',
    device: 'Firefox sur Mac',
    location: 'Marseille, France',
    lastActive: 'Il y a 1 jour',
    current: false
  }
];