import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Clock, 
  Users, 
  Play, 
  BookOpen,
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
  Wrench, 
  Truck, 
  Leaf,
  ChevronDown, 
  ArrowRight,
  MapPin,
  Calendar,
  Wifi,
  Building,
  Loader2,
  AlertCircle,
  Check,
  Share2,
  BarChart3,
  PlusCircle,
  Eye
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Types
interface OnlineCourse {
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
  new: boolean;
  discount?: number;
  difficulty: string;
  mode: 'online';
}

interface InPersonTraining {
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
  mode: 'in-person';
}


type Training = OnlineCourse | InPersonTraining;

type CategoryConfig = {
  [key: string]: {
    icon: LucideIcon;
    color: string;
    gradient: string;
    bgColor: string;
  }
};

const UnifiedTrainingCatalog = () => {
  // États principaux
  const [activeMode, setActiveMode] = useState<'online' | 'in-person'>('online');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [comparison, setComparison] = useState<Training[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Données mockées - formations en ligne
  const onlineCourses: OnlineCourse[] = [
    {
      id: 1,
      title: "Développement Web Full Stack Moderne",
      category: "Développement",
      level: "Débutant",
      type: "Certification",
      price: 89500,
      originalPrice: 125000,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500",
      description: "Maîtrisez React, Node.js, MongoDB et déployez des applications professionnelles",
      duration: "45h",
      students: 2847,
      rating: 4.9,
      reviews: 892,
      instructor: "Sarah Chen",
      modules: 16,
      skills: ["React", "Node.js", "MongoDB", "AWS", "Docker"],
      trending: true,
      bestseller: true,
      new: false,
      discount: 28,
      difficulty: "Facile",
      mode: 'online'
    },
    {
      id: 2,
      title: "Data Science avec Python",
      category: "IA & Data",
      level: "Intermédiaire",
      type: "Formation",
      price: 75000,
      originalPrice: 95000,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500",
      description: "Analyse de données, machine learning et visualisation avec Python",
      duration: "40h",
      students: 1523,
      rating: 4.7,
      reviews: 456,
      instructor: "Dr. Ahmed Kone",
      modules: 12,
      skills: ["Python", "Pandas", "Scikit-learn", "Matplotlib", "Jupyter"],
      trending: false,
      bestseller: true,
      new: true,
      discount: 21,
      difficulty: "Modéré",
      mode: 'online'
    },
    {
      id: 3,
      title: "Design UX/UI Complet",
      category: "Design",
      level: "Débutant",
      type: "Certification",
      price: 65000,
      originalPrice: 85000,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500",
      description: "Créez des interfaces utilisateur exceptionnelles avec Figma et les bonnes pratiques",
      duration: "35h",
      students: 987,
      rating: 4.8,
      reviews: 234,
      instructor: "Marie Dubois",
      modules: 10,
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Design Systems"],
      trending: true,
      bestseller: false,
      new: true,
      discount: 24,
      difficulty: "Facile",
      mode: 'online'
    }
  ];

  // Données mockées - formations en présentiel
  const inPersonTrainings: InPersonTraining[] = [
    {
      id: 101,
      title: "Workshop Développement Mobile Flutter",
      short_description: "Créez des applications mobiles natives pour iOS et Android avec Flutter",
      image_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500",
      city: { name: "Abidjan" },
      formatted_date: "15-17 Mars 2024",
      formatted_price: "150 000 F",
      formatted_original_price: "200 000 F",
      duration_days: 3,
      max_seats: 20,
      available_seats: 8,
      rating: 4.9,
      total_reviews: 45,
      is_popular: true,
      is_full: false,
      price: 150000,
      original_price: 200000,
      category: { name: "Développement" },
      trainer: {
        name: "Yves Kouame",
        rating: 4.8
      },
      mode: 'in-person'
    },
    {
      id: 102,
      title: "Masterclass Intelligence Artificielle",
      short_description: "Plongez dans l'IA avec TensorFlow et construisez vos premiers modèles",
      image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500",
      city: { name: "Dakar" },
      formatted_date: "22-24 Mars 2024",
      formatted_price: "180 000 F",
      duration_days: 3,
      max_seats: 15,
      available_seats: 3,
      rating: 4.7,
      total_reviews: 28,
      is_popular: false,
      is_full: false,
      price: 180000,
      category: { name: "IA & Data" },
      trainer: {
        name: "Dr. Fatou Sow",
        rating: 4.9
      },
      mode: 'in-person'
    },
    {
      id: 103,
      title: "Bootcamp Cybersécurité",
      short_description: "Formation intensive en sécurité informatique et ethical hacking",
      image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500",
      city: { name: "Casablanca" },
      formatted_date: "5-7 Avril 2024",
      formatted_price: "220 000 F",
      duration_days: 3,
      max_seats: 12,
      available_seats: 0,
      rating: 4.8,
      total_reviews: 67,
      is_popular: true,
      is_full: true,
      price: 220000,
      category: { name: "Sécurité" },
      trainer: {
        name: "Hassan El Amrani",
        rating: 4.7
      },
      mode: 'in-person'
    }
  ];

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
    "Santé & Sécurité au travail": { 
      icon: Heart, 
      color: "from-rose-500 to-pink-600", 
      gradient: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-100 text-rose-700"
    }
  };

  // Obtenir les données selon le mode actif
  const getCurrentTrainings = (): Training[] => {
    if (activeMode === 'online') {
      return onlineCourses;
    } else {
      return inPersonTrainings;
    }
  };

  // Filtrage et tri
  const filteredTrainings = useMemo(() => {
    const trainings = getCurrentTrainings();
    
    const filtered = trainings.filter(training => {
      // Recherche par titre et description
      const searchFields = [
        training.title.toLowerCase(),
        activeMode === 'online' 
          ? (training as OnlineCourse).description.toLowerCase()
          : (training as InPersonTraining).short_description.toLowerCase()
      ];
      
      if (activeMode === 'online') {
        const course = training as OnlineCourse;
        searchFields.push(...course.skills.map(skill => skill.toLowerCase()));
      }
      
      const matchesSearch = !searchTerm || searchFields.some(field => 
        field.includes(searchTerm.toLowerCase())
      );

      // Filtres spécifiques selon le mode
      let matchesCategory = true;
      if (selectedCategory) {
        if (activeMode === 'online') {
          matchesCategory = (training as OnlineCourse).category === selectedCategory;
        } else {
          matchesCategory = (training as InPersonTraining).category.name === selectedCategory;
        }
      }

      let matchesLevel = true;
      if (selectedLevel && activeMode === 'online') {
        matchesLevel = (training as OnlineCourse).level === selectedLevel;
      }

      let matchesType = true;
      if (selectedType && activeMode === 'online') {
        matchesType = (training as OnlineCourse).type === selectedType;
      }

      return matchesSearch && matchesCategory && matchesLevel && matchesType;
    });

    // Tri
    switch(sortBy) {
      case 'popular':
        return filtered.sort((a, b) => {
          if (activeMode === 'online') {
            return (b as OnlineCourse).students - (a as OnlineCourse).students;
          } else {
            return (b as InPersonTraining).total_reviews - (a as InPersonTraining).total_reviews;
          }
        });
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'newest':
        if (activeMode === 'online') {
          return filtered.sort((a, b) => Number((b as OnlineCourse).new) - Number((a as OnlineCourse).new));
        }
        return filtered;
      default:
        return filtered;
    }
  }, [activeMode, searchTerm, selectedCategory, selectedLevel, selectedType, sortBy]);

  // Fonctions utilitaires
  const toggleFavorite = (trainingId: number) => {
    setFavorites(prev => 
      prev.includes(trainingId) 
        ? prev.filter(id => id !== trainingId)
        : [...prev, trainingId]
    );
  };

  const toggleComparison = (training: Training) => {
    setComparison(prev => {
      const exists = prev.find(t => t.id === training.id);
      if (exists) {
        return prev.filter(t => t.id !== training.id);
      } else if (prev.length < 3) {
        return [...prev, training];
      }
      return prev;
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
    setSelectedType('');
    setSelectedDuration('');
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('fr-FR') + ' F';
  };

  const getCategoryConfig = (categoryName: string) => {
    return categoryConfig[categoryName] || categoryConfig["Développement"];
  };

  // Composant carte formation en ligne
  const OnlineTrainingCard = ({ course }: { course: OnlineCourse }) => {
    const config = getCategoryConfig(course.category);
    const isFavorite = favorites.includes(course.id);
    const inComparison = comparison.some(t => t.id === course.id);

    return (
      <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-100 overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          {course.trending && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Tendance
            </div>
          )}
          {course.new && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Nouveau
            </div>
          )}
          {course.bestseller && (
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Best-seller
            </div>
          )}
        </div>

        {/* Actions */}
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

        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.image}
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

        {/* Contenu */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor}`}>
              <config.icon className="h-3 w-3" />
              <span>{course.category}</span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 line-through">{formatPrice(course.originalPrice)}</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                  -{course.discount}%
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">{formatPrice(course.price)}</div>
            </div>
          </div>

          {/* Titre */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium text-gray-900">{course.rating}</span>
              <span className="text-gray-500">({course.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="h-4 w-4" />
              <span>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          </div>

          {/* Compétences */}
          <div className="mb-4">
            {course.skills && Array.isArray(course.skills) && course.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {course.skills.slice(0, 3).map((skill, idx) => (
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

          {/* Mode et formateur */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center gap-2 text-blue-600">
              <Wifi className="h-4 w-4" />
              <span>En ligne</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">{course.instructor}</span>
            </div>
          </div>

          {/* Action */}
          <button 
            className={`w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r ${config.gradient} text-white shadow hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2`}
          >
            Commencer maintenant
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Composant carte formation en présentiel
  const InPersonTrainingCard = ({ training }: { training: InPersonTraining }) => {
    const config = getCategoryConfig(training.category.name);
    const isFavorite = favorites.includes(training.id);
    const inComparison = comparison.some(t => t.id === training.id);

    return (
      <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-100 overflow-hidden">
        {/* Badges */}
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

        {/* Actions */}
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

        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={training.image_url}
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

        {/* Contenu */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor}`}>
              <config.icon className="h-3 w-3" />
              <span>{training.category.name}</span>
            </div>
            <div className="text-right">
              {training.formatted_original_price && (
                <div className="text-xs text-gray-500 line-through">{training.formatted_original_price}</div>
              )}
              <div className="text-xl font-bold text-gray-900">{training.formatted_price}</div>
            </div>
          </div>

          {/* Titre */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{training.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{training.short_description}</p>

          {/* Détails spécifiques */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{training.city.name}</span>
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

          {/* Stats */}
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

          {/* Formateur */}
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

          {/* Action */}
          <button 
            disabled={training.is_full}
            className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              training.is_full
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : `bg-gradient-to-r ${config.gradient} text-white shadow hover:shadow-lg transform hover:scale-105`
            }`}
          >
            {training.is_full ? 'Formation complète' : 'S\'inscrire maintenant'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Barre de comparaison */}
      {comparison.length > 0 && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3">
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
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl transform -skew-y-1"></div>
          <div className="relative py-16 px-8">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Catalogue de Formations
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Découvrez nos formations d'excellence, en ligne et en présentiel, pour développer vos compétences professionnelles
            </p>
            
            {/* Statistiques */}
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>+15,000 étudiants</span>
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

        {/* Sélecteur de mode */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-xl border border-white/20">
            <div className="flex">
              <button
                onClick={() => setActiveMode('online')}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeMode === 'online'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Wifi className="h-5 w-5" />
                Formations en ligne
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {onlineCourses.length}
                </span>
              </button>
              <button
                onClick={() => setActiveMode('in-person')}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeMode === 'in-person'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Building className="h-5 w-5" />
                Formations en présentiel
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {inPersonTrainings.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-8 sticky top-0 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 md:p-6 z-30">
          {/* Version Mobile */}
          <div className="block lg:hidden">
            {/* Recherche */}
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

            {/* Boutons mobile */}
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
                <option value="price-low">Prix ↑</option>
                <option value="price-high">Prix ↓</option>
                <option value="newest">Récentes</option>
              </select>
            </div>

            {/* Panel filtres mobile */}
            {showMobileFilters && (
              <div className="mt-4 p-4 bg-white/90 rounded-xl border border-gray-200 space-y-4">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Toutes les catégories</option>
                  {Object.keys(categoryConfig).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {activeMode === 'online' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <select 
                        value={selectedLevel} 
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Tous niveaux</option>
                        <option value="Débutant">Débutant</option>
                        <option value="Intermédiaire">Intermédiaire</option>
                        <option value="Avancé">Avancé</option>
                      </select>

                      <select 
                        value={selectedType} 
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Tous types</option>
                        <option value="Formation">Formation</option>
                        <option value="Certification">Certification</option>
                        <option value="Spécialisation">Spécialisation</option>
                      </select>
                    </div>
                  </>
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

          {/* Version Desktop */}
          <div className="hidden lg:block">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Barre de recherche */}
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

              {/* Filtres rapides */}
              <div className="flex flex-wrap gap-2">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white/70 hover:bg-white transition-all focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Toutes les catégories</option>
                  {Object.keys(categoryConfig).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {activeMode === 'online' && (
                  <>
                    <select 
                      value={selectedLevel} 
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg bg-white/70 hover:bg-white transition-all focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Tous niveaux</option>
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                    </select>

                    <select 
                      value={selectedType} 
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg bg-white/70 hover:bg-white transition-all focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Tous types</option>
                      <option value="Formation">Formation</option>
                      <option value="Certification">Certification</option>
                      <option value="Spécialisation">Spécialisation</option>
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

              {/* Toggle filtres avancés */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Filter className="h-4 w-4" />
                Filtres avancés
              </button>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {filteredTrainings.length} formation{filteredTrainings.length > 1 ? 's' : ''} trouvée{filteredTrainings.length > 1 ? 's' : ''}
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

        {/* Résultats */}
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
              {filteredTrainings.length} formation{filteredTrainings.length > 1 ? 's' : ''} disponible{filteredTrainings.length > 1 ? 's' : ''}
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

        {/* Grille de formations */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Chargement des formations...</p>
            </div>
          </div>
        ) : filteredTrainings.length > 0 ? (
          <div className={`grid gap-6 md:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredTrainings.map((training) => (
              activeMode === 'online' ? (
                <OnlineTrainingCard key={training.id} course={training as OnlineCourse} />
              ) : (
                <InPersonTrainingCard key={training.id} training={training as InPersonTraining} />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
              <div className="text-6xl mb-6">
                {activeMode === 'online' ? '💻' : '🏢'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucune formation trouvée</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {searchTerm || selectedCategory 
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

        {/* Section avantages selon le mode */}
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
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Flexibilité totale</h3>
                  <p className="text-gray-600">Apprenez à votre rythme, où vous voulez, quand vous voulez</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Tarifs avantageux</h3>
                  <p className="text-gray-600">Formations de qualité à des prix accessibles</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
                  <div className="text-4xl mb-4">🚀</div>
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
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Pratique intensive</h3>
                  <p className="text-gray-600">Mises en situation réelles avec feedback immédiat</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
                  <div className="text-4xl mb-4">🌍</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Réseau professionnel</h3>
                  <p className="text-gray-600">Construisez votre réseau avec d'autres professionnels</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section CTA */}
        <div className="mt-20 relative overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-12 text-center text-white relative">
            {/* Motifs décoratifs */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
              <div className="absolute top-20 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-1/3 w-28 h-28 bg-white rounded-full translate-y-14"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">Prêt à booster votre carrière ?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Rejoignez des milliers de professionnels qui ont transformé leur parcours avec nos formations d'excellence
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                  Découvrir toutes les formations
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-purple-600 transition-all transform hover:scale-105">
                  Parler à un conseiller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default  UnifiedTrainingCatalog;