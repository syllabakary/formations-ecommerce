import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  ArrowRight,
  Filter,
  X,
  Search,
  Loader2,
  AlertCircle,
  Check,
  Heart,
  Share2,
  BarChart3
} from 'lucide-react';

// Configuration API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Types
interface Training {
  id: number;
  title: string;
  short_description: string;
  image_url: string;
  city: { name: string };
  formatted_date: string;
  formatted_price: string;
  formatted_original_price?: string;
  duration_days: number;
  max_seats: number;
  available_seats: number;
  rating: number;
  total_reviews: number;
  is_popular: boolean;
  is_full: boolean;
  price: number;
  original_price?: number;
  category: { name: string };
  trainer: {
    name: string;
    rating: number;
  };
}

interface FilterData {
  categories: Array<{ id: number; name: string; trainings_count: number }>;
  cities: Array<{ id: number; name: string; trainings_count: number }>;
}

interface ApiResponse {
  data: Training[];
  meta: {
    last_page: number;
    total: number;
  };
}

// Hook personnalisé pour les appels API
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = useCallback(async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { apiCall, loading, error };
};

// Hook pour débouncer les recherches
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook toast local
const useLocalToast = () => {
  const success = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const error = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  return { success, error };
};

// Hook favorites simplifié
const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const isFavorite = (id: number) => favorites.includes(id);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  return { isFavorite, toggleFavorite };
};

// Composant LazyImage
const LazyImage: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  return <img src={src} alt={alt} className={className} loading="lazy" />;
};

// Composant ShareButton
const ShareButton: React.FC<{ training: Training }> = ({ training }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: training.title,
        text: training.short_description,
        url: window.location.href,
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full bg-white/80 text-gray-400 hover:text-blue-500 backdrop-blur-sm transition-all"
    >
      <Share2 className="h-4 w-4" />
    </button>
  );
};

// Composant Modal d'inscription
interface RegistrationModalProps {
  training: Training | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  training,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    participant_name: '',
    participant_email: '',
    participant_phone: '',
    company: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const { success, error } = useLocalToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!training) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await apiCall<{ message: string }>('/registrations', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          training_id: training.id
        })
      });

      success('Inscription réussie ! Vous recevrez un email de confirmation.');
      onSuccess();
      onClose();
      setFormData({
        participant_name: '',
        participant_email: '',
        participant_phone: '',
        company: '',
        notes: ''
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'inscription';
      setSubmitError(errorMessage);
      error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen || !training) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">S'inscrire à la formation</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900">{training.title}</h4>
            <p className="text-sm text-blue-700 mt-1">
              {training.city.name} • {training.formatted_date} • {training.formatted_price}
            </p>
          </div>

          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 text-sm">{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
              <input
                type="text"
                name="participant_name"
                value={formData.participant_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Votre nom complet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="participant_email"
                value={formData.participant_email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input
                type="tel"
                name="participant_phone"
                value={formData.participant_phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+225 XX XX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de votre entreprise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Questions ou informations supplémentaires..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Inscription...
                  </>
                ) : (
                  'S\'inscrire'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Composant carte de formation
interface TrainingCardProps {
  training: Training;
  onRegister: (training: Training) => void;
  onViewDetails: (trainingId: number) => void;
  comparison: Training[];
  onToggleComparison: (training: Training) => void;
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  training,
  onRegister,
  onViewDetails,
  comparison,
  onToggleComparison
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { success } = useLocalToast();

  const handleFavoriteClick = () => {
    toggleFavorite(training.id);
    success(
      isFavorite(training.id)
        ? 'Formation retirée des favoris'
        : 'Formation ajoutée aux favoris'
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative">
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        <button
          onClick={handleFavoriteClick}
          className={`p-2 rounded-full backdrop-blur-sm transition-all ${
            isFavorite(training.id)
              ? 'bg-red-100 text-red-500'
              : 'bg-white/80 text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite(training.id) ? 'fill-current' : ''}`} />
        </button>

        <ShareButton training={training} />

        <button
          onClick={() => onToggleComparison(training)}
          className={`p-2 rounded-full backdrop-blur-sm transition-all ${
            comparison.some(t => t.id === training.id)
              ? 'bg-blue-100 text-blue-500'
              : 'bg-white/80 text-gray-400 hover:text-blue-500'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
        </button>
      </div>

      <div className="relative h-48 overflow-hidden">
        <LazyImage
          src={training.image_url}
          alt={training.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {training.is_popular && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Populaire
            </span>
          )}
          {training.available_seats < 5 && training.available_seats > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Plus que {training.available_seats} places
            </span>
          )}
          {training.is_full && (
            <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-bold">
              Complet
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {training.category.name}
          </span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-gray-900 font-medium">{training.rating}</span>
            <span className="text-gray-500 text-sm">({training.total_reviews})</span>
          </div>
        </div>

        <h3 
          className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600"
          onClick={() => onViewDetails(training.id)}
        >
          {training.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{training.short_description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span>{training.city.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span>{training.formatted_date}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="h-5 w-5 text-gray-400" />
            <span>{training.duration_days} jour{training.duration_days > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="h-5 w-5 text-gray-400" />
            <span>{training.max_seats} places max ({training.available_seats} disponibles)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
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

        <div className="flex justify-between items-center mt-6">
          <div>
            {training.original_price && training.original_price > training.price && (
              <span className="text-sm text-gray-500 line-through mr-2">
                {training.formatted_original_price}
              </span>
            )}
            <span className="text-xl font-bold text-gray-900">
              {training.formatted_price}
            </span>
          </div>
          <button
            onClick={() => onRegister(training)}
            disabled={training.is_full}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1 transition-all ${
              training.is_full
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {training.is_full ? 'Complet' : 'S\'inscrire'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant principal
const InPersonTrainingCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('start_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filterData, setFilterData] = useState<FilterData>({ categories: [], cities: [] });
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [comparison, setComparison] = useState<Training[]>([]);

  const { apiCall, loading, error } = useApi();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const data = await apiCall<FilterData>('/courses/filters/data');
        setFilterData(data);
      } catch (err) {
        console.error('Erreur lors du chargement des filtres:', err);
      }
    };

    loadFilterData();
  }, [apiCall]);

  const loadTrainings = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      if (selectedCity) params.append('city_id', selectedCity);
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (activeTab !== 'all') params.append('tab', activeTab);
      if (currentPage > 1) params.append('page', currentPage.toString());
      if (sortBy) params.append('sort_by', sortBy);
      if (sortOrder) params.append('sort_order', sortOrder);

      const data: ApiResponse = await apiCall<ApiResponse>(`/courses?${params.toString()}`);
      setTrainings(data.data);
      setTotalPages(data.meta.last_page);
      setTotalResults(data.meta.total);
    } catch (err) {
      console.error('Erreur lors du chargement des formations:', err);
    }
  }, [apiCall, debouncedSearchTerm, selectedCity, selectedCategory, activeTab, currentPage, sortBy, sortOrder]);

  useEffect(() => {
    loadTrainings();
  }, [loadTrainings]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCity, selectedCategory, activeTab, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedCategory('');
    setCurrentPage(1);
    setSortBy('start_date');
    setSortOrder('asc');
  };

  const handleRegistration = (training: Training) => {
    setSelectedTraining(training);
    setShowRegistrationModal(true);
  };

  const handleViewDetails = (trainingId: number) => {
    console.log('Voir détails formation:', trainingId);
  };

  const handleRegistrationSuccess = () => {
    setSuccessMessage('Inscription réussie ! Vous recevrez un email de confirmation.');
    setTimeout(() => setSuccessMessage(''), 5000);
    loadTrainings();
  };

  const handleToggleComparison = (training: Training) => {
    setComparison(prev => {
      const exists = prev.find(t => t.id === training.id);
      if (exists) {
        return prev.filter(t => t.id !== training.id);
      } else if (prev.length < 3) {
        return [...prev, training];
      } else {
        return prev;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {comparison.length > 0 && (
        <div className="sticky top-0 z-30 bg-blue-600 text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium">
                {comparison.length} formation{comparison.length > 1 ? 's' : ''} sélectionnée{comparison.length > 1 ? 's' : ''}
              </span>
            </div>
            <button onClick={() => setComparison([])} className="p-2 hover:bg-white/20 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Formations en Présentiel</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Apprentissage immersif avec nos experts
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="relative flex-1 max-w-2xl">
                <input
                  type="text"
                  placeholder="Rechercher une formation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-white focus:outline-none placeholder-white/70"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/80" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-4 bg-white text-blue-800 rounded-lg font-medium hover:bg-gray-100 transition-all"
              >
                <Filter className="h-5 w-5" />
                Filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="max-w-7xl mx-auto px-4 py-6 -mt-8 bg-white rounded-xl shadow-lg z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les villes</option>
                {filterData.cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name} ({city.trainings_count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes catégories</option>
                {filterData.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.trainings_count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder as 'asc' | 'desc');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="start_date-asc">Date (plus proche)</option>
                <option value="price-asc">Prix (croissant)</option>
                <option value="rating-desc">Note (meilleure)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 border border-blue-200 rounded-lg hover:bg-blue-50"
              >
                <X className="h-4 w-4" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            À venir
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'past' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Passées
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Toutes
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">Erreur : {error}</span>
          </div>
        )}

        {loading && trainings.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Chargement des formations...</p>
            </div>
          </div>
        )}

        {!loading && trainings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainings.map(training => (
                <TrainingCard
                  key={training.id}
                  training={training}
                  onRegister={handleRegistration}
                  onViewDetails={handleViewDetails}
                  comparison={comparison}
                  onToggleComparison={handleToggleComparison}
                />
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
                            ? 'bg-blue-600 text-white'
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
        ) : !loading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune formation trouvée</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCity || selectedCategory
                  ? "Essayez d'ajuster vos critères de recherche"
                  : "Aucune formation programmée pour le moment"}
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi choisir nos formations en présentiel ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Apprentissage immersif",
                description: "Environnement dédié à 100% à votre formation sans distractions",
                icon: "🎯"
              },
              {
                title: "Réseau professionnel",
                description: "Rencontrez d'autres professionnels et échangez avec des experts",
                icon: "🤝"
              },
              {
                title: "Pratique intensive",
                description: "Mises en situation réelles avec feedback immédiat des formateurs",
                icon: "⚡"
              },
              {
                title: "Matériel fourni",
                description: "Tout le nécessaire technique est mis à disposition sur place",
                icon: "🛠️"
              },
              {
                title: "Lieux inspirants",
                description: "Nos centres de formation sont conçus pour favoriser la créativité",
                icon: "🏢"
              },
              {
                title: "Suivi post-formation",
                description: "Accès à un mentor pendant 1 mois après votre formation",
                icon: "📞"
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RegistrationModal
        training={selectedTraining}
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
};

export default InPersonTrainingCatalog;