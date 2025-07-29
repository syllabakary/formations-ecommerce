import React, { useState, useEffect } from 'react';
import { 
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  Award,
  CreditCard,
  History,
  User,
  Settings,
  Bell,
  BarChart2,
  FileText,
  HelpCircle,
  LogOut,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Mail,
  MessageSquare,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Interfaces
interface ExternalCourse {
  id: string;
  title: string;
  platform: string;
  purchaseDate: string;
  accessLink: string;
  status: 'completed' | 'in-progress' | 'not-started';
  completionPercentage?: number;
  expiryDate?: string;
  price: number;
  category: string;
}

interface PurchaseHistory {
  id: string;
  date: string;
  amount: number;
  items: {
    courseId: string;
    title: string;
    price: number;
  }[];
  paymentMethod: string;
  invoiceNumber: string;
  invoiceUrl?: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  lastPasswordChange?: string;
}

interface SupportTicket {
  subject: string;
  message: string;
  contactEmail: string;
}

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'purchases' | 'account' | 'settings' | 'support'>('courses');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [expandedPurchase, setExpandedPurchase] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  // User profile state
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    lastPasswordChange: '2024-01-01'
  });
  
  // États pour le formulaire de support
  const [supportTicket, setSupportTicket] = useState<SupportTicket>({
    subject: '',
    message: '',
    contactEmail: user?.email || ''
  });
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  
  // Form states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  
  // Mock data states - in a real app, these would come from API calls
  const [courses, setCourses] = useState<ExternalCourse[]>([]);
  const [purchases, setPurchases] = useState<PurchaseHistory[]>([]);
  
  // Filter and sort states
  const [courseFilter, setCourseFilter] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');
  const [purchaseSort, setPurchaseSort] = useState<'recent' | 'oldest' | 'amount'>('recent');
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be API calls
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockCourses: ExternalCourse[] = [
          {
            id: '1',
            title: 'Expert en Marketing Digital',
            platform: 'Udemy',
            purchaseDate: '2024-03-15',
            accessLink: 'https://udemy.com/course123',
            status: 'in-progress',
            completionPercentage: 45,
            expiryDate: '2025-03-15',
            price: 89.99,
            category: 'Marketing'
          },
          {
            id: '2',
            title: 'Data Science Fundamentals',
            platform: 'Coursera',
            purchaseDate: '2024-02-10',
            accessLink: 'https://coursera.org/learn/data-science',
            status: 'not-started',
            price: 49.99,
            category: 'Technologie'
          },
          {
            id: '3',
            title: 'Leadership Avancé',
            platform: 'LinkedIn Learning',
            purchaseDate: '2024-01-05',
            accessLink: 'https://linkedin.com/learning/leadership',
            status: 'completed',
            completionPercentage: 100,
            price: 29.99,
            category: 'Management'
          }
        ];
        
        const mockPurchases: PurchaseHistory[] = [
          {
            id: '1',
            date: '2024-03-15',
            amount: 89.99,
            items: [
              {
                courseId: '1',
                title: 'Expert en Marketing Digital',
                price: 89.99
              }
            ],
            paymentMethod: 'Visa •••• 4242',
            invoiceNumber: 'INV-2024-03-001',
            invoiceUrl: 'https://example.com/invoices/INV-2024-03-001'
          },
          {
            id: '2',
            date: '2024-02-10',
            amount: 79.98,
            items: [
              {
                courseId: '2',
                title: 'Data Science Fundamentals',
                price: 49.99
              },
              {
                courseId: '4',
                title: 'Introduction à Python',
                price: 29.99
              }
            ],
            paymentMethod: 'PayPal',
            invoiceNumber: 'INV-2024-02-005',
            invoiceUrl: 'https://example.com/invoices/INV-2024-02-005'
          }
        ];
        
        setCourses(mockCourses);
        setPurchases(mockPurchases);
        setProfile({
          name: user?.name || '',
          email: user?.email || '',
          phone: '+33 6 12 34 56 78',
          lastPasswordChange: '2024-01-01'
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Filter and sort functions
  const filteredCourses = courses.filter(course => {
    if (courseFilter === 'all') return true;
    return course.status === courseFilter;
  });
  
  const sortedPurchases = [...purchases].sort((a, b) => {
    if (purchaseSort === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (purchaseSort === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return b.amount - a.amount;
    }
  });
  
  // Conversion en F CFA (1€ = 655.957 F CFA)
  const convertToFCFA = (euros: number) => {
    return (euros * 655.957).toFixed(2);
  };
  
  // Handlers
  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };
  
  const togglePurchase = (purchaseId: string) => {
    setExpandedPurchase(expandedPurchase === purchaseId ? null : purchaseId);
  };
  
  const handleMarkAsComplete = (courseId: string) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, status: 'completed', completionPercentage: 100 } 
        : course
    ));
  };
  
  const handleUpdateProgress = (courseId: string, progress: number) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            status: progress === 100 ? 'completed' : 'in-progress',
            completionPercentage: progress 
          } 
        : course
    ));
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    
    try {
      // Validate phone number
      if (profile.phone && !/^\+?[0-9\s]+$/.test(profile.phone)) {
        throw new Error('Numéro de téléphone invalide');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in auth context
      if (user) {
        updateUser({ ...user, name: profile.name });
      }
      
      setProfileSuccess('Profil mis à jour avec succès');
      setEditMode(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    try {
      // Validate
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      
      if (passwordForm.newPassword.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update last password change
      setProfile(prev => ({ 
        ...prev, 
        lastPasswordChange: new Date().toISOString().split('T')[0] 
      }));
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setPasswordError('Mot de passe mis à jour avec succès');
      
      // Hide message after 3 seconds
      setTimeout(() => setPasswordError(''), 3000);
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };
  
  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTicket(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setSupportTicket({
        subject: '',
        message: '',
        contactEmail: user?.email || ''
      });
      
      setTicketSubmitted(true);
    } catch (error) {
      console.error('Error submitting ticket:', error);
    } finally {
      setIsSubmittingTicket(false);
    }
  };
  
  const downloadInvoice = (invoiceUrl: string, invoiceNumber: string) => {
    // In a real app, this would download the invoice
    console.log(`Downloading invoice ${invoiceNumber} from ${invoiceUrl}`);
    // For demo purposes, we'll just show an alert
    alert(`Téléchargement de la facture ${invoiceNumber}...`);
  };
  
  const viewInvoice = (invoiceUrl: string, invoiceNumber: string) => {
    // In a real app, this would open the invoice in a new tab
    console.log(`Viewing invoice ${invoiceNumber} at ${invoiceUrl}`);
    // For demo purposes, we'll just show an alert
    alert(`Ouverture de la facture ${invoiceNumber} dans un nouvel onglet...`);
    // window.open(invoiceUrl, '_blank');
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Terminé</span>;
      case 'in-progress':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1"><Clock className="h-3 w-3" /> En cours</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full flex items-center gap-1"><BookOpen className="h-3 w-3" /> Non commencé</span>;
    }
  };
  
  if (!user) return <Navigate to="/login" />;
  
  // Calculate stats
  const stats = {
    totalCourses: courses.length,
    completedCourses: courses.filter(c => c.status === 'completed').length,
    inProgressCourses: courses.filter(c => c.status === 'in-progress').length,
    totalSpent: purchases.reduce((sum, purchase) => sum + purchase.amount, 0),
    activeSubscriptions: 2 // Mock value
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Formation Pro</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                <span className="font-semibold">{user.name.substring(0, 1)}</span>
              </div>
              <span className="font-medium">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Formations achetées</p>
                <h3 className="text-2xl font-bold">{stats.totalCourses}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Formations terminées</p>
                <h3 className="text-2xl font-bold">{stats.completedCourses}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En cours</p>
                <h3 className="text-2xl font-bold">{stats.inProgressCourses}</h3>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total dépensé</p>
                <h3 className="text-2xl font-bold">
                  {stats.totalSpent.toFixed(2)}€
                  <span className="text-lg text-gray-500 ml-1">
                    ({convertToFCFA(stats.totalSpent)} F CFA)
                  </span>
                </h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                    <span className="font-semibold text-lg">{user.name.substring(0, 1)}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left ${
                    activeTab === 'courses' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Mes Formations</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('purchases')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left ${
                    activeTab === 'purchases' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                  }`}
                >
                  <History className="h-5 w-5" />
                  <span>Historique d'achats</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left ${
                    activeTab === 'account' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Mon Compte</span>
                </button>
                
                <div className="border-t my-2"></div>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left hover:bg-gray-100">
                  <Settings className="h-5 w-5" />
                  <span>Paramètres</span>
                </button>
                
               <button
                  onClick={() => setActiveTab('support')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left ${
                    activeTab === 'support' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                  }`}
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Aide & Support</span>
                </button>
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Déconnexion</span>
                </button>
              </nav>
            </div>
            
            {/* Quick Links */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium mb-4">Liens rapides</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
                  <ExternalLink className="h-4 w-4" />
                  <span>Plateformes partenaires</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
                  <Award className="h-4 w-4" />
                  <span>Certifications disponibles</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
                  <BarChart2 className="h-4 w-4" />
                  <span>Statistiques d'utilisation</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Courses Tab */}
                {activeTab === 'courses' && (
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-xl font-bold">Mes Formations</h2>
                        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                          <select 
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value as any)}
                            className="px-3 py-2 border rounded-lg text-sm"
                          >
                            <option value="all">Toutes les formations</option>
                            <option value="completed">Terminées</option>
                            <option value="in-progress">En cours</option>
                            <option value="not-started">Non commencées</option>
                          </select>
                          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-opacity-90">
                            Acheter une nouvelle formation
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="divide-y">
                      {filteredCourses.length > 0 ? (
                        filteredCourses.map(course => (
                          <div key={course.id} className="p-6 hover:bg-gray-50">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-4">
                                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    {course.platform === 'Udemy' && (
                                      <span className="text-xs font-bold text-purple-600">UD</span>
                                    )}
                                    {course.platform === 'Coursera' && (
                                      <span className="text-xs font-bold text-blue-600">CO</span>
                                    )}
                                    {course.platform === 'LinkedIn Learning' && (
                                      <span className="text-xs font-bold text-blue-400">LI</span>
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-medium mb-1">{course.title}</h3>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                                      <span>{course.platform}</span>
                                      <span>•</span>
                                      <span>Acheté le {new Date(course.purchaseDate).toLocaleDateString()}</span>
                                      {course.expiryDate && (
                                        <>
                                          <span>•</span>
                                          <span>Expire le {new Date(course.expiryDate).toLocaleDateString()}</span>
                                        </>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      {getStatusBadge(course.status)}
                                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                        {course.category}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-3">
                                <button 
                                  onClick={() => toggleCourse(course.id)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  {expandedCourse === course.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                </button>
                                <a 
                                  href={course.accessLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-opacity-90 flex items-center gap-2"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  <span>Accéder au cours</span>
                                </a>
                              </div>
                            </div>
                            
                            {/* Expanded Course Details */}
                            <AnimatePresence>
                              {expandedCourse === course.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-4 pt-4 border-t"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                      <h4 className="font-medium mb-2">Détails de la formation</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Plateforme:</span>
                                          <span>{course.platform}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Date d'achat:</span>
                                          <span>{new Date(course.purchaseDate).toLocaleDateString()}</span>
                                        </div>
                                        {course.expiryDate && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">Date d'expiration:</span>
                                            <span>{new Date(course.expiryDate).toLocaleDateString()}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Prix:</span>
                                          <span>
                                            {course.price.toFixed(2)}€
                                            <span className="text-gray-500 ml-1">
                                              ({convertToFCFA(course.price)} F CFA)
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-medium mb-2">Progression</h4>
                                      {course.status === 'completed' ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                          <CheckCircle className="h-5 w-5" />
                                          <span>Formation terminée</span>
                                        </div>
                                      ) : course.status === 'in-progress' ? (
                                        <div>
                                          <div className="flex justify-between text-sm mb-1">
                                            <span>Progression:</span>
                                            <span>{course.completionPercentage}%</span>
                                          </div>
                                          <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                              className="bg-primary h-2 rounded-full" 
                                              style={{ width: `${course.completionPercentage}%` }}
                                            ></div>
                                          </div>
                                          <div className="mt-2 flex gap-2">
                                            <button 
                                              onClick={() => handleUpdateProgress(course.id, Math.min(100, (course.completionPercentage || 0) + 10))}
                                              className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                                            >
                                              +10%
                                            </button>
                                            <button 
                                              onClick={() => handleUpdateProgress(course.id, Math.max(0, (course.completionPercentage || 0) - 10))}
                                              className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                                            >
                                              -10%
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2 text-gray-500">
                                          <BookOpen className="h-5 w-5" />
                                          <span>Non commencé</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-medium mb-2">Actions</h4>
                                      <div className="space-y-2">
                                        <a 
                                          href={course.accessLink} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="block w-full px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-opacity-90 text-center"
                                        >
                                          Accéder à la plateforme
                                        </a>
                                        <button className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                          Obtenir une facture
                                        </button>
                                        {course.status !== 'completed' && (
                                          <button 
                                            onClick={() => handleMarkAsComplete(course.id)}
                                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                                          >
                                            Marquer comme terminé
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          Aucune formation trouvée avec ce filtre
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Purchases Tab */}
                {activeTab === 'purchases' && (
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-xl font-bold">Historique d'achats</h2>
                        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                          <select 
                            value={purchaseSort}
                            onChange={(e) => setPurchaseSort(e.target.value as any)}
                            className="px-3 py-2 border rounded-lg text-sm"
                          >
                            <option value="recent">Trier par: Plus récent</option>
                            <option value="oldest">Trier par: Plus ancien</option>
                            <option value="amount">Trier par: Montant</option>
                          </select>
                          <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                            Exporter en CSV
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="divide-y">
                      {sortedPurchases.map(purchase => (
                        <div key={purchase.id} className="p-6 hover:bg-gray-50">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium mb-1">Commande #{purchase.invoiceNumber}</h3>
                                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                    <span>Date: {new Date(purchase.date).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>Méthode: {purchase.paymentMethod}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {purchase.items.map((item, index) => (
                                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                        {item.title}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <button 
                                  onClick={() => togglePurchase(purchase.id)}
                                  className="text-gray-500 hover:text-gray-700 md:hidden"
                                >
                                  {expandedPurchase === purchase.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-3">
                              <button 
                                onClick={() => togglePurchase(purchase.id)}
                                className="text-gray-500 hover:text-gray-700 hidden md:block"
                              >
                                {expandedPurchase === purchase.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                              </button>
                              <div className="text-right">
                                <h4 className="text-xl font-bold">
                                  {purchase.amount.toFixed(2)}€
                                  <span className="text-gray-500 text-sm ml-1">
                                    ({convertToFCFA(purchase.amount)} F CFA)
                                  </span>
                                </h4>
                              </div>
                            </div>
                          </div>
                          
                          {/* Expanded Purchase Details */}
                          <AnimatePresence>
                            {expandedPurchase === purchase.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-medium mb-2">Détails de la commande</h4>
                                    <div className="space-y-3">
                                      {purchase.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                          <span className="text-gray-600">{item.title}</span>
                                          <span className="font-medium">
                                            {item.price.toFixed(2)}€
                                            <span className="text-gray-500 ml-1">
                                              ({convertToFCFA(item.price)} F CFA)
                                            </span>
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Actions</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {purchase.invoiceUrl && (
                                        <>
                                          <button 
                                            onClick={() => viewInvoice(purchase.invoiceUrl!, purchase.invoiceNumber)}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
                                          >
                                            <Eye className="h-4 w-4" />
                                            <span>Voir la facture</span>
                                          </button>
                                          <button 
                                            onClick={() => downloadInvoice(purchase.invoiceUrl!, purchase.invoiceNumber)}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
                                          >
                                            <Download className="h-4 w-4" />
                                            <span>Télécharger</span>
                                          </button>
                                        </>
                                      )}
                                      <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                        Contacter le support
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Informations personnelles</h2>
                        {!editMode ? (
                          <button 
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                          >
                            Modifier le profil
                          </button>
                        ) : (
                          <button 
                            onClick={() => setEditMode(false)}
                            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                      
                      {profileError && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                          {profileError}
                        </div>
                      )}
                      
                      {profileSuccess && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                          {profileSuccess}
                        </div>
                      )}
                      
                      <form onSubmit={handleProfileSubmit}>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                              {editMode ? (
                                <input 
                                  type="text" 
                                  name="name"
                                  value={profile.name.split(' ')[0]} 
                                  onChange={handleProfileChange}
                                  className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                                  required
                                />
                              ) : (
                                <div className="px-4 py-2 border border-transparent rounded-lg">
                                  {profile.name.split(' ')[0]}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                              {editMode ? (
                                <input 
                                  type="text" 
                                  name="lastName"
                                  value={profile.name.split(' ')[1] || ''} 
                                  onChange={(e) => setProfile({...profile, name: `${profile.name.split(' ')[0]} ${e.target.value}`})}
                                  className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                                />
                              ) : (
                                <div className="px-4 py-2 border border-transparent rounded-lg">
                                  {profile.name.split(' ')[1] || ''}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            {editMode ? (
                              <input 
                                type="email" 
                                name="email"
                                value={profile.email} 
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                                required
                              />
                            ) : (
                              <div className="px-4 py-2 border border-transparent rounded-lg">
                                {profile.email}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                            {editMode ? (
                              <input 
                                type="tel" 
                                name="phone"
                                value={profile.phone || ''} 
                                onChange={handleProfileChange}
                                placeholder="+33 6 12 34 56 78" 
                                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                              />
                            ) : (
                              <div className="px-4 py-2 border border-transparent rounded-lg">
                                {profile.phone || 'Non renseigné'}
                              </div>
                            )}
                          </div>
                          
                          {editMode && (
                            <div className="pt-4 border-t">
                              <button 
                                type="submit"
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                              >
                                Enregistrer les modifications
                              </button>
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-xl font-bold mb-6">Sécurité</h2>
                      
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">Mot de passe</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Dernière modification le {profile.lastPasswordChange ? new Date(profile.lastPasswordChange).toLocaleDateString() : 'inconnue'}
                          </p>
                          
                          <form onSubmit={handlePasswordSubmit} className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                              <input 
                                type="password" 
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary text-sm"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                              <input 
                                type="password" 
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary text-sm"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                              <input 
                                type="password" 
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary text-sm"
                                required
                              />
                            </div>
                            
                            {passwordError && (
                              <div className={`text-sm ${passwordError.includes('succès') ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordError}
                              </div>
                            )}
                            
                            <button 
                              type="submit"
                              className="w-full px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-opacity-90"
                            >
                              Modifier le mot de passe
                            </button>
                          </form>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">Authentification à deux facteurs</h3>
                          <p className="text-sm text-gray-600 mb-3">Non activée</p>
                          <button className="text-sm text-primary font-medium hover:underline">
                            Activer la 2FA
                          </button>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">Sessions actives</h3>
                          <p className="text-sm text-gray-600 mb-3">1 appareil connecté</p>
                          <button className="text-sm text-primary font-medium hover:underline">
                            Voir toutes les sessions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Support Tab */}
                {activeTab === 'support' && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-6">Aide & Support</h2>
                    
                    {ticketSubmitted ? (
                      <div className="p-6 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="mt-3 text-lg font-medium text-gray-900">Demande envoyée</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Nous avons bien reçu votre demande. Notre équipe vous répondra dans les plus brefs délais.
                        </p>
                        <button
                          onClick={() => setTicketSubmitted(false)}
                          className="mt-6 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-opacity-90"
                        >
                          Nouvelle demande
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                              <Mail className="h-5 w-5 text-primary" />
                              <h3 className="font-medium">Email</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Envoyez-nous un email pour toute question
                            </p>
                            <a 
                              href="mailto:support@formationpro.com" 
                              className="text-sm text-primary font-medium hover:underline"
                            >
                              support@formationpro.com
                            </a>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                              <MessageSquare className="h-5 w-5 text-primary" />
                              <h3 className="font-medium">Chat en direct</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Discutez en direct avec notre équipe
                            </p>
                            <button className="text-sm text-primary font-medium hover:underline">
                              Ouvrir le chat
                            </button>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                              <Phone className="h-5 w-5 text-primary" />
                              <h3 className="font-medium">Téléphone</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Du lundi au vendredi, 9h-18h
                            </p>
                            <a 
                              href="tel:+33123456789" 
                              className="text-sm text-primary font-medium hover:underline"
                            >
                              +33 1 23 45 67 89
                            </a>
                          </div>
                        </div>
                        
                        <h3 className="font-medium mb-4">Envoyer une demande</h3>
                        <form onSubmit={handleSupportSubmit}>
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                Sujet
                              </label>
                              <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={supportTicket.subject}
                                onChange={(e) => setSupportTicket({...supportTicket, subject: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                Message
                              </label>
                              <textarea
                                id="message"
                                name="message"
                                rows={4}
                                value={supportTicket.message}
                                onChange={(e) => setSupportTicket({...supportTicket, message: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                                required
                              ></textarea>
                            </div>
                            
                            <div>
                              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                Email de contact
                              </label>
                              <input
                                type="email"
                                id="contactEmail"
                                name="contactEmail"
                                value={supportTicket.contactEmail}
                                onChange={(e) => setSupportTicket({...supportTicket, contactEmail: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                                required
                              />
                            </div>
                            
                            <div className="pt-2">
                              <button 
                                type="submit"
                                disabled={isSubmittingTicket}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-70"
                              >
                                {isSubmittingTicket ? 'Envoi en cours...' : 'Envoyer la demande'}
                              </button>
                            </div>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 py-6 border-t text-center text-gray-500 text-sm">
          <p>© 2025 Formation Pro. Tous droits réservés.</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;