
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, Star, Clock, Users, Play, BookOpen, Award, TrendingUp, Code, Palette, Database, Shield, ArrowRight, Heart, Share2, ChevronDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

type CategoryConfig = {
  [key: string]: {
    icon: LucideIcon;
    color: string;
    gradient: string;
  }
};

const ModernCatalog = () => {
  const navigate = useNavigate();
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

  // Données enrichies avec plus de diversité
  const courses = [
    {
      id: 1,
      title: "Développement Web Full Stack",
      category: "Développement",
      level: "Débutant",
      type: "Certification",
      price: 29750,
      originalPrice: 47650,
      image: "/api/placeholder/400/250",
      description: "Maîtrisez HTML, CSS, JavaScript et Node.js pour devenir développeur full stack",
      duration: "30h",
      students: 1250,
      rating: 4.8,
      reviews: 342,
      instructor: "Sophie Martin",
      modules: 12,
      skills: ["HTML/CSS", "JavaScript", "Node.js", "React"],
      trending: true,
      bestseller: false,
      progress: 0,
      difficulty: "Facile"
    },
    {
      id: 2,
      title: "Gestion RH Stratégique",
      category: "Ressources Humaines",
      level: "Avancé",
      type: "Formation",
      price: 53650,
      originalPrice: 77550,
      image: "/api/placeholder/400/250",
      description: "Développez vos compétences en gestion des talents et stratégie RH",
      duration: "25h",
      students: 890,
      rating: 4.9,
      reviews: 156,
      instructor: "Jean Dupont",
      modules: 8,
      skills: ["Recrutement", "Formation", "GPEC", "Droit social"],
      trending: false,
      bestseller: true,
      progress: 0,
      difficulty: "Difficile"
    },
    {
      id: 3,
      title: "Audit et Contrôle Interne",
      category: "Audit",
      level: "Intermédiaire",
      type: "Certification",
      price: 56650,
      originalPrice: 89550,
      image: "",
      description: "Maîtrisez les techniques d'audit et les processus de contrôle interne",
      duration: "35h",
      students: 567,
      rating: 4.7,
      reviews: 89,
      instructor: "Marie Leroy",
      modules: 10,
      skills: ["Audit financier", "Contrôle interne", "Risques", "Conformité"],
      trending: false,
      bestseller: false,
      progress: 0,
      difficulty: "Modéré"
    },
    {
      id: 4,
      title: "Data Science & IA",
      category: "Data Science",
      level: "Avancé",
      type: "Spécialisation",
      price: 77550,
      originalPrice: 119400,
      image: "",
      description: "Python, Machine Learning, Deep Learning et analyse prédictive",
      duration: "50h",
      students: 2340,
      rating: 4.8,
      reviews: 456,
      instructor: "Alex Chen",
      modules: 15,
      skills: ["Python", "Machine Learning", "TensorFlow", "Pandas"],
      trending: true,
      bestseller: true,
      progress: 0,
      difficulty: "Difficile"
    },
    {
      id: 5,
      title: "Design UX/UI Moderne",
      category: "Design",
      level: "Débutant",
      type: "Formation",
      price: 41750,
      originalPrice: 59700,
      image: "/api/placeholder/400/250",
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
      difficulty: "Facile"
    },
    {
      id: 6,
      title: "Évaluation et Rémunération",
      category: "Ressources Humaines",
      level: "Intermédiaire",
      type: "Formation",
      price: 44750,
      originalPrice: 65650,
      image: "/api/placeholder/400/250",
      description: "Politiques de rémunération, évaluation des postes et performance",
      duration: "22h",
      students: 678,
      rating: 4.6,
      reviews: 134,
      instructor: "Pierre Moreau",
      modules: 7,
      skills: ["Évaluation postes", "Grilles salariales", "Variable", "Équité"],
      trending: false,
      bestseller: false,
      progress: 0,
      difficulty: "Modéré"
    },
    {
      id: 7,
      title: "Cybersécurité Entreprise",
      category: "Sécurité",
      level: "Avancé",
      type: "Certification",
      price: 71550,
      originalPrice: 107400,
      image: "/api/placeholder/400/250",
      description: "Protégez votre organisation contre les cybermenaces actuelles",
      duration: "40h",
      students: 834,
      rating: 4.8,
      reviews: 198,
      instructor: "Thomas Garcia",
      modules: 12,
      skills: ["Sécurité réseau", "Pentest", "ISO 27001", "RGPD"],
      trending: true,
      bestseller: false,
      progress: 0,
      difficulty: "Difficile"
    },
    {
      id: 8,
      title: "Business Intelligence",
      category: "Data Science",
      level: "Intermédiaire",
      type: "Spécialisation",
      price: 50700,
      originalPrice: 74550,
      image: "/api/placeholder/400/250",
      description: "Tableau, Power BI et analyse de données pour la prise de décision",
      duration: "32h",
      students: 1123,
      rating: 4.7,
      reviews: 267,
      instructor: "Laura Kim",
      modules: 11,
      skills: ["Tableau", "Power BI", "SQL", "Data Visualization"],
      trending: false,
      bestseller: true,
      progress: 0,
      difficulty: "Modéré"
    }
  ];

  // Configuration des catégories avec les nouvelles couleurs personnalisées
const categoryConfig: CategoryConfig = {
  "Développement": { icon: Code, color: "purple", gradient: "from-purple-500 via-[#A553C4] to-[#6636DD]" },
  "Ressources Humaines": { icon: Users, color: "blue", gradient: "from-[#6636DD] via-[#A553C4] to-purple-600" },
  "Audit": { icon: Shield, color: "green", gradient: "from-[#22c55e] via-green-500 to-emerald-600" },
  "Data Science": { icon: Database, color: "primary", gradient: "from-[#A553C4] via-purple-500 to-[#6636DD]" },
  "Design": { icon: Palette, color: "secondary", gradient: "from-[#6636DD] via-indigo-600 to-purple-700" },
  "Sécurité": { icon: Shield, color: "warning", gradient: "from-[#2D1397] via-indigo-800 to-purple-900" }
};

  const levels = ["Débutant", "Intermédiaire", "Avancé"];
  const durations = ["0-20h", "20-40h", "40h+"];
  const types = ["Formation", "Certification", "Spécialisation"];

  // Filtrage et tri CORRIGÉ
  const filteredAndSortedCourses = useMemo(() => {
    const filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || course.category === selectedCategory;
      const matchesLevel = !selectedLevel || course.level === selectedLevel;
      const matchesType = !selectedType || course.type === selectedType;
      
      // Correction du filtre de durée
      let matchesDuration = true;
      if (selectedDuration) {
        const courseDuration = parseInt(course.duration);
        if (selectedDuration === "0-20h") {
          matchesDuration = courseDuration <= 20;
        } else if (selectedDuration === "20-40h") {
          matchesDuration = courseDuration > 20 && courseDuration <= 40;
        } else if (selectedDuration === "40h+") {
          matchesDuration = courseDuration > 40;
        }
      }
      
      return matchesSearch && matchesCategory && matchesLevel && matchesType && matchesDuration;
    });

    // Tri
    switch(sortBy) {
      case 'popular': return filtered.sort((a, b) => b.students - a.students);
      case 'rating': return filtered.sort((a, b) => b.rating - a.rating);
      case 'price-low': return filtered.sort((a, b) => a.price - b.price);
      case 'price-high': return filtered.sort((a, b) => b.price - a.price);
      case 'newest': return filtered.sort((a, b) => b.id - a.id);
      default: return filtered;
    }
  }, [searchTerm, selectedCategory, selectedLevel, selectedType, selectedDuration, sortBy]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
    setSelectedType('');
    setSelectedDuration('');
  };

  const toggleFavorite = (courseId: number) => {
    setFavorites(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedLevel || selectedType || selectedDuration;

  const getCategoryIcon = (category: string) => {
    const config = categoryConfig[category];
    if (!config) return BookOpen;
    return config.icon;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Facile': return 'text-green-600 bg-green-100';
      case 'Modéré': return 'text-yellow-600 bg-yellow-100';
      case 'Difficile': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#67B0FFFF]/10 to-[#709BFEFF]/10 rounded-3xl transform -skew-y-1"></div>
          <div className="relative py-16 px-8">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-[#9773F5FF] to-[#A553C4] bg-clip-text text-transparent mb-6">
              Développez Vos Compétences
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Formations expertes en RH, Tech, Audit et Data Science pour propulser votre carrière vers de nouveaux sommets
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-[#6636DD]" />
                <span>+5,000 étudiants</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-[#22c55e]" />
                <span>Certifications reconnues</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#A553C4]" />
                <span>Contenus mis à jour</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters - Version Mobile améliorée */}
        <div className="mb-8 sticky top-0 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 md:p-6 z-20">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            {/* Search Bar Mobile */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A553C4] focus:border-transparent transition-all bg-white/70"
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

            {/* Mobile Filter Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white rounded-xl hover:from-[#9643B4] hover:to-[#5526CD] transition-all"
              >
                <Filter className="h-4 w-4" />
                Filtres
                <ChevronDown className={`h-4 w-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
              </button>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white/70 focus:ring-2 focus:ring-[#A553C4] flex-shrink-0"
              >
                <option value="popular">Populaires</option>
                <option value="rating">Mieux notées</option>
                <option value="price-low">Prix ↑</option>
                <option value="price-high">Prix ↓</option>
                <option value="newest">Récentes</option>
              </select>
            </div>

            {/* Mobile Filters Panel */}
            {showMobileFilters && (
              <div className="mt-4 p-4 bg-white/90 rounded-xl border border-gray-200 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#A553C4]"
                  >
                    <option value="">Tous les domaines</option>
                    {Object.keys(categoryConfig).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={selectedLevel} 
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#A553C4]"
                    >
                      <option value="">Tous niveaux</option>
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>

                    <select 
                      value={selectedType} 
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#A553C4]"
                    >
                      <option value="">Tous types</option>
                      {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <select 
                    value={selectedDuration} 
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#A553C4]"
                  >
                    <option value="">Toutes durées</option>
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>

                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="w-full px-4 py-2 text-[#2D1397] border border-[#2D1397]/30 rounded-lg hover:bg-[#2D1397]/10 transition-all"
                    >
                      Effacer tous les filtres
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, compétence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A553C4] focus:border-transparent transition-all bg-white/70"
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

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white/70 hover:bg-white transition-all focus:ring-2 focus:ring-[#A553C4]"
                >
                  <option value="">Tous les domaines</option>
                  {Object.keys(categoryConfig).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select 
                  value={selectedLevel} 
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white/70 hover:bg-white transition-all focus:ring-2 focus:ring-[#A553C4]"
                >
                  <option value="">Tous niveaux</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>

                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white/70 hover:bg-white transition-all focus:ring-2 focus:ring-[#A553C4]"
                >
                  <option value="popular">Plus populaires</option>
                  <option value="rating">Mieux notées</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="newest">Plus récentes</option>
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white rounded-lg hover:from-[#9643B4] hover:to-[#5526CD] transition-all transform hover:scale-105"
              >
                <Filter className="h-4 w-4" />
                Filtres
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de formation</label>
                  <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-[#A553C4]"
                  >
                    <option value="">Tous types</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
                  <select 
                    value={selectedDuration} 
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-[#A553C4]"
                  >
                    <option value="">Toutes durées</option>
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="w-full px-4 py-2 text-[#2D1397] border border-[#2D1397]/30 rounded-lg hover:bg-[#2D1397]/10 transition-all"
                    >
                      Effacer tous les filtres
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {filteredAndSortedCourses.length} formation{filteredAndSortedCourses.length > 1 ? 's' : ''} trouvée{filteredAndSortedCourses.length > 1 ? 's' : ''}
            </h2>
            {hasActiveFilters && (
              <p className="text-gray-600 mt-1 text-sm md:text-base">Résultats filtrés selon vos critères</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all hover:border-[#A553C4]"
            >
              {viewMode === 'grid' ? '☰' : '⊞'}
            </button>
          </div>
        </div>

        {/* Course Grid */}
        {filteredAndSortedCourses.length > 0 ? (
          <div className={`grid gap-6 md:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredAndSortedCourses.map((course) => {
              const CategoryIcon = getCategoryIcon(course.category);
              const config = categoryConfig[course.category] || { gradient: "from-gray-500 to-gray-600" };
              const isFavorite = favorites.includes(course.id);
              
              return (
                <div 
                  key={course.id} 
                  className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-100 overflow-hidden"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A553C4] to-[#6636DD] rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#6636DD] to-[#A553C4] rounded-full translate-y-12 -translate-x-12"></div>
                  </div>

                  {/* Content */}
                  <div className="relative p-6 md:p-8">
                    {/* Header avec icône catégorie */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
                        <CategoryIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl md:text-2xl text-gray-900">{course.price.toLocaleString('fr-FR')} F</div>
                        {course.originalPrice > course.price && (
                          <div className="text-sm text-gray-500 line-through">{course.originalPrice.toLocaleString('fr-FR')} F</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Title & Category */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{course.category}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {course.title}
                      </h3>
                    </div>
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    
                    {/* Stats Row */}
                    <div className="flex items-center justify-between mb-6 text-sm">
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
                    
                    {/* Skills */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {course.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                        {course.skills.length > 3 && (
                          <span className="text-gray-400 text-xs py-1 px-2">
                            +{course.skills.length - 3} autres
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Instructor */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm">
                        <span className="text-gray-500">Formateur : </span>
                        <span className="font-medium text-gray-900">{course.instructor}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.modules} modules</span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <button 
                      onClick={() => navigate('/paiement')}
                      className={`group w-full py-4 rounded-2xl font-semibold transition-all duration-300 bg-gradient-to-r ${config.gradient} text-white hover:shadow-2xl hover:scale-105 transform relative overflow-hidden`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Commencer maintenant
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </button>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucune formation trouvée</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Essayez de modifier vos critères de recherche ou explorez nos catégories populaires.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-8 py-4 bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white rounded-2xl hover:shadow-lg transition-all transform hover:scale-105"
              >
                Voir toutes les formations
              </button>
            </div>
          </div>
        )}

        {/* Popular Categories Section */}
        <div className="mt-20 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Explorez nos domaines d'expertise</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Object.entries(categoryConfig).map(([category, config]) => {
              const IconComponent = config.icon;
              const categoryCount = courses.filter(course => course.category === category).length;
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`group p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    selectedCategory === category 
                      ? `bg-gradient-to-br ${config.gradient} text-white shadow-lg` 
                      : 'bg-white hover:bg-gray-50 text-gray-700 shadow-md border border-gray-100'
                  }`}
                >
                  <div className={`mx-auto mb-4 p-3 rounded-full ${
                    selectedCategory === category 
                      ? 'bg-white/20' 
                      : `bg-gradient-to-br ${config.gradient}`
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      selectedCategory === category ? 'text-white' : 'text-white'
                    }`} />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{category}</h3>
                  <p className={`text-xs ${
                    selectedCategory === category ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {categoryCount} formation{categoryCount > 1 ? 's' : ''}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-[#6636DD] mb-2">....+</div>
              <div className="text-gray-600">Étudiants actifs</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-[#22c55e] mb-2">....+</div>
              <div className="text-gray-600">Formations disponibles</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-[#A553C4] mb-2">....%</div>
              <div className="text-gray-600">Taux de satisfaction</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-[#2D1397] mb-2">24/7</div>
              <div className="text-gray-600">Support disponible</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 relative overflow-hidden">
          <div className="bg-gradient-to-r from-[#6636DD] via-[#A553C4] to-[#2D1397] rounded-3xl p-12 text-center text-white relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
              <div className="absolute top-20 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-1/3 w-28 h-28 bg-white rounded-full translate-y-14"></div>
              <div className="absolute bottom-10 right-20 w-24 h-24 bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">Prêt à transformer votre carrière ?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Rejoignez des milliers de professionnels qui ont choisi l'excellence et propulsé leur carrière vers de nouveaux sommets
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[#6636DD] px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                  Découvrir nos parcours
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-[#6636DD] transition-all transform hover:scale-105">
                  Parler à un conseiller
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 bg-gradient-to-br from-gray-50 to-purple-50 rounded-3xl p-12 text-center border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Restez informé des nouveautés</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Recevez nos dernières formations, conseils carrière et offres exclusives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
              S'abonner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernCatalog;