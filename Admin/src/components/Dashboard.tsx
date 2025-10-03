import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, BookOpen, DollarSign, Star, Clock, Award, BarChart3, Calendar } from 'lucide-react';

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
};

// Composant Card de statistiques
const StatsCard = ({ title, value, change, changeType, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
        changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      }`}>
        {change}
      </span>
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

// Composant Chart
const Chart = () => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
  const data = [45000, 52000, 49000, 60000, 58000, 67000];
  const maxValue = Math.max(...data);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Revenus Mensuels</h3>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option>6 derniers mois</option>
          <option>12 derniers mois</option>
        </select>
      </div>
      
      <div className="flex items-end justify-between h-64 space-x-2">
        {data.map((value, index) => {
          const height = (value / maxValue) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center justify-end space-y-2">
              <div className="w-full relative group">
                <div 
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 hover:opacity-80"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {value.toLocaleString()} FCFA
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">{months[index]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [formations, setFormations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeUsers: 0,
    newRegistrations: 0,
    totalStudents: 0,
    totalFormations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Charger toutes les formations (en ligne + présentiel)
      const [onlineRes, inPersonRes] = await Promise.all([
        fetch(`${API_CONFIG.baseURL}/v1/courses?mode=online&per_page=100`),
        fetch(`${API_CONFIG.baseURL}/v1/courses?mode=in-person&per_page=100`)
      ]);
      
      const onlineData = onlineRes.ok ? await onlineRes.json() : { data: [] };
      const inPersonData = inPersonRes.ok ? await inPersonRes.json() : { data: [] };
      
      const allFormations = [...(onlineData.data || []), ...(inPersonData.data || [])];
      
      // 2. Charger les catégories
      const categoriesRes = await fetch(`${API_CONFIG.baseURL}/v1/courses/filters/data`);
      const categoriesData = categoriesRes.ok ? await categoriesRes.json() : { data: { categories: [] } };
      
      // 3. Calculer les vraies statistiques
      console.log('=== DEBUG CALCUL STATISTIQUES ===');
      console.log('Nombre total de formations chargées:', allFormations.length);
      
      let totalRevenue = 0;
      let totalStudents = 0;
      
      allFormations.forEach(f => {
        // Essayer différents champs possibles pour les étudiants
        const students = f.total_students || f.registered_students || f.registered_seats || f.enrollments || 0;
        const price = f.price || 0;
        
        if (students > 0) {
          console.log(`✓ ${f.title}: ${students} étudiants × ${price} F = ${students * price} F`);
        }
        
        totalRevenue += (price * students);
        totalStudents += students;
      });
      
      console.log('=== RÉSULTATS ===');
      console.log('Total étudiants calculé:', totalStudents);
      console.log('Total revenus calculé:', totalRevenue, 'F CFA');
      
      const activeFormations = allFormations.filter(f => 
        f.is_active === true || f.is_active === 1 || f.status === 'active' || f.status === 'published'
      );
      
      console.log('Formations actives:', activeFormations.length);
      
      // Nouvelles inscriptions (30 derniers jours - estimation à 15% du total)
      const newRegistrations = totalStudents > 0 ? Math.max(1, Math.floor(totalStudents * 0.15)) : 0;
      
      setFormations(allFormations);
      setCategories(categoriesData.data?.categories || []);
      setStats({
        totalRevenue,
        activeUsers: totalStudents, // Nombre total d'étudiants = utilisateurs actifs
        newRegistrations,
        totalStudents,
        totalFormations: activeFormations.length
      });
      
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Revenus Total",
      value: stats.totalRevenue > 0 ? `${Math.round(stats.totalRevenue).toLocaleString()} F CFA` : '0 F CFA',
      change: "+55%",
      changeType: "positive",
      icon: DollarSign,
      color: "from-[#A553C4] to-[#6636DD]"
    },
    {
      title: "Étudiants Inscrits",
      value: stats.activeUsers > 0 ? stats.activeUsers.toLocaleString() : '0',
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "from-[#6636DD] to-[#2D139B]"
    },
    {
      title: "Nouvelles Inscriptions",
      value: stats.newRegistrations > 0 ? `+${stats.newRegistrations}` : '0',
      change: "+8%",
      changeType: "positive",
      icon: TrendingUp,
      color: "from-[#A553C4] to-[#2D139B]"
    },
    {
      title: "Formations Actives",
      value: stats.totalFormations > 0 ? stats.totalFormations.toLocaleString() : '0',
      change: "+5%",
      changeType: "positive",
      icon: BookOpen,
      color: "from-[#2D139B] to-[#6636DD]"
    }
  ];

  // Formations populaires (top 3 par nombre d'étudiants)
  const popularFormations = [...formations]
    .sort((a, b) => {
      const studentsA = a.total_students || a.registered_seats || 0;
      const studentsB = b.total_students || b.registered_seats || 0;
      return studentsB - studentsA;
    })
    .slice(0, 3);

  // Performance des catégories (vraies données)
  const categoryPerformance = categories
    .filter(cat => cat.trainings_count > 0) // Filtrer seulement les catégories avec des formations
    .map(cat => ({
      name: cat.name,
      count: cat.trainings_count
    }))
    .sort((a, b) => b.count - a.count) // Trier par nombre décroissant
    .slice(0, 5); // Top 5
  
  const totalTrainings = categoryPerformance.reduce((sum, cat) => sum + cat.count, 0);
  
  // Assigner des couleurs dynamiques
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500'];
  
  const categoryStats = categoryPerformance.map((cat, index) => ({
    name: cat.name,
    count: cat.count,
    value: totalTrainings > 0 ? Math.round((cat.count / totalTrainings) * 100) : 0,
    color: colors[index % colors.length]
  }));

  console.log('Catégories avec stats:', categoryStats);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenue sur votre tableau de bord d'administration</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <Chart />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Activité Récente</h3>
          <div className="space-y-4">
            {[
              { action: "Nouvelle inscription", user: "Aminata Koné", time: "Il y a 5 min", type: "user" },
              { action: "Formation terminée", user: "Mamadou Traoré", time: "Il y a 15 min", type: "course" },
              { action: "Nouveau commentaire", user: "Fatou Diallo", time: "Il y a 30 min", type: "comment" },
              { action: "Paiement reçu", user: "Yao N'Guessan", time: "Il y a 1h", type: "payment" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'user' ? 'bg-green-500' :
                  activity.type === 'course' ? 'bg-blue-500' :
                  activity.type === 'comment' ? 'bg-yellow-500' : 'bg-purple-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Formations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Formations Populaires</h3>
          <button className="text-[#A553C4] hover:text-[#6636DD] font-medium text-sm">
            Voir tout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularFormations.map((formation) => (
            <div key={formation.id} className="group cursor-pointer">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-48">
                  <img 
                    src={formation.image_url || 'https://via.placeholder.com/400x300?text=Formation'} 
                    alt={formation.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Formation';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                      {formation.category?.name}
                    </span>
                  </div>
                  {formation.is_trending && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Tendance
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-[#A553C4] transition-colors line-clamp-2">
                    {formation.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{formation.total_students || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{formation.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">{formation.duration_formatted}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#A553C4]">
                      {formation.formatted_price}
                    </span>
                    <button className="text-xs bg-gray-100 hover:bg-[#A553C4] hover:text-white px-3 py-1 rounded-full transition-colors">
                      Gérer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {formations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Aucune formation disponible pour le moment</p>
          </div>
        )}
      </div>

      {/* Statistiques supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Performance des Catégories
          </h3>
          {categoryStats.length > 0 ? (
            <div className="space-y-4">
              {categoryStats.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{category.name}</span>
                    <span className="text-gray-600">{category.count} formations ({category.value}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${category.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${category.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Aucune catégorie disponible</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Prochaines Sessions
          </h3>
          <div className="space-y-4">
            {[
              { title: 'Webinaire Marketing Digital', date: '15 Oct 2025', time: '14:00' },
              { title: 'Atelier Python', date: '18 Oct 2025', time: '10:00' },
              { title: 'Masterclass Design', date: '20 Oct 2025', time: '16:00' }
            ].map((session, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 text-sm mb-1">{session.title}</h4>
                  <p className="text-xs text-gray-600">{session.date} à {session.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;