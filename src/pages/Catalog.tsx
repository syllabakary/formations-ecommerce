import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Clock, 
  Users, 
  Play, 
  Award, 
  TrendingUp, 
  Code,
  Shield, 
  Database, 
  Palette, 
  Briefcase, 
  BarChart, 
  Languages, 
  Calculator,
  Heart, 
  ChevronDown, 
  ArrowRight,
  MapPin,
  Calendar,
  Wifi,
  Building,
  Loader2,
  AlertCircle,
  Check,
  BarChart3,
  Eye
} from 'lucide-react';

// Configuration API
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
};

// Types
interface ApiFormation {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image?: string;
  type: 'formation' | 'certification' | 'specialisation';
  level: 'debutant' | 'intermediaire' | 'avance';
  difficulty: 'facile' | 'modere' | 'difficile';
  price: number;
  original_price?: number;
  duration_hours: number;
  skills: string[];
  rating: number;
  total_reviews: number;
  total_students: number;
  is_trending: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_active: boolean;
  category: {
    id: number;
    name: string;
  };
  trainer: {
    id: number;
    name: string;
    email: string;
  };
  mode: 'online';
  formatted_price: string;
  formatted_original_price?: string;
  discount_percentage?: number;
  duration_formatted: string;
  image_url: string;
  available_seats: number;
  is_full: boolean;
}

interface ApiInPersonTraining {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image?: string;
  price: number;
  original_price?: number;
  duration_days: number;
  start_date: string;
  end_date: string;
  max_seats: number;
  registered_seats: number;
  rating: number;
  total_reviews: number;
  is_popular: boolean;
  is_active: boolean;
  status: string;
  venue_name?: string;
  venue_address?: string;
  category: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
  trainer: {
    id: number;
    name: string;
    email: string;
    rating: number;
  };
  mode: 'in-person';
  formatted_price: string;
  formatted_original_price?: string;
  formatted_date: string;
  available_seats: number;
  is_full: boolean;
  can_register: boolean;
  image_url: string;
}

type Training = ApiFormation | ApiInPersonTraining;

interface CategoryFilter {
  id: number;
  name: string;
  trainings_count: number;
}

interface CityFilter {
  id: number;
  name: string;
  trainings_count: number;
}

interface FilterData {
  categories: CategoryFilter[];
  cities: CityFilter[];
}

interface CategoryConfig {
  [key: string]: {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    gradient: string;
    bgColor: string;
  };
}

interface RegistrationFormData {
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  company: string;
  notes: string;
  course_id?: number;
  training_id?: number;
}

interface FavoriteItem {
  id: number;
}

// Service API avec gestion d'erreurs améliorée
class TrainingApiService {
  private baseURL = API_CONFIG.baseURL;

  private async fetchWithTimeout(url: string, options: RequestInit = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return response;
    } catch (error: unknown) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La requête a expiré. Veuillez réessayer.');
      }
      throw new Error('Erreur de connexion au serveur.');
    }
  }

  async getTrainings(params: {
    mode: 'online' | 'in-person';
    page?: number;
    search?: string;
    category_id?: number;
    city_id?: number;
    level?: string;
    type?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await this.fetchWithTimeout(`${this.baseURL}/v1/courses?${queryParams}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Endpoint API introuvable. Vérifiez la configuration.');
        }
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      return await response.json();
    } catch (error: unknown) {
      console.error('Erreur getTrainings:', error);
      throw error;
    }
  }

  async getFilterData() {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/v1/courses/filters/data`);

      if (!response.ok) {
        if (response.status === 404) {
          // Retourner des données vides si l'endpoint n'existe pas
          return { data: { categories: [], cities: [] } };
        }
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      return await response.json();
    } catch (error: unknown) {
      console.warn('Erreur getFilterData:', error);
      // Retourner des données vides en cas d'erreur
      return { data: { categories: [], cities: [] } };
    }
  }

  async toggleFavorite(email: string, type: 'course' | 'training', id: number) {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/v1/favorites/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type, id }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des favoris');
      }

      return await response.json();
    } catch (error: unknown) {
      console.error('Erreur toggleFavorite:', error);
      throw error;
    }
  }

  async getFavorites(email: string) {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseURL}/v1/favorites?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        if (response.status === 404 || response.status === 500) {
          // Retourner un tableau vide si l'endpoint n'existe pas ou erreur serveur
          return { data: [] };
        }
        throw new Error('Erreur lors du chargement des favoris');
      }

      return await response.json();
    } catch (error: unknown) {
      console.warn('Erreur getFavorites:', error);
      // Retourner un tableau vide en cas d'erreur
      return { data: [] };
    }
  }

  async registerForTraining(formData: RegistrationFormData) {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/v1/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erreur d\'inscription' }));
        throw new Error(error.message || 'Erreur lors de l\'inscription');
      }

      return await response.json();
    } catch (error: unknown) {
      console.error('Erreur registerForTraining:', error);
      throw error;
    }
  }
}

const UnifiedTrainingCatalog = () => {
  // États principaux
  const [activeMode, setActiveMode] = useState<'online' | 'in-person'>('online');
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filterData, setFilterData] = useState<FilterData>({ categories: [], cities: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

  // UI États
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Fonctionnalités utilisateur
  const [favorites, setFavorites] = useState<number[]>([]);
  const [comparison, setComparison] = useState<Training[]>([]);

  const apiService = new TrainingApiService();
  const userEmail = 'user@example.com';

  // Configuration des catégories
  const categoryConfig: CategoryConfig = {
    "Développement": { 
      icon: Code, 
      color: "from-blue-500 to-cyan-600", 
      gradient: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-100 text-blue-700"
    },
    "IA & Data": { 
      icon: Database, 
      color: "from-purple-500 to-indigo-600", 
      gradient: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-100 text-purple-700"
    },
    "Design": { 
      icon: Palette, 
      color: "from-pink-500 to-rose-600", 
      gradient: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-100 text-pink-700"
    },
    "Sécurité": { 
      icon: Shield, 
      color: "from-red-500 to-orange-600", 
      gradient: "from-red-500 to-orange-600",
      bgColor: "bg-red-100 text-red-700"
    },
    "Marketing": { 
      icon: TrendingUp, 
      color: "from-green-500 to-emerald-600", 
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-100 text-green-700"
    },
    "Ressources Humaines": { 
      icon: Users, 
      color: "from-teal-500 to-cyan-600", 
      gradient: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-100 text-teal-700"
    },
    "Management & Leadership": { 
      icon: Briefcase, 
      color: "from-indigo-500 to-purple-600", 
      gradient: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-100 text-indigo-700"
    },
    "Commerce & Vente": { 
      icon: BarChart, 
      color: "from-yellow-500 to-orange-600", 
      gradient: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-100 text-yellow-700"
    },
    "Langues & Communication": { 
      icon: Languages, 
      color: "from-emerald-500 to-teal-600", 
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-100 text-emerald-700"
    },
    "Finance & Audit": { 
      icon: Calculator, 
      color: "from-gray-500 to-slate-600", 
      gradient: "from-gray-500 to-slate-600",
      bgColor: "bg-gray-100 text-gray-700"
    },
  };

  // Chargement initial - une seule fois
  useEffect(() => {
    const initializeData = async () => {
      await loadFilterData();
      await loadFavorites();
    };
    initializeData();
  }, []);

  // Chargement des formations quand les filtres changent
  useEffect(() => {
    loadTrainings();
  }, [activeMode, searchTerm, selectedCategory, selectedCity, selectedLevel, selectedType, sortBy, sortOrder, currentPage]);

  const loadFilterData = async () => {
    try {
      const response = await apiService.getFilterData();
      setFilterData(response.data || { categories: [], cities: [] });
    } catch (err: unknown) {
      console.warn('Impossible de charger les filtres:', err instanceof Error ? err.message : 'Erreur inconnue');
      // Continuer sans filtres
    }
  };

  const loadTrainings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.getTrainings({
        mode: activeMode,
        page: currentPage,
        search: searchTerm || undefined,
        category_id: selectedCategory ? parseInt(selectedCategory) : undefined,
        city_id: selectedCity ? parseInt(selectedCity) : undefined,
        level: selectedLevel || undefined,
        type: selectedType || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        per_page: 12,
      });

      const data = response.data || [];
      setTrainings(data.map((item: ApiFormation | ApiInPersonTraining) => ({
        ...item,
        mode: activeMode
      })));

      setTotalPages(response.meta?.last_page || 1);
      setTotalResults(response.meta?.total || data.length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des formations');
      setTrainings([]);
      setTotalPages(1);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await apiService.getFavorites(userEmail);
      const favoriteIds = (response.data || []).map((fav: FavoriteItem) => fav.id);
      setFavorites(favoriteIds);
    } catch {
      // Silencieux - les favoris ne sont pas critiques
      console.warn('Impossible de charger les favoris');
    }
  };

  const handleModeChange = (mode: 'online' | 'in-person') => {
    setTrainings([]);
    setActiveMode(mode);
    setCurrentPage(1);
    setSelectedCategory('');
    setSelectedCity('');
    setSelectedLevel('');
    setSelectedType('');
    setComparison([]);
  };

  const toggleFavorite = async (trainingId: number) => {
    try {
      const type = activeMode === 'online' ? 'course' : 'training';
      await apiService.toggleFavorite(userEmail, type, trainingId);

      if (favorites.includes(trainingId)) {
        setFavorites(prev => prev.filter((id: number) => id !== trainingId));
        setSuccess('Retiré des favoris');
      } else {
        setFavorites(prev => [...prev, trainingId]);
        setSuccess('Ajouté aux favoris');
      }

      setTimeout(() => setSuccess(''), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour des favoris');
      setTimeout(() => setError(''), 3000);
    }
  };

  const toggleComparison = (training: Training) => {
    setComparison((prev: Training[]) => {
      const exists = prev.find((t: Training) => t.id === training.id);
      if (exists) {
        return prev.filter((t: Training) => t.id !== training.id);
      } else if (prev.length < 3) {
        return [...prev, training];
      } else {
        setError('Vous ne pouvez comparer que 3 formations maximum');
        setTimeout(() => setError(''), 3000);
        return prev;
      }
    });
  };

  const handleRegistration = async (training: Training) => {
    try {
      const formData: RegistrationFormData = {
        participant_name: 'John Doe',
        participant_email: userEmail,
        participant_phone: '+225 07 12 34 56 78',
        company: 'Ma Société',
        notes: 'Inscription depuis le catalogue',
      };

      if (activeMode === 'online') {
        formData.course_id = training.id;
      } else {
        formData.training_id = training.id;
      }

      await apiService.registerForTraining(formData);
      setSuccess('Inscription réussie ! Vous recevrez un email de confirmation.');
      setTimeout(() => setSuccess(''), 5000);

      loadTrainings();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
      setTimeout(() => setError(''), 5000);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCity('');
    setSelectedLevel('');
    setSelectedType('');
    setCurrentPage(1);
  };

  const getCategoryConfig = (categoryName: string) => {
    return categoryConfig[categoryName] || categoryConfig["Développement"];
  };

  // Composant carte formation en ligne
  const OnlineTrainingCard = ({ course }: { course: ApiFormation }) => {
    const config = getCategoryConfig(course.category.name);
    const isFavorite = favorites.includes(course.id);
    const inComparison = comparison.some(t => t.id === course.id);
    const IconComponent = config.icon;

    return (
      <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-100 overflow-hidden">
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          {course.is_trending && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Tendance
            </div>
          )}
          {course.is_new && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Nouveau
            </div>
          )}
          {course.is_bestseller && (
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Best-seller
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button
            onClick={() => toggleFavorite(course.id)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isFavorite ? 'bg-red-100 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => toggleComparison(course)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              inComparison ? 'bg-blue-100 text-blue-500' : 'bg-white/80 text-gray-400 hover:text-blue-500'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
          </button>
        </div>

        <div className="relative h-48 overflow-hidden">
          <img
            src={course.image_url || 'https://via.placeholder.com/400x300?text=Formation'}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <button className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-full font-semibold shadow hover:shadow-md transition-all transform hover:scale-105 flex items-center gap-2 text-sm">
              <Play className="h-4 w-4" />
              Aperçu
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor}`}>
              <IconComponent className="h-3 w-3" />
              <span>{course.category.name}</span>
            </div>
            <div className="text-right">
              {course.discount_percentage && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 line-through">{course.formatted_original_price}</span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                    -{course.discount_percentage}%
                  </span>
                </div>
              )}
              <div className="text-xl font-bold text-gray-900">{course.formatted_price}</div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.short_description}</p>

          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium text-gray-900">{course.rating}</span>
              <span className="text-gray-500">({course.total_reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="h-4 w-4" />
              <span>{course.total_students ? course.total_students.toLocaleString() : '0'}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{course.duration_formatted}</span>
            </div>
          </div>

          <div className="mb-4">
            {course.skills && Array.isArray(course.skills) && course.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {course.skills.slice(0, 3).map((skill: string, idx: number) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
                {course.skills.length > 3 && (
                  <span className="text-gray-400 text-xs py-1 px-2">
                    +{course.skills.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center gap-2 text-blue-600">
              <Wifi className="h-4 w-4" />
              <span>En ligne</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">{course.trainer.name}</span>
            </div>
          </div>

          <button 
            onClick={() => handleRegistration(course)}
            className={`w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r ${config.gradient} text-white shadow hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2`}
          >
            S'inscrire maintenant
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Composant carte formation en présentiel
  const InPersonTrainingCard = ({ training }: { training: ApiInPersonTraining }) => {
    const config = getCategoryConfig(training.category.name);
    const isFavorite = favorites.includes(training.id);
    const inComparison = comparison.some(t => t.id === training.id);
    const IconComponent = config.icon;

    return (
      <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-100 overflow-hidden">
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          {training.is_popular && (
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Populaire
            </div>
          )}
          {training.available_seats < 5 && training.available_seats > 0 && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Plus que {training.available_seats} places
            </div>
          )}
          {training.is_full && (
            <div className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-bold">
              Complet
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button
            onClick={() => toggleFavorite(training.id)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isFavorite ? 'bg-red-100 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => toggleComparison(training)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              inComparison ? 'bg-blue-100 text-blue-500' : 'bg-white/80 text-gray-400 hover:text-blue-500'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
          </button>
        </div>

        <div className="relative h-48 overflow-hidden">
          <img
            src={training.image_url || 'https://via.placeholder.com/400x300?text=Formation'}
            alt={training.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <button className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-full font-semibold shadow hover:shadow-md transition-all transform hover:scale-105 flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4" />
              Voir détails
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor}`}>
              <IconComponent className="h-3 w-3" />
              <span>{training.category.name}</span>
            </div>
            <div className="text-right">
              {training.formatted_original_price && (
                <div className="text-xs text-gray-500 line-through">{training.formatted_original_price}</div>
              )}
              <div className="text-xl font-bold text-gray-900">{training.formatted_price}</div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{training.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{training.short_description}</p>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{training.city && training.city.name ? training.city.name : 'Ville non spécifiée'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{training.formatted_date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{training.duration_days} jour{training.duration_days > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{training.available_seats}/{training.max_seats} places disponibles</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium text-gray-900">{training.rating}</span>
              <span className="text-gray-500">({training.total_reviews})</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Building className="h-4 w-4" />
              <span>En présentiel</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-xs">
                {training.trainer.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{training.trainer.name}</p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">{training.trainer.rating}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => handleRegistration(training)}
            disabled={training.is_full || !training.can_register}
            className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              training.is_full || !training.can_register
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : `bg-gradient-to-r ${config.gradient} text-white shadow hover:shadow-lg transform hover:scale-105`
            }`}
          >
            {training.is_full ? 'Formation complète' : !training.can_register ? 'Inscriptions fermées' : 'S\'inscrire maintenant'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {comparison.length > 0 && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 to-blue-900 text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium">
                {comparison.length} formation{comparison.length > 1 ? 's' : ''} sélectionnée{comparison.length > 1 ? 's' : ''} pour comparaison
              </span>
              <div className="flex gap-2">
                {comparison.map(training => (
                  <span key={training.id} className="bg-white/20 px-2 py-1 rounded text-sm">
                    {training.title.substring(0, 20)}...
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={comparison.length < 2}
                className="px-4 py-2 bg-white text-purple-600 rounded font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Comparer
              </button>
              <button
                onClick={() => setComparison([])}
                className="p-2 hover:bg-white/20 rounded transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl transform -skew-y-1"></div>
          <div className="relative py-14 px-6">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Catalogue de Formations
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Découvrez nos formations d'excellence, en ligne et en présentiel, pour développer vos compétences professionnelles
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>{totalResults > 0 ? `${totalResults} formations` : 'Chargement...'}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                <span>Certifications reconnues</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Contenus à jour</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Support 24/7</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-1 shadow-xl border border-white/20">
            <div className="flex">
              <button
                onClick={() => handleModeChange('online')}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeMode === 'online'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Wifi className="h-4 w-4" />
                En ligne
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {activeMode === 'online' ? trainings.length : '...'}
                </span>
              </button>
              <button
                onClick={() => handleModeChange('in-person')}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeMode === 'in-person'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Building className="h-4 w-4" />
                En présentiel
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {activeMode === 'in-person' ? trainings.length : '...'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 sticky top-0 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 md:p-6 z-30">
          <div className="block lg:hidden">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/70"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Filter className="h-4 w-4" />
                Filtres
                <ChevronDown className={`h-4 w-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
              </button>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-purple-500 flex-shrink-0"
              >
                <option value="popular">Populaires</option>
                <option value="rating">Mieux notées</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
                <option value="newest">Récentes</option>
              </select>
            </div>

            {showMobileFilters && (
              <div className="mt-4 p-4 bg-white/90 rounded-xl border border-gray-200 space-y-4">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Toutes les catégories</option>
                  {filterData.categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.trainings_count})
                    </option>
                  ))}
                </select>

                {activeMode === 'in-person' && (
                  <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Toutes les villes</option>
                    {filterData.cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name} ({city.trainings_count})
                      </option>
                    ))}
                  </select>
                )}

                {activeMode === 'online' && (
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={selectedLevel} 
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Tous niveaux</option>
                      <option value="debutant">Débutant</option>
                      <option value="intermediaire">Intermédiaire</option>
                      <option value="avance">Avancé</option>
                    </select>

                    <select 
                      value={selectedType} 
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Tous types</option>
                      <option value="formation">Formation</option>
                      <option value="certification">Certification</option>
                      <option value="specialisation">Spécialisation</option>
                    </select>
                  </div>
                )}

                <button
                  onClick={clearAllFilters}
                  className="w-full px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all"
                >
                  Effacer les filtres
                </button>
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, compétence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/70"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white/70 hover:bg-white transition-all focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Toutes les catégories</option>
                  {filterData.categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.trainings_count})
                    </option>
                  ))}
                </select>

                {activeMode === 'in-person' && (
                  <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg bg-white/70 hover:bg-white transition-all focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Toutes les villes</option>
                    {filterData.cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name} ({city.trainings_count})
                      </option>
                    ))}
                  </select>
                )}

                {activeMode === 'online' && (
                  <>
                    <select 
                      value={selectedLevel} 
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg bg-white/70 hover:bg-white transition-all focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Tous niveaux</option>
                      <option value="debutant">Débutant</option>
                      <option value="intermediaire">Intermédiaire</option>
                      <option value="avance">Avancé</option>
                    </select>

                    <select 
                      value={selectedType} 
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg bg-white/70 hover:bg-white transition-all focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Tous types</option>
                      <option value="formation">Formation</option>
                      <option value="certification">Certification</option>
                      <option value="specialisation">Spécialisation</option>
                    </select>
                  </>
                )}

                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white/70 hover:bg-white transition-all focus:ring-2 focus:ring-purple-500"
                >
                  <option value="popular">Plus populaires</option>
                  <option value="rating">Mieux notées</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="newest">Plus récentes</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Filter className="h-4 w-4" />
                Filtres avancés
              </button>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {totalResults} formation{totalResults > 1 ? 's' : ''} trouvée{totalResults > 1 ? 's' : ''}
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all"
                  >
                    Effacer tous les filtres
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
              {activeMode === 'online' ? (
                <>
                  <Wifi className="h-6 w-6 text-blue-600" />
                  Formations en ligne
                </>
              ) : (
                <>
                  <Building className="h-6 w-6 text-purple-600" />
                  Formations en présentiel
                </>
              )}
            </h2>
            <p className="text-gray-600 mt-1">
              {totalResults} formation{totalResults > 1 ? 's' : ''} disponible{totalResults > 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all hover:border-purple-500"
            >
              {viewMode === 'grid' ? '☰' : '⊞'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Chargement des formations...</p>
            </div>
          </div>
        ) : trainings.length > 0 ? (
          <>
            <div className={`grid gap-6 md:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {trainings.map((training) => (
                activeMode === 'online' ? (
                  <OnlineTrainingCard key={training.id} course={training as ApiFormation} />
                ) : (
                  <InPersonTrainingCard key={training.id} training={training as ApiInPersonTraining} />
                )
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = Math.max(1, currentPage - 2) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          currentPage === pageNum
                            ? 'bg-purple-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        } disabled:opacity-50`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
              <div className="text-6xl mb-6">
                {activeMode === 'online' ? '💻' : '🏢'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucune formation trouvée</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {searchTerm || selectedCategory || selectedCity
                  ? 'Essayez de modifier vos critères de recherche.'
                  : `Aucune formation ${activeMode === 'online' ? 'en ligne' : 'en présentiel'} disponible pour le moment.`
                }
              </p>
              <button
                onClick={clearAllFilters}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl hover:shadow-lg transition-all transform hover:scale-105"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}

        <div className="mt-20 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {activeMode === 'online' 
              ? 'Pourquoi choisir nos formations en ligne ?'
              : 'Pourquoi choisir nos formations en présentiel ?'
            }
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeMode === 'online' ? (
              <>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Flexibilité totale</h3>
                  <p className="text-gray-600">Apprenez à votre rythme, où vous voulez, quand vous voulez</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Tarifs avantageux</h3>
                  <p className="text-gray-600">Formations de qualité à des prix accessibles</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
                  <div className="text-4xl mb-4">🔄</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Mise à jour continue</h3>
                  <p className="text-gray-600">Contenus régulièrement actualisés selon les dernières tendances</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Interaction directe</h3>
                  <p className="text-gray-600">Échangez directement avec les formateurs et autres participants</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Pratique intensive</h3>
                  <p className="text-gray-600">Mises en situation réelles avec feedback immédiat</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
                  <div className="text-4xl mb-4">🌐</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Réseau professionnel</h3>
                  <p className="text-gray-600">Construisez votre réseau avec d'autres professionnels</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedTrainingCatalog;