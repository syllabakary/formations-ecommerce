import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExternalLink, Clock, CheckCircle, XCircle, BookOpen, Award, CreditCard,
  History, User, Bell, HelpCircle, LogOut, ChevronDown, ChevronUp, Download,
  Eye, Mail, MessageSquare, Phone, Loader2, AlertCircle, Star, Users, Calendar,
  MapPin, Building, Wifi, X, Settings, Menu
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface PurchasedCourse {
  id: number;
  course_id: number;
  title: string;
  short_description: string;
  image_url: string;
  platform: string;
  access_link: string;
  category: string;
  price_fcfa: number;
  purchase_date: string;
  status: 'active' | 'completed' | 'expired';
  progress: number;
  duration_hours: number;
  rating: number;
  total_reviews: number;
  trainer_name: string;
  expiry_date?: string;
}

interface PurchasedTraining {
  id: number;
  training_id: number;
  title: string;
  short_description: string;
  image_url: string;
  venue_name: string;
  venue_address: string;
  city_name: string;
  category: string;
  price_fcfa: number;
  registration_date: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  trainer_name: string;
  trainer_email: string;
}

interface Purchase {
  id: number;
  invoice_number: string;
  purchase_date: string;
  total_amount_fcfa: number;
  payment_method: string;
  payment_status: string;
  invoice_url?: string;
  items: Array<{
    title: string;
    type: 'course' | 'training';
    price_fcfa: number;
  }>;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>([]);
  const [purchasedTrainings, setPurchasedTrainings] = useState<PurchasedTraining[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [activeTab, setActiveTab] = useState<'courses' | 'trainings' | 'purchases' | 'account' | 'support'>('courses');
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [expandedTraining, setExpandedTraining] = useState<number | null>(null);
  const [expandedPurchase, setExpandedPurchase] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [supportForm, setSupportForm] = useState({ subject: '', message: '', contact_email: '' });
  const [submittingSupport, setSubmittingSupport] = useState(false);
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const [courseFilter, setCourseFilter] = useState<'all' | 'completed' | 'active' | 'expired'>('all');

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      loadUserData(userEmail);
    } else {
      // Redirect to login page if not authenticated
      window.location.href = '/';
    }
  }, []);

  const loadUserData = async (email: string) => {
    try {
      setLoading(true);
      
      const [userRes, coursesRes, trainingsRes, purchasesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/v1/users/profile?email=${encodeURIComponent(email)}`),
        fetch(`${API_BASE_URL}/v1/users/purchased-courses?email=${encodeURIComponent(email)}`),
        fetch(`${API_BASE_URL}/v1/users/registered-trainings?email=${encodeURIComponent(email)}`),
        fetch(`${API_BASE_URL}/v1/users/purchases?email=${encodeURIComponent(email)}`)
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.data);
        setProfileForm({
          name: userData.data.name || '',
          email: userData.data.email || '',
          phone: userData.data.phone || ''
        });
        setSupportForm(prev => ({ ...prev, contact_email: userData.data.email }));
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setPurchasedCourses(coursesData.data || []);
      }

      if (trainingsRes.ok) {
        const trainingsData = await trainingsRes.json();
        setPurchasedTrainings(trainingsData.data || []);
      }

      if (purchasesRes.ok) {
        const purchasesData = await purchasesRes.json();
        setPurchases(purchasesData.data || []);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger vos données. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/v1/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          name: profileForm.name,
          phone: profileForm.phone
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        setSuccess('Profil mis à jour avec succès');
        setEditMode(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Erreur mise à jour');
      }
    } catch (err) {
      setError('Impossible de mettre à jour le profil');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSupport(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/v1/support/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: user?.email,
          subject: supportForm.subject,
          message: supportForm.message,
          contact_email: supportForm.contact_email
        })
      });

      if (response.ok) {
        setSupportSubmitted(true);
        setSupportForm({ subject: '', message: '', contact_email: user?.email || '' });
        setTimeout(() => setSupportSubmitted(false), 5000);
      } else {
        throw new Error('Erreur envoi');
      }
    } catch (err) {
      setError('Impossible d\'envoyer la demande');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSubmittingSupport(false);
    }
  };

  const handleUpdateProgress = async (courseId: number, newProgress: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/users/course-progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          course_id: courseId,
          progress: newProgress
        })
      });

      if (response.ok) {
        setPurchasedCourses(prev => prev.map(course => 
          course.course_id === courseId 
            ? { ...course, progress: newProgress, status: newProgress === 100 ? 'completed' : 'active' }
            : course
        ));
        setSuccess('Progression mise à jour');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      setError('Erreur mise à jour');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> = {
      active: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'En cours' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Terminé' },
      expired: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Expiré' },
      upcoming: { color: 'bg-purple-100 text-purple-800', icon: Calendar, label: 'À venir' },
      ongoing: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'En cours' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Annulé' }
    };

    const badge = badges[status] || badges.active;
    const Icon = badge.icon;
    return <span className={`px-2 py-1 ${badge.color} text-xs rounded-full inline-flex items-center gap-1`}><Icon className="h-3 w-3" />{badge.label}</span>;
  };

  const handleLogout = async () => {
    await fetch('http://localhost:8000/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    navigate('/'); // Redirection sans rechargement complet
  };

  const downloadInvoice = (invoiceUrl: string, invoiceNumber: string) => {
    if (invoiceUrl) {
      window.open(invoiceUrl, '_blank');
    } else {
      alert(`Téléchargement de la facture ${invoiceNumber}...`);
    }
  };

  const filteredCourses = purchasedCourses.filter(course => {
    if (courseFilter === 'all') return true;
    return course.status === courseFilter;
  });

  const stats = {
    totalCourses: purchasedCourses.length + purchasedTrainings.length,
    completedCourses: purchasedCourses.filter(c => c.status === 'completed').length,
    activeCourses: purchasedCourses.filter(c => c.status === 'active').length,
    totalSpent: purchases.reduce((sum, p) => sum + p.total_amount_fcfa, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Veuillez vous connecter</p>
          <button onClick={() => window.location.href = '/'} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="flex-shrink-0"><X className="w-4 h-4" /></button>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1">{success}</span>
          <button onClick={() => setSuccess('')} className="flex-shrink-0"><X className="w-4 h-4" /></button>
        </div>
      )}

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setMenuOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Formation Pro</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center">
                <span className="font-semibold">{user.name.substring(0, 1).toUpperCase()}</span>
              </div>
              <span className="font-medium hidden md:block">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Formations</p>
                <h3 className="text-2xl font-bold">{stats.totalCourses}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg"><BookOpen className="h-6 w-6 text-blue-500" /></div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Terminées</p>
                <h3 className="text-2xl font-bold">{stats.completedCourses}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg"><CheckCircle className="h-6 w-6 text-green-500" /></div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En cours</p>
                <h3 className="text-2xl font-bold">{stats.activeCourses}</h3>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg"><Clock className="h-6 w-6 text-amber-500" /></div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total dépensé</p>
                <h3 className="text-lg font-bold">{stats.totalSpent.toLocaleString()} F CFA</h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg"><CreditCard className="h-6 w-6 text-purple-500" /></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Overlay */}
          {menuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setMenuOpen(false)} />
          )}

          {/* Mobile Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center">
                    <span className="font-semibold text-lg">{user.name.substring(0, 1).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{user.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <nav className="p-4">
              {[
                { id: 'courses', icon: Wifi, label: 'Formations en ligne' },
                { id: 'trainings', icon: Building, label: 'Formations présentiel' },
                { id: 'purchases', icon: History, label: 'Historique achats' },
                { id: 'account', icon: User, label: 'Mon Compte' },
                { id: 'support', icon: HelpCircle, label: 'Support' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left transition-all ${
                    activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}

              <div className="border-t my-2"></div>

              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100">
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </nav>
          </div>

          <div className="lg:w-64 hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center">
                    <span className="font-semibold text-lg">{user.name.substring(0, 1).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{user.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4">
                {[
                  { id: 'courses', icon: Wifi, label: 'Formations en ligne' },
                  { id: 'trainings', icon: Building, label: 'Formations présentiel' },
                  { id: 'purchases', icon: History, label: 'Historique achats' },
                  { id: 'account', icon: User, label: 'Mon Compte' },
                  { id: 'support', icon: HelpCircle, label: 'Support' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left transition-all ${
                      activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
                
                <div className="border-t my-2"></div>
                
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100">
                  <LogOut className="h-5 w-5" />
                  <span>Déconnexion</span>
                </button>
              </nav>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            {activeTab === 'courses' && (
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <Wifi className="h-6 w-6 text-blue-600" />
                        Mes Formations en Ligne
                      </h2>
                      <p className="text-gray-600 mt-1">{filteredCourses.length} formation(s)</p>
                    </div>
                    <select 
                      value={courseFilter}
                      onChange={(e) => setCourseFilter(e.target.value as any)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="all">Toutes</option>
                      <option value="active">En cours</option>
                      <option value="completed">Terminées</option>
                      <option value="expired">Expirées</option>
                    </select>
                  </div>
                </div>
                
                <div className="divide-y">
                  {filteredCourses.length > 0 ? filteredCourses.map(course => (
                    <div key={course.id} className="p-6 hover:bg-gray-50">
                      <div className="flex gap-4">
                        <img src={course.image_url} alt={course.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg truncate">{course.title}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2">{course.short_description}</p>
                            </div>
                            <button onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)} className="ml-2 flex-shrink-0">
                              {expandedCourse === course.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {getStatusBadge(course.status)}
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{course.category}</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{course.platform}</span>
                          </div>
                          
                          {course.status === 'active' && (
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progression</span>
                                <span>{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                              </div>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            <a href={course.access_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg text-sm">
                              <ExternalLink className="h-4 w-4" />
                              Accéder
                            </a>
                            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                              {course.price_fcfa.toLocaleString()} F CFA
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {expandedCourse === course.id && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Acheté le: <span className="text-gray-900">{new Date(course.purchase_date).toLocaleDateString('fr-FR')}</span></p>
                              <p className="text-gray-500">Durée: <span className="text-gray-900">{course.duration_hours}h</span></p>
                              <p className="text-gray-500">Formateur: <span className="text-gray-900">{course.trainer_name}</span></p>
                            </div>
                            {course.status === 'active' && (
                              <div className="flex gap-2">
                                <button onClick={() => handleUpdateProgress(course.course_id, Math.min(100, course.progress + 10))} className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                                  +10%
                                </button>
                                <button onClick={() => handleUpdateProgress(course.course_id, 100)} className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">
                                  Terminer
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="p-12 text-center text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Aucune formation avec ce filtre</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'trainings' && (
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Building className="h-6 w-6 text-purple-600" />
                    Formations en Présentiel
                  </h2>
                  <p className="text-gray-600 mt-1">{purchasedTrainings.length} inscription(s)</p>
                </div>
                
                <div className="divide-y">
                  {purchasedTrainings.length > 0 ? purchasedTrainings.map(training => (
                    <div key={training.id} className="p-6 hover:bg-gray-50">
                      <div className="flex gap-4">
                        <img src={training.image_url} alt={training.title} className="w-24 h-24 object-cover rounded-lg" />
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{training.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {getStatusBadge(training.status)}
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{training.category}</span>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{training.city_name} - {training.venue_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(training.start_date).toLocaleDateString('fr-FR')} - {new Date(training.end_date).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{training.trainer_name}</span>
                            </div>
                          </div>
                          
                          <div className="text-lg font-bold text-purple-600">
                            {training.price_fcfa.toLocaleString()} F CFA
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center text-gray-500">
                      <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Aucune formation en présentiel</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'purchases' && (
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <History className="h-6 w-6 text-green-600" />
                    Historique des Achats
                  </h2>
                  <p className="text-gray-600 mt-1">{purchases.length} transaction(s)</p>
                </div>
                
                <div className="divide-y">
                  {purchases.length > 0 ? purchases.map(purchase => (
                    <div key={purchase.id} className="p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg">#{purchase.invoice_number}</h3>
                          <p className="text-sm text-gray-600">{new Date(purchase.purchase_date).toLocaleDateString('fr-FR')}</p>
                          <p className="text-sm text-gray-600">{purchase.payment_method}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{purchase.total_amount_fcfa.toLocaleString()} F CFA</div>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                            purchase.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {purchase.payment_status === 'completed' ? 'Payé' : 'En attente'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {purchase.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              {item.type === 'course' ? <Wifi className="h-4 w-4 text-blue-600" /> : <Building className="h-4 w-4 text-purple-600" />}
                              <span>{item.title}</span>
                            </div>
                            <span className="font-medium">{item.price_fcfa.toLocaleString()} F CFA</span>
                          </div>
                        ))}
                      </div>
                      
                      {purchase.invoice_url && (
                        <div className="flex gap-2">
                          <button onClick={() => downloadInvoice(purchase.invoice_url!, purchase.invoice_number)} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                            <Download className="h-4 w-4" />
                            Télécharger facture
                          </button>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="p-12 text-center text-gray-500">
                      <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Aucun achat pour le moment</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Mon Compte</h2>
                  <button onClick={() => setEditMode(!editMode)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    {editMode ? 'Annuler' : 'Modifier'}
                  </button>
                </div>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom complet</label>
                    {editMode ? (
                      <input 
                        type="text" 
                        value={profileForm.name} 
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                        required 
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">{profileForm.name}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600">
                      {profileForm.email}
                      <span className="text-xs ml-2">(non modifiable)</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    {editMode ? (
                      <input 
                        type="tel" 
                        value={profileForm.phone} 
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                        placeholder="+225 XX XX XX XX XX"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">{profileForm.phone || 'Non renseigné'}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Membre depuis</label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg">
                      {new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  
                  {editMode && (
                    <button type="submit" className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                      Enregistrer les modifications
                    </button>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">Aide & Support</h2>
                
                {supportSubmitted ? (
                  <div className="p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="mt-3 text-lg font-medium">Demande envoyée</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Notre équipe vous répondra dans les plus brefs délais
                    </p>
                    <button onClick={() => setSupportSubmitted(false)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Nouvelle demande
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="h-5 w-5 text-blue-600" />
                          <h3 className="font-medium">Email</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Contactez-nous par email</p>
                        <a href="mailto:support@formationpro.com" className="text-sm text-blue-600 hover:underline">
                          support@formationpro.com
                        </a>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <MessageSquare className="h-5 w-5 text-green-600" />
                          <h3 className="font-medium">WhatsApp</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Discutez avec nous</p>
                        <a href="https://wa.me/2250000000000" target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">
                          +225 00 00 00 00 00
                        </a>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Phone className="h-5 w-5 text-purple-600" />
                          <h3 className="font-medium">Téléphone</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Lun-Ven: 8h-18h</p>
                        <a href="tel:+2250000000000" className="text-sm text-purple-600 hover:underline">
                          +225 00 00 00 00 00
                        </a>
                      </div>
                    </div>
                    
                    <h3 className="font-medium mb-4">Envoyer une demande</h3>
                    <form onSubmit={handleSupportSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Sujet</label>
                        <input
                          type="text"
                          value={supportForm.subject}
                          onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                          rows={4}
                          value={supportForm.message}
                          onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Email de contact</label>
                        <input
                          type="email"
                          value={supportForm.contact_email}
                          onChange={(e) => setSupportForm({...supportForm, contact_email: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <button 
                        type="submit"
                        disabled={submittingSupport}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {submittingSupport ? 'Envoi en cours...' : 'Envoyer la demande'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 py-6 border-t text-center text-gray-500 text-sm">
          <p>© 2025 Formation Pro. Tous droits réservés.</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;