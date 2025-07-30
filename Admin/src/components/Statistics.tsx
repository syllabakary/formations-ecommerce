import React from 'react';
import { TrendingUp, Users, BookOpen, DollarSign, Eye, Calendar, Clock, Award } from 'lucide-react';

const Statistics: React.FC = () => {
  const stats = [
    {
      title: "Revenus Totaux",
      value: "245,678€",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "from-[#A553C4] to-[#6636DD]"
    },
    {
      title: "Utilisateurs Inscrits",
      value: "4,892",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Users,
      color: "from-[#6636DD] to-[#2D139B]"
    },
    {
      title: "Formations Actives",
      value: "127",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: BookOpen,
      color: "from-[#A553C4] to-[#2D139B]"
    },
    {
      title: "Taux de Complétion",
      value: "78.5%",
      change: "+3.1%",
      changeType: "positive" as const,
      icon: Award,
      color: "from-[#2D139B] to-[#6636DD]"
    }
  ];

  const monthlyData = [
    { month: 'Jan', revenues: 18500, users: 342, courses: 12 },
    { month: 'Fév', revenues: 22300, users: 428, courses: 15 },
    { month: 'Mar', revenues: 19800, users: 389, courses: 18 },
    { month: 'Avr', revenues: 26700, users: 512, courses: 22 },
    { month: 'Mai', revenues: 24200, users: 467, courses: 19 },
    { month: 'Jun', revenues: 31400, users: 634, courses: 25 },
    { month: 'Jul', revenues: 28900, users: 578, courses: 28 },
    { month: 'Aoû', revenues: 33200, users: 689, courses: 31 },
    { month: 'Sep', revenues: 35600, users: 742, courses: 34 },
    { month: 'Oct', revenues: 32800, users: 698, courses: 29 },
    { month: 'Nov', revenues: 38900, users: 823, courses: 37 },
    { month: 'Déc', revenues: 42100, users: 891, courses: 41 }
  ];

  const topFormations = [
    { name: "Design UX/UI Moderne", enrollments: 1456, revenue: 60754, rating: 4.9 },
    { name: "Développement React Avancé", enrollments: 892, revenue: 53441, rating: 4.8 },
    { name: "Marketing Digital 2024", enrollments: 2341, revenue: 92369, rating: 4.7 },
    { name: "Python pour Data Science", enrollments: 673, revenue: 40380, rating: 4.6 },
    { name: "Photoshop Professionnel", enrollments: 1234, revenue: 49360, rating: 4.8 }
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenues));
  const maxUsers = Math.max(...monthlyData.map(d => d.users));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Statistiques & Analytics</h1>
        <p className="text-gray-600">Visualisez les performances de votre plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
              <p className="text-sm text-gray-600">Revenus mensuels en euros</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5%</span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between space-x-1">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden">
                  <div
                    className="bg-gradient-to-t from-[#A553C4] to-[#6636DD] rounded-t-lg transition-all duration-1000 ease-out"
                    style={{
                      height: `${(item.revenues / maxRevenue) * 200}px`,
                      animationDelay: `${index * 100}ms`
                    }}
                  ></div>
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
              <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden">
                  <div
                    className="bg-gradient-to-t from-[#6636DD] to-[#2D139B] rounded-t-lg transition-all duration-1000 ease-out"
                    style={{
                      height: `${(item.users / maxUsers) * 200}px`,
                      animationDelay: `${index * 100}ms`
                    }}
                  ></div>
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

        <div className="space-y-4">
          {topFormations.map((formation, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#A553C4] to-[#6636DD] rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
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
                  {formation.revenue.toLocaleString()}€
                </div>
                <div className="text-sm text-gray-500">Revenus générés</div>
              </div>
            </div>
          ))}
        </div>
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
              <p className="text-2xl font-bold text-gray-800">12.4%</p>
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
              <p className="text-2xl font-bold text-gray-800">2h 34m</p>
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
              <p className="text-2xl font-bold text-gray-800">4.7/5</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Note moyenne des formations</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;