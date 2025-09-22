import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, Star, Clock, Users, Play, BookOpen, Award, TrendingUp, Code, Palette, Database,
   Shield, Globe, Briefcase, BarChart, Languages, Calculator, Heart, Wrench, Truck, Leaf,
   ChevronDown, PlusCircle, Eye } from 'lucide-react';

const DynamicCourseCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);

  // Animation d'entrée progressive
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => prev + 1);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  const courses = [
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
      completionRate: 94,
      certificates: 2340,
      videoHours: 45,
      exercises: 120,
      projects: 8
    },
   
    
    
   
    
  ];

 const categoryConfig = {
  "Développement": { 
    icon: Code, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Développement").length
  },
  "IA & Data": { 
    icon: Database, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "IA & Data").length
  },
  "Design": { 
    icon: Palette, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Design").length
  },
  "Sécurité": { 
    icon: Shield, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Sécurité").length
  },
  "Marketing": { 
    icon: TrendingUp, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Marketing").length
  },
  "Blockchain": { 
    icon: Globe, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Blockchain").length
  },
  "Ressources Humaines": { 
    icon: Users, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Ressources Humaines").length
  },
  "Management & Leadership": { 
    icon: Briefcase, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Management & Leadership").length
  },
  "Commerce & Vente": { 
    icon: BarChart, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Commerce & Vente").length
  },
  "Langues & Communication": { 
    icon: Languages, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Langues & Communication").length
  },
  "Développement Personnel": { 
    icon: BookOpen, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Développement Personnel").length
  },
  "Finance & Audit": { 
    icon: Calculator, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Finance & Audit").length
  },
  "Santé & Sécurité au travail": { 
    icon: Heart, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Santé & Sécurité au travail").length
  },
  "Industrie & Maintenance": { 
    icon: Wrench, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Industrie & Maintenance").length
  },
  "Logistique & Supply Chain": { 
    icon: Truck, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Logistique & Supply Chain").length
  },
  "Énergies & Environnement": { 
    icon: Leaf, 
    color: "text-black", 
    bgColor: "bg-white", 
    count: courses.filter(c => c.category === "Énergies & Environnement").length
  }
};

  const filteredCourses = useMemo(() => {
    const filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || course.category === selectedCategory;
      const matchesLevel = !selectedLevel || course.level === selectedLevel;
      const matchesType = !selectedType || course.type === selectedType;
      const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];
      
      let matchesDuration = true;
      if (selectedDuration) {
        const duration = parseInt(course.duration);
        if (selectedDuration === "0-25h") matchesDuration = duration <= 25;
        else if (selectedDuration === "25-50h") matchesDuration = duration > 25 && duration <= 50;
        else if (selectedDuration === "50h+") matchesDuration = duration > 50;
      }
      
      return matchesSearch && matchesCategory && matchesLevel && matchesType && matchesDuration && matchesPrice;
    });

    switch(sortBy) {
      case 'popular': return filtered.sort((a, b) => b.students - a.students);
      case 'rating': return filtered.sort((a, b) => b.rating - a.rating);
      case 'price-low': return filtered.sort((a, b) => a.price - b.price);
      case 'price-high': return filtered.sort((a, b) => b.price - a.price);
      case 'newest': return filtered.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
      default: return filtered;
    }
  }, [searchTerm, selectedCategory, selectedLevel, selectedType, selectedDuration, priceRange, sortBy]);

  const toggleFavorite = (courseId: number) => {
    setFavorites(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
    setSelectedType('');
    setSelectedDuration('');
    setPriceRange([0, 150000]);
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('fr-FR') + ' F';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      {/* Hero Section Dynamique */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 animate-fade-in">
              Transformez Votre
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Avenir Professionnel
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 animate-slide-up">
              Découvrez nos formations d'excellence conçues par des experts pour vous propulser vers le succès
            </p>
            
            {/* Stats animées */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {[ 
                { number: "15K+", label: "Étudiants actifs", icon: Users },
                { number: "50+", label: "Formations expert", icon: BookOpen },
                { number: "98%", label: "Taux de satisfaction", icon: Star },
                { number: "24/7", label: "Support premium", icon: Award }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center transform transition-all duration-700 ${
                    animationStep > index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <stat.icon className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Barre de recherche et filtres avancés */}
        <div className="mb-12 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 sticky top-4 z-40">
          <div className="space-y-6">
            {/* Recherche principale */}
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, compétence, technologie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-12 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white/90"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filtres rapides */}
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Filter className="h-4 w-4" />
                Filtres avancés
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-50/80 rounded-2xl">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Niveau</label>
                  <select 
                    value={selectedLevel} 
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Tous niveaux</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Tous types</option>
                    <option value="Formation">Formation</option>
                    <option value="Certification">Certification</option>
                    <option value="Spécialisation">Spécialisation</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Durée</label>
                  <select 
                    value={selectedDuration} 
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Toutes durées</option>
                    <option value="0-25h">0-25 heures</option>
                    <option value="25-50h">25-50 heures</option>
                    <option value="50h+">50+ heures</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tri par</label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="popular">Plus populaires</option>
                    <option value="rating">Mieux notées</option>
                    <option value="price-low">Prix croissant</option>
                    <option value="price-high">Prix décroissant</option>
                    <option value="newest">Plus récentes</option>
                  </select>
                </div>
                
                <div className="md:col-span-4 flex justify-between items-center pt-4">
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Effacer les filtres
                  </button>
                  <div className="text-sm text-gray-600">
                    {filteredCourses.length} formation{filteredCourses.length > 1 ? 's' : ''} trouvée{filteredCourses.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contenu principal avec sidebar et grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar des catégories */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-32">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Filter className="h-5 w-5 text-purple-600" />
                Catégories
              </h3>
              
              <div className="space-y-2">
                {Object.entries(categoryConfig).map(([category, config]) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      selectedCategory === category
                        ? `bg-gradient-to-r ${config.color} text-white shadow-md`
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <config.icon className="h-5 w-5" />
                      <span className="font-medium">{category}</span>
                    </div>
                    <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                      {config.count}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Filtres avancés</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix</label>
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max="150000"
                        step="5000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                    <div className="space-y-2">
                      {['Débutant', 'Intermédiaire', 'Avancé'].map(level => (
                        <button
                          key={level}
                          onClick={() => setSelectedLevel(selectedLevel === level ? '' : level)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                            selectedLevel === level
                              ? 'bg-purple-100 text-purple-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <div className="space-y-2">
                      {['Formation', 'Certification', 'Spécialisation'].map(type => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(selectedType === type ? '' : type)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                            selectedType === type
                              ? 'bg-purple-100 text-purple-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Grid des formations */}
          <div className="lg:w-3/4">
            {/* Résultats et options d'affichage */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="text-gray-600 mb-4 sm:mb-0">
                {filteredCourses.length} résultat{filteredCourses.length > 1 ? 's' : ''} trouvé{filteredCourses.length > 1 ? 's' : ''}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-gray-600">Trier par :</label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="popular">Plus populaires</option>
                    <option value="rating">Mieux notées</option>
                    <option value="price-low">Prix croissant</option>
                    <option value="price-high">Prix décroissant</option>
                    <option value="newest">Plus récentes</option>
                  </select>
                </div>
                
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              const categoryConfig_item = categoryConfig[course.category as keyof typeof categoryConfig];
              const isHovered = hoveredCourse === course.id;
              const isFavorite = favorites.includes(course.id);
              
              return (
                <div
                  key={course.id}
                  className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden`}
                  style={{ animationDelay: `0ms` }}
                  onMouseEnter={() => setHoveredCourse(course.id)}
                  onMouseLeave={() => setHoveredCourse(null)}
                >
                      {/* Badge de tendance/nouveau */}
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

                      {/* Bouton favori */}
                      <button
                        onClick={() => toggleFavorite(course.id)}
                        className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow hover:scale-110 transition-all"
                      >
                        <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                      </button>

                      {/* Image avec overlay dynamique */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${categoryConfig_item.color} opacity-0 group-hover:opacity-80 transition-opacity duration-300`}></div>
                        
                        {/* Overlay avec informations */}
                        <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform ${isHovered ? 'scale-100' : 'scale-90'}`}>
                          <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold shadow hover:shadow-md transition-all transform hover:scale-105 flex items-center gap-2 text-sm">
                            <Play className="h-4 w-4" />
                            Aperçu
                          </button>
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="p-5">
                        {/* Header avec catégorie et prix */}
                        <div className="flex items-start justify-between mb-3">
                          <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${categoryConfig_item.bgColor}`}>
                            <categoryConfig_item.icon className="h-3 w-3" />
                            <span className="font-medium">{course.category}</span>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500 line-through">{formatPrice(course.originalPrice)}</span>
                              <span className="bg-red-100 text-red-600 px-1 py-0.5 rounded-full text-xs font-bold">
                                -{course.discount}%
                              </span>
                            </div>
                            <div className="text-lg font-bold text-gray-900">{formatPrice(course.price)}</div>
                          </div>
                        </div>

                        {/* Titre et description */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-between mb-3 text-xs">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="font-medium text-gray-900">{course.rating}</span>
                            <span className="text-gray-500">({course.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Users className="h-3 w-3" />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{course.duration}</span>
                          </div>
                        </div>

                        {/* Compétences */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {course.skills.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {skill}
                              </span>
                            ))}
                            {course.skills.length > 3 && (
                              <span className="text-gray-400 text-xs px-1 py-0.5">
                                +{course.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="space-y-2">
                          <button className={`w-full py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 bg-gradient-to-r ${categoryConfig_item.color} text-white shadow hover:shadow-md text-sm`}>
                            <span className="flex items-center justify-center gap-1">
                              <PlusCircle className="h-4 w-4" />
                              Commencer
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course, index) => {
                  const categoryConfig_item = categoryConfig[course.category];
                  const isFavorite = favorites.includes(course.id);
                  
                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 relative">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            {course.trending && (
                              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                <TrendingUp className="h-3 w-3" />
                                Tendance
                              </div>
                            )}
                            {course.new && (
                              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                Nouveau
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => toggleFavorite(course.id)}
                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow hover:scale-110 transition-all"
                          >
                            <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                          </button>
                        </div>
                        
                        <div className="md:w-2/3 p-6">
                          <div className="flex justify-between items-start mb-3">
                            <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${categoryConfig_item.bgColor}`}>
                              <categoryConfig_item.icon className="h-3 w-3" />
                              <span className="font-medium">{course.category}</span>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500 line-through">{formatPrice(course.originalPrice)}</span>
                                <span className="bg-red-100 text-red-600 px-1 py-0.5 rounded-full text-xs font-bold">
                                  -{course.discount}%
                                </span>
                              </div>
                              <div className="text-xl font-bold text-gray-900">{formatPrice(course.price)}</div>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                          <p className="text-gray-600 mb-4">{course.description}</p>
                          
                          <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="font-medium text-gray-900">{course.rating}</span>
                              <span className="text-gray-500">({course.reviews} avis)</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Users className="h-4 w-4" />
                              <span>{course.students.toLocaleString()} étudiants</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration} de formation</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.modules} modules</span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {course.skills.map((skill, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button className={`flex-1 py-3 rounded-xl font-medium transition-all bg-gradient-to-r ${categoryConfig_item.color} text-white shadow hover:shadow-md flex items-center justify-center gap-2`}>
                              <Play className="h-5 w-5" />
                              Commencer la formation
                            </button>
                            <button className="px-4 py-3 rounded-xl font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                              <Eye className="h-5 w-5" />
                              Aperçu
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {filteredCourses.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun résultat trouvé</h3>
                  <p className="text-gray-600 mb-6">Essayez d'ajuster vos filtres ou votre recherche pour trouver ce que vous cherchez.</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-medium"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Section CTA */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à transformer votre carrière ?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Rejoignez des milliers d'étudiants qui ont déjà accéléré leur parcours professionnel avec nos formations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-white text-purple-900 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Trouver ma formation
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all transform hover:scale-105">
              Parler à un conseiller
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Formations</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Toutes les formations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nouveautés</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Formations populaires</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Certifications</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Entreprise</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Formation en entreprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Solutions pour équipes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Devenir formateur</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Ressources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Support technique</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nous contacter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
                <li className="flex items-center gap-2">
                  <span>Suivez-nous :</span>
                  <div className="flex gap-2">
                    <a href="#" className="hover:text-white transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                    <a href="#" className="hover:text-white transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a href="#" className="hover:text-white transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                © 2023 Dynamic Learning. Tous droits réservés.
              </div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
                <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
                <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DynamicCourseCatalog;