import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Star, Clock, Users } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Catalog = () => {
  const { dispatch } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const courses = [
    {
      id: 1,
      title: "Développement Web Full Stack",
      category: "Développement",
      level: "Débutant",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80",
      description: "Maîtrisez HTML, CSS, JavaScript et Node.js pour devenir développeur full stack",
      duration: "30h",
      students: "1.2k",
      rating: 4.8
    },
    {
      id: 2,
      title: "Marketing Digital Avancé",
      category: "Marketing",
      level: "Avancé",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2015&q=80",
      description: "Stratégies avancées de marketing digital et analyse de données",
      duration: "25h",
      students: "850",
      rating: 4.7
    },
    {
      id: 3,
      title: "Gestion de Projet Agile",
      category: "Management",
      level: "Intermédiaire",
      price: 64.99,
      image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
      description: "Maîtrisez les méthodologies Agile (Scrum, Kanban) et outils modernes",
      duration: "20h",
      students: "1.5k",
      rating: 4.9
    },
    {
      id: 4,
      title: "Data Science Fondamentaux",
      category: "Data Science",
      level: "Intermédiaire",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      description: "Introduction à Python, Pandas et l'analyse de données",
      duration: "35h",
      students: "2.3k",
      rating: 4.6
    },
    {
      id: 5,
      title: "UI/UX Design Moderne",
      category: "Design",
      level: "Débutant",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      description: "Créez des interfaces utilisateur intuitives avec Figma et Adobe XD",
      duration: "28h",
      students: "980",
      rating: 4.8
    },
    {
      id: 6,
      title: "Intelligence Artificielle",
      category: "AI",
      level: "Avancé",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2076&q=80",
      description: "Découvrez le machine learning et les réseaux de neurones",
      duration: "40h",
      students: "1.7k",
      rating: 4.5
    }
  ];

  const categories = [...new Set(courses.map(course => course.category))];
  const levels = [...new Set(courses.map(course => course.level))];

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || course.category === selectedCategory;
      const matchesLevel = !selectedLevel || course.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchTerm, selectedCategory, selectedLevel]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explorez Notre Catalogue</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Plus de 200 formations expertes pour booster votre carrière dans les domaines tech, business et design
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-0 bg-white py-4 z-10">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Rechercher une formation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:border-primary transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filtres</span>
          </button>
          
          {(selectedCategory || selectedLevel) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedLevel('');
              }}
              className="flex items-center gap-2 px-6 py-3 text-primary hover:bg-gray-50 rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {isFilterOpen && (
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Catégorie
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      category === selectedCategory 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Niveau
              </label>
              <div className="flex flex-wrap gap-2">
                {levels.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level === selectedLevel ? '' : level)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      level === selectedLevel 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div 
            key={course.id} 
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
          >
            <div className="relative overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
                {course.price}€
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.category === 'Développement' ? 'bg-purple-100 text-purple-800' :
                  course.category === 'Marketing' ? 'bg-blue-100 text-blue-800' :
                  course.category === 'Management' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  {course.level}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4 flex-1">{course.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{course.rating} ({course.students})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{course.duration}</span>
                </div>
              </div>
              
              <button
                onClick={() => dispatch({ type: 'ADD_ITEM', payload: course })}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span>Ajouter au panier</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;