import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, BookOpen, DollarSign, Calendar, Clock, Award } from 'lucide-react';

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
};

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalFormations: 0,
    completionRate: 0,
    averageRating: 0,
    conversionRate: 0,
    averageTime: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [topFormations, setTopFormations] = useState([]);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);

      // Charger toutes les formations
      const [onlineRes, inPersonRes] = await Promise.all([
        fetch(`${API_CONFIG.baseURL}/v1/courses?mode=online&per_page=100`),
        fetch(`${API_CONFIG.baseURL}/v1/courses?mode=in-person&per_page=100`)
      ]);

      const onlineData = onlineRes.ok ? await onlineRes.json() : { data: [] };
      const inPersonData = inPersonRes.ok ? await inPersonRes.json() : { data: [] };

      const allFormations = [...(onlineData.data || []), ...(inPersonData.data || [])];

      // Calculer les statistiques globales
      console.log('=== DEBUG STATISTIQUES ===');
      console.log('Total formations chargées:', allFormations.length);
      
      let totalRevenue = 0;
      let totalUsers = 0;
      
      allFormations.forEach(f => {
        const students = f.total_students || f.registered_students || f.registered_seats || f.enrollments || 0;
        const price = f.price || 0;
        
        totalRevenue += (price * students);
        totalUsers += students;
        
        if (students > 0) {
          console.log(`${f.title}: ${students} étudiants`);
        }
      });

      console.log('Total utilisateurs calculé:', totalUsers);
      console.log('Total revenus calculé:', totalRevenue);

      const totalFormations = allFormations.filter(f => f.is_active || f.status === 'active' || f.status === 'published').length;

      const totalReviews = allFormations.reduce((sum, f) => sum + (f.total_reviews || 0), 0);
      const sumRatings = allFormations.reduce((sum, f) => sum + ((f.rating || 0) * (f.total_reviews || 0)), 0);
      const averageRating = totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : 0;

      // Calculer le taux de complétion (simulation)
      const completionRate = 78.5;
      const conversionRate = 12.4;
      const averageTime = '2h 34m';

      setStats({
        totalRevenue,
        totalUsers,
        totalFormations,
        completionRate,
        averageRating: parseFloat(averageRating),
        conversionRate,
        averageTime
      });

      // Top formations par nombre d'étudiants
      const sortedFormations = [...allFormations]
        .sort((a, b) => {
          const studentsA = a.total_students || a.registered_seats || 0;
          const studentsB = b.total_students || b.registered_seats || 0;
          return studentsB - studentsA;
        })
        .slice(0, 5)
        .map(f => ({
          name: f.title,
          enrollments: f.total_students || f.registered_seats || 0,
          revenue: f.price * (f.total_students || f.registered_seats || 0),
          rating: f.rating || 0,
          image: f.image_url
        }));

      setTopFormations(sortedFormations);

      // Données mensuelles (simulation pour le moment)
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const simulatedMonthlyData = months.map((month, index) => ({
        month,
        revenues: Math.round(totalRevenue / 12 * (0.7 + Math.random() * 0.6)),
        users: Math.round(totalUsers / 12 * (0.7 + Math.random() * 0.6)),
        courses: Math.round(totalFormations / 12 * (0.7 + Math.random() * 0.6))
      }));

      setMonthlyData(simulatedMonthlyData);

    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Revenus Totaux",
      value: `${Math.round(stats.totalRevenue).toLocaleString()} F CFA`,
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "from-[#A553C4] to-[#6636DD]"
    },
    {
      title: "Utilisateurs Inscrits",
      value: stats.totalUsers.toLocaleString(),
      change: "+8.2%",
      changeType: "positive",
      icon: Users,
      color: "from-[#6636DD] to-[#2D139B]"
    },
    {
      title: "Formations Actives",
      value: stats.totalFormations.toString(),
      change: "+15.3%",
      changeType: "positive",
      icon: BookOpen,
      color: "from-[#A553C4] to-[#2D139B]"
    },
    {
      title: "Taux de Complétion",
      value: `${stats.completionRate}%`,
      change: "+3.1%",
      changeType: "positive",
      icon: Award,
      color: "from-[#2D139B] to-[#6636DD]"
    }
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenues), 1);
  const maxUsers = Math.max(...monthlyData.map(d => d.users), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Statistiques & Analytics</h1>
        <p className="text-gray-600">Visualisez les performances de votre plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mb-2">{stat.value}</p>
                  <div className="flex items-center space-x-1">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">vs mois dernier</span>
                  </div>
                </div>
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Évolution des Revenus</h3>
              <p className="text-sm text-gray-600">Revenus mensuels en FCFA</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5%</span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between space-x-1">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center space-y-2 group">
                <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden">
                  <div
                    className="bg-gradient-to-t from-[#A553C4] to-[#6636DD] rounded-t-lg transition-all duration-1000 ease-out relative"
                    style={{
                      height: `${(item.revenues / maxRevenue) * 200}px`,
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {Math.round(item.revenues).toLocaleString()} F
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Users Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Nouvelles Inscriptions</h3>
              <p className="text-sm text-gray-600">Utilisateurs inscrits par mois</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-600 font-medium">
              <Users className="w-4 h-4" />
              <span>+8.2%</span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between space-x-1">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center space-y-2 group">
                <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden">
                  <div
                    className="bg-gradient-to-t from-[#6636DD] to-[#2D139B] rounded-t-lg transition-all duration-1000 ease-out relative"
                    style={{
                      height: `${(item.users / maxUsers) * 200}px`,
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.users} users
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Formations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Top Formations</h3>
          <span className="text-sm text-gray-500">Classées par nombre d'inscriptions</span>
        </div>

        {topFormations.length > 0 ? (
          <div className="space-y-4">
            {topFormations.map((formation, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#A553C4] to-[#6636DD] rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  {formation.image && (
                    <img 
                      src={formation.image}
                      alt={formation.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-800">{formation.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{formation.enrollments} étudiants</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span>{formation.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-[#A553C4]">
                    {Math.round(formation.revenue).toLocaleString()} F CFA
                  </div>
                  <div className="text-sm text-gray-500">Revenus générés</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Aucune formation disponible</p>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Taux de Conversion</h4>
              <p className="text-2xl font-bold text-gray-800">{stats.conversionRate}%</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Visiteurs qui s'inscrivent</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Temps Moyen</h4>
              <p className="text-2xl font-bold text-gray-800">{stats.averageTime}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Par session d'apprentissage</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Satisfaction</h4>
              <p className="text-2xl font-bold text-gray-800">{stats.averageRating}/5</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Note moyenne des formations</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;