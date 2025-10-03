import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, BookOpen, Users, Award, Calendar, 
  Star, Clock, Briefcase, GraduationCap, Globe, 
  Play, Check, Search, Code, Database, Palette, 
  Shield, TrendingUp, Languages, Calculator, BarChart,
  MapPin, X, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Configuration API
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
};

// Grandes villes de Côte d'Ivoire
const CITIES_CI = [
  'Abidjan', 'Bouaké', 'Daloa', 'San-Pédro', 'Yamoussoukro',
  'Korhogo', 'Man', 'Divo', 'Gagnoa', 'Abengourou'
];

// Service API
class ApiService {
  private baseURL = API_CONFIG.baseURL;

  async getCategories() {
    try {
      const response = await fetch(`${this.baseURL}/v1/courses/filters/data`);
      if (!response.ok) return { data: { categories: [], cities: [] } };
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Erreur chargement catégories:', error);
      return { data: { categories: [], cities: [] } };
    }
  }

  async searchTrainings(query: string) {
    try {
      // Rechercher dans les formations en ligne ET en présentiel
      const [onlineResponse, inPersonResponse] = await Promise.all([
        fetch(`${this.baseURL}/v1/courses?mode=online&search=${encodeURIComponent(query)}&per_page=3`),
        fetch(`${this.baseURL}/v1/courses?mode=in-person&search=${encodeURIComponent(query)}&per_page=3`)
      ]);
      
      const onlineData = onlineResponse.ok ? await onlineResponse.json() : { data: [] };
      const inPersonData = inPersonResponse.ok ? await inPersonResponse.json() : { data: [] };
      
      // Combiner les résultats et limiter à 6 au total
      const combined = [
        ...(onlineData.data || []).map(item => ({ ...item, mode: 'online' })),
        ...(inPersonData.data || []).map(item => ({ ...item, mode: 'in-person' }))
      ].slice(0, 6);
      
      return { data: combined };
    } catch (error) {
      console.warn('Erreur recherche:', error);
      return { data: [] };
    }
  }

  async getPopularCourses() {
    try {
      const response = await fetch(`${this.baseURL}/v1/courses?mode=online&sort_by=popular&per_page=3`);
      if (!response.ok) return { data: [] };
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Erreur chargement formations populaires:', error);
      return { data: [] };
    }
  }
}

const AnimatedCounter = ({ end, duration = 2, label, icon }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    
    const updateCounter = () => {
      start += increment;
      if (start < end) {
        setCount(Math.ceil(start));
        requestAnimationFrame(updateCounter);
      } else {
        setCount(end);
      }
    };
    
    controls.start({ opacity: 1, y: 0 });
    updateCounter();
  }, [end, controls, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
    >
      <div className="text-purple-600 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-4xl font-bold text-gray-900 mb-2">
        {count}+
      </h3>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  );
};

const CourseCard = ({ title, rating, duration, startDate, price, image, onClick, isTrending, isNew }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        {(isTrending || isNew) && (
          <div className="absolute top-3 left-3 z-10 flex gap-2">
            {isTrending && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Tendance
              </div>
            )}
            {isNew && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Nouveau
              </div>
            )}
          </div>
        )}
        <img 
          src={image} 
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x300?text=Formation';
          }}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-yellow-400 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current' : ''}`} />
          ))}
          <span className="text-gray-500 ml-2 text-sm">{rating} ({Math.floor(rating * 20)} avis)</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{title}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-4 space-x-3">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </span>
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {startDate}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-purple-600">{price} F CFA</span>
          <button className="bg-purple-100 text-purple-600 p-2 rounded-full hover:bg-purple-200 transition-colors">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialCard = ({ quote, author, role, avatar }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
    >
      <div className="flex items-center text-yellow-400 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-current" />
        ))}
      </div>
      <p className="text-gray-600 italic mb-6 text-lg">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-purple-200">
          <img src={avatar} alt={author} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{author}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  
  // États pour le moteur de recherche intelligent
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef(null);
  const categoryRef = useRef(null);
  const cityRef = useRef(null);
  
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

  const apiService = new ApiService();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  useEffect(() => {
    loadCategories();
    loadPopularCourses();
  }, []);

  // Fermer les dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Recherche intelligente avec suggestions et filtrage côté client
  useEffect(() => {
    const searchWithDelay = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const response = await apiService.searchTrainings(searchQuery);
          
          // Filtrer et trier les résultats par pertinence
          const results = (response.data || []).filter(item => {
            const searchLower = searchQuery.toLowerCase();
            const titleMatch = item.title?.toLowerCase().includes(searchLower);
            const descMatch = item.short_description?.toLowerCase().includes(searchLower);
            const categoryMatch = item.category?.name?.toLowerCase().includes(searchLower);
            const skillsMatch = item.skills?.some(skill => skill.toLowerCase().includes(searchLower));
            
            return titleMatch || descMatch || categoryMatch || skillsMatch;
          }).sort((a, b) => {
            // Prioriser les correspondances dans le titre
            const aTitle = a.title?.toLowerCase().includes(searchQuery.toLowerCase());
            const bTitle = b.title?.toLowerCase().includes(searchQuery.toLowerCase());
            if (aTitle && !bTitle) return -1;
            if (!aTitle && bTitle) return 1;
            return 0;
          });
          
          setSearchSuggestions(results);
          setShowSuggestions(results.length > 0);
        } catch (error) {
          console.error('Erreur recherche:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(searchWithDelay);
  }, [searchQuery]);

  const loadCategories = async () => {
    const response = await apiService.getCategories();
    setCategories(response.data?.categories || []);
    setCities(response.data?.cities || []);
  };

  const loadPopularCourses = async () => {
    const response = await apiService.getPopularCourses();
    setPopularCourses(response.data || []);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedCity) params.append('city', selectedCity);
    
    navigate(`/catalog?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion) => {
    // Redirection selon le mode de formation
    if (suggestion.mode === 'online') {
      navigate(`/course/${suggestion.slug}`);
    } else {
      navigate(`/training/${suggestion.slug}`);
    }
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const categoryIcons = {
    "Développement": Code,
    "IA & Data": Database,
    "Design": Palette,
    "Sécurité": Shield,
    "Marketing": TrendingUp,
    "Ressources Humaines": Users,
    "Management & Leadership": Briefcase,
    "Commerce & Vente": BarChart,
    "Langues & Communication": Languages,
    "Finance & Audit": Calculator,
  };

  const testimonials = [
    {
      quote: "Grâce à EMPOWER FORMATION, j'ai pu me reconvertir professionnellement en seulement 6 mois. La qualité des cours et le soutien de la communauté ont été déterminants dans ma réussite.",
      author: "Aminata Diallo",
      role: "Développeuse Web, Dakar",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      quote: "Les cours sont très bien structurés et les formateurs sont toujours disponibles pour répondre aux questions. J'ai pu développer mes compétences et trouver un emploi rapidement.",
      author: "Kofi Mensah",
      role: "Data Analyst, Accra",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="space-y-20">
      {/* Hero Section avec Moteur de Recherche Intelligent */}
      <section className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full opacity-30 transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-300 rounded-full opacity-40 transform translate-x-16 translate-y-16"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-1">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 z-10 relative"
            >
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Trouvez la solution de <span className="text-purple-600">formation adaptée</span> à vos besoins
                </h1>
                <div className="w-32 h-1 bg-purple-600"></div>
              </div>
              
              {/* Moteur de Recherche Intelligent */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6 border-2 border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Votre recherche</h3>
                
                <form onSubmit={handleSearch} className="space-y-4">
                  {/* Champ de recherche avec suggestions */}
                  <div ref={searchRef} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Que souhaitez-vous apprendre ?
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
                        placeholder="Ex: Développement web, Marketing digital, Data science..."
                        className="w-full pl-12 pr-10 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-base"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setSearchSuggestions([]);
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                        >
                          <X className="h-5 w-5 text-gray-400" />
                        </button>
                      )}
                      {isSearching && (
                        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Suggestions de recherche */}
                    <AnimatePresence>
                      {showSuggestions && searchSuggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-80 overflow-y-auto"
                        >
                          <div className="p-2">
                            <div className="text-xs font-medium text-gray-500 px-3 py-2">
                              Suggestions ({searchSuggestions.length})
                            </div>
                            {searchSuggestions.map((suggestion) => (
                              <button
                                key={suggestion.id}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left px-3 py-3 hover:bg-purple-50 rounded-lg transition-colors flex items-start gap-3"
                              >
                                <Search className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 line-clamp-1">
                                    {suggestion.title}
                                  </div>
                                  <div className="text-sm text-gray-600 line-clamp-1 flex items-center gap-2">
                                    <span>{suggestion.category?.name}</span>
                                    <span>•</span>
                                    <span>{suggestion.mode === 'online' ? 'En ligne' : 'En présentiel'}</span>
                                    <span>•</span>
                                    <span>{suggestion.duration_formatted || (suggestion.duration_days ? `${suggestion.duration_days} jours` : 'N/A')}</span>
                                  </div>
                                </div>
                                <div className="text-sm font-semibold text-purple-600 flex-shrink-0">
                                  {suggestion.formatted_price}
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Sélection de catégorie */}
                  <div ref={categoryRef} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domaine de formation
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-left focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all flex items-center justify-between hover:border-gray-300"
                    >
                      <span className={selectedCategory ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedCategory 
                          ? categories.find(c => c.id.toString() === selectedCategory)?.name 
                          : 'Toutes les catégories'}
                      </span>
                      <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {showCategoryDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-80 overflow-y-auto"
                        >
                          <div className="p-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCategory('');
                                setShowCategoryDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-lg transition-colors font-medium text-gray-900"
                            >
                              Toutes les catégories
                            </button>
                            {categories.map((category) => {
                              const IconComponent = categoryIcons[category.name] || Code;
                              return (
                                <button
                                  key={category.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCategory(category.id.toString());
                                    setShowCategoryDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-3"
                                >
                                  <IconComponent className="h-5 w-5 text-gray-600" />
                                  <span className="flex-1 text-gray-900">{category.name}</span>
                                  <span className="text-sm text-gray-500">{category.trainings_count}</span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Sélection de ville */}
                  <div ref={cityRef} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville (formations en présentiel)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCityDropdown(!showCityDropdown)}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-left focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all flex items-center justify-between hover:border-gray-300"
                    >
                      <span className={selectedCity ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedCity 
                          ? cities.find(c => c.id.toString() === selectedCity)?.name 
                          : 'Toutes les villes'}
                      </span>
                      <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {showCityDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-80 overflow-y-auto"
                        >
                          <div className="p-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCity('');
                                setShowCityDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-lg transition-colors font-medium text-gray-900"
                            >
                              Toutes les villes
                            </button>
                            {cities.filter(city => CITIES_CI.includes(city.name)).map((city) => (
                              <button
                                key={city.id}
                                type="button"
                                onClick={() => {
                                  setSelectedCity(city.id.toString());
                                  setShowCityDropdown(false);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-3"
                              >
                                <MapPin className="h-5 w-5 text-gray-600" />
                                <span className="flex-1 text-gray-900">{city.name}</span>
                                <span className="text-sm text-gray-500">{city.trainings_count}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <Search className="h-6 w-6" />
                    Rechercher
                  </button>
                </form>
                
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Raccourcis :</span>
                  <button
                    type="button"
                    onClick={() => navigate('/catalog?mode=online')}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-all"
                  >
                    Formations à distance
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/catalog?mode=in-person')}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-all"
                  >
                    Formations CPF
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-6 pt-4">
                {[
                  { icon: <Check className="h-5 w-5 text-green-500" />, text: "Formations certifiantes" },
                  { icon: <Check className="h-5 w-5 text-green-500" />, text: "Experts internationaux" },
                  { icon: <Check className="h-5 w-5 text-green-500" />, text: "Flexibilité totale" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
           
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="absolute top-[-20%] left-[5%] w-full h-full flex justify-center items-start">
                <img
                  src="/asset/LOGO EMPOWER FORMATION/Symbol EF.jpg"
                  alt="Logo Empower Formation"
                  className="w-100/120 md:w-100/120 opacity-20 object-contain"
                />
              </div>

              <div className="relative overflow-hidden rounded-xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <img
                  src="/asset/femme.png"
                  alt="Femme africaine étudiant avec ordinateur portable"
                  className="w-full h-auto object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="text-white">
                    <h3 className="font-bold text-lg mb-1">Formation en cours</h3>
                    <p className="text-sm opacity-90">Développement Web Full Stack</p>
                    <div className="w-full bg-white/30 h-1 mt-2 rounded-full">
                      <div className="bg-purple-500 h-1 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Catégories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Domaines de formation</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explorez nos différents domaines de formation et trouvez celui qui correspond à vos ambitions professionnelles
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.name] || Code;
            
            return (
              <motion.div
                key={`category-${category.id}-${category.name}`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => navigate(`/catalog?category=${category.id}`)}
                className="cursor-pointer"
              >
                <div className="bg-white hover:bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-300">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-xl">
                      <IconComponent className="h-8 w-8 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-sm leading-tight text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-600">{category.trainings_count} formations</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <button 
            onClick={() => navigate('/catalog')}
            className="text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-2 mx-auto hover:gap-3 transition-all"
          >
            Voir toutes les catégories
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </section>

      {/* Statistiques Animées */}
      <section ref={ref} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Notre impact en chiffres</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez comment nous transformons l'apprentissage et créons de nouvelles opportunités à travers l'Afrique.
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
          >
            <motion.div variants={itemVariants}>
              <AnimatedCounter 
                end={5000} 
                label="Apprenants formés" 
                icon={<Users className="h-10 w-10 mx-auto" />} 
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <AnimatedCounter 
                end={50} 
                label="Formations disponibles" 
                icon={<BookOpen className="h-10 w-10 mx-auto" />} 
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <AnimatedCounter 
                end={95} 
                label="Taux de satisfaction" 
                icon={<Star className="h-10 w-10 mx-auto" />} 
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <AnimatedCounter 
                end={20} 
                label="Pays représentés" 
                icon={<Globe className="h-10 w-10 mx-auto" />} 
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Pourquoi choisir EMPOWER FORMATION ?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Notre approche innovante combine expertise pédagogique et technologies avancées pour une expérience d'apprentissage optimale.</p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {[
            {
              icon: <BookOpen className="h-8 w-8 text-purple-600" />,
              title: "Formations de qualité",
              description: "Des cours conçus par des experts pour développer vos compétences professionnelles"
            },
            {
              icon: <Users className="h-8 w-8 text-purple-600" />,
              title: "Communauté active",
              description: "Rejoignez une communauté dynamique d'apprenants et d'experts"
            },
            {
              icon: <Award className="h-8 w-8 text-purple-600" />,
              title: "Certificats reconnus",
              description: "Obtenez des certificats valorisants pour votre carrière"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="text-center space-y-4 p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Formations populaires */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Nos formations les plus populaires</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Découvrez nos formations les plus demandées par les professionnels et les entreprises.</p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {popularCourses.length > 0 ? (
            popularCourses.map((course) => (
              <motion.div key={course.id} variants={itemVariants}>
                <CourseCard 
                  title={course.title}
                  rating={course.rating}
                  duration={course.duration_formatted}
                  startDate="Inscription ouverte"
                  price={course.formatted_price}
                  image={course.image_url || 'https://via.placeholder.com/400x300?text=Formation'}
                  onClick={() => navigate(`/course/${course.slug}`)}
                  isTrending={course.is_trending}
                  isNew={course.is_new}
                />
              </motion.div>
            ))
          ) : (
            [
              {
                title: "Développement Web Full Stack",
                rating: 4.9,
                duration: "12 semaines",
                startDate: "15 mai",
                price: "350 000",
                image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
              },
              {
                title: "Data Science & Intelligence Artificielle",
                rating: 4.8,
                duration: "16 semaines",
                startDate: "1er juin",
                price: "450 000",
                image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
              },
              {
                title: "Marketing Digital & Growth Hacking",
                rating: 4.7,
                duration: "8 semaines",
                startDate: "10 mai",
                price: "280 000",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
              }
            ].map((course, index) => (
              <motion.div key={index} variants={itemVariants}>
                <CourseCard 
                  {...course}
                  onClick={() => navigate('/catalog')}
                />
              </motion.div>
            ))
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button 
            onClick={() => navigate('/catalog')}
            className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center space-x-2 mx-auto hover:translate-x-2"
          >
            <span>Voir toutes nos formations</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </section>

      {/* Témoignages */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos apprenants</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Découvrez les expériences de ceux qui ont déjà suivi nos formations.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </section>

      {/* Avantages */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="text-3xl font-bold mb-6">Pourquoi nous rejoindre ?</h2>
            <div className="space-y-6">
              {[
                {
                  icon: <Briefcase className="h-6 w-6 text-purple-600" />,
                  title: "Insertion professionnelle",
                  description: "Notre réseau d'entreprises partenaires facilite votre entrée sur le marché du travail."
                },
                {
                  icon: <GraduationCap className="h-6 w-6 text-purple-600" />,
                  title: "Pédagogie innovante",
                  description: "Une approche pratique basée sur des projets concrets et des situations réelles."
                },
                {
                  icon: <Globe className="h-6 w-6 text-purple-600" />,
                  title: "Accessibilité",
                  description: "Des formations flexibles et accessibles partout en Afrique avec un simple accès internet."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ x: 10 }}
                  className="flex items-start"
                >
                  <div className="mt-1 bg-purple-100 p-2 rounded-full mr-4">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-lg text-white text-lg font-semibold hover:shadow-lg transition-all"
            >
              S'inscrire maintenant
            </motion.button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden shadow-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" 
              alt="Étudiants africains" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-6"
          >
            Prêt à transformer votre avenir ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white text-xl mb-8"
          >
            Rejoignez notre communauté de 5000+ apprenants et développez les compétences qui feront la différence dans votre carrière.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/catalog')}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Découvrir nos formations
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all"
            >
              Nous contacter
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;