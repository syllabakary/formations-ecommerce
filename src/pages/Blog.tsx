import React, { useState, useMemo } from 'react';
import { Search, Calendar, Clock, ArrowRight, Heart, MessageCircle, Eye, Bookmark } from 'lucide-react';

const ModernBlog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState('recent');
  const [likedArticles, setLikedArticles] = useState(new Set<number>());
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set<number>());

  const articles = [
    {
      id: 1,
      title: "Comment créer un CV moderne en 2025",
      excerpt: "Un guide étape par étape pour créer un CV qui attire les recruteurs...",
      date: "2025-05-10",
      views: 1250,
      likes: 94,
      category: "Carrière",
      tags: ["CV", "Emploi", "Conseils"],
      difficulty: "Débutant",
      featured: true,
      author: "Fatou Traoré"
    },
    {
      id: 2,
      title: "Maîtriser Excel en 7 jours",
      excerpt: "Les fonctions indispensables, les astuces de pro et les tableaux dynamiques...",
      date: "2025-05-01",
      views: 2080,
      likes: 138,
      category: "Bureautique",
      tags: ["Excel", "Formation", "Office"],
      difficulty: "Intermédiaire",
      featured: false,
      author: "Jean Kouassi"
    },
    {
      id: 3,
      title: "Développer son premier site avec React",
      excerpt: "Les bases de React expliquées simplement, même pour les débutants...",
      date: "2025-04-20",
      views: 980,
      likes: 76,
      category: "Développement",
      tags: ["React", "Web", "JS"],
      difficulty: "Débutant",
      featured: false,
      author: "Aminata Diop"
    },
    {
      id: 4,
      title: "Design UX/UI pour les formateurs",
      excerpt: "Un article pour comprendre comment rendre vos contenus plus attractifs...",
      date: "2025-04-05",
      views: 1120,
      likes: 63,
      category: "Design",
      tags: ["UX", "UI", "Formation"],
      difficulty: "Avancé",
      featured: false,
      author: "Koffi Mensah"
    }
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('fr-FR') + ' F CFA';
  };

  const categories = ['Tous', ...new Set(articles.map(article => article.category))];

  const filteredAndSortedArticles = useMemo(() => {
    const filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'Tous' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'liked':
          return b.likes - a.likes;
        case 'recent':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const toggleLike = (articleId: number): void => {
    setLikedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const toggleBookmark = (articleId: number): void => {
    setBookmarkedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Débutant':
        return 'bg-green-100 text-green-800';
      case 'Intermédiaire':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avancé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center border rounded px-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              className="outline-none p-2 w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <select onChange={e => setSortBy(e.target.value)} className="border rounded p-2">
            <option value="recent">Plus récents</option>
            <option value="popular">Populaires</option>
            <option value="liked">Les plus likés</option>
          </select>

          <select onChange={e => setSelectedCategory(e.target.value)} className="border rounded p-2">
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Articles récents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedArticles.map(article => (
            <div key={article.id} className="bg-white rounded-lg shadow p-5 relative">
              <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${getDifficultyColor(article.difficulty)}`}>
                {article.difficulty}
              </span>
              <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
              <div className="flex items-center text-xs text-gray-500 space-x-2">
                <Calendar size={14} /> <span>{formatDate(article.date)}</span>
                <Eye size={14} /> <span>{article.views}</span>
              </div>
              <div className="mt-4 flex justify-between">
                <button onClick={() => toggleLike(article.id)} className="flex items-center space-x-1 text-pink-600">
                  <Heart size={16} fill={likedArticles.has(article.id) ? "currentColor" : "none"} />
                  <span>{article.likes}</span>
                </button>
                <button onClick={() => toggleBookmark(article.id)} className="text-yellow-600">
                  <Bookmark size={16} fill={bookmarkedArticles.has(article.id) ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernBlog;
