import React from 'react';
import { TrendingUp, Users, BookOpen, DollarSign, Eye, Star, Clock, Award } from 'lucide-react';
import StatsCard from './StatsCard';
import Chart from './Chart';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Formation, User } from '../types';
import { initialFormations, initialUsers } from '../data/initialData';

const Dashboard: React.FC = () => {
  const [formations] = useLocalStorage<Formation[]>('formations', initialFormations);
  const [users] = useLocalStorage<User[]>('users', initialUsers);

  // Calcul des statistiques en temps réel
  const totalRevenue = formations.reduce((acc, f) => acc + (f.price * f.students), 0);
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Actif').length;
  const totalFormations = formations.filter(f => f.status === 'Publié').length;
  const totalStudents = formations.reduce((acc, f) => acc + f.students, 0);

  const stats = [
    {
      title: "Revenus Aujourd'hui",
      value: `${Math.round(totalRevenue / 100).toLocaleString()}€`,
      change: "+55%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "from-[#A553C4] to-[#6636DD]"
    },
    {
      title: "Utilisateurs Actifs",
      value: activeUsers.toLocaleString(),
      change: "-3%",
      changeType: "negative" as const,
      icon: Users,
      color: "from-[#6636DD] to-[#2D139B]"
    },
    {
      title: "Nouvelles Inscriptions",
      value: `+${Math.round(totalStudents * 0.1)}`,
      change: "-2%",
      changeType: "negative" as const,
      icon: TrendingUp,
      color: "from-[#A553C4] to-[#2D139B]"
    },
    {
      title: "Formations Vendues",
      value: totalStudents.toLocaleString(),
      change: "+5%",
      changeType: "positive" as const,
      icon: BookOpen,
      color: "from-[#2D139B] to-[#6636DD]"
    }
  ];

  // Formations populaires (top 3 par nombre d'étudiants)
  const recentFormations = formations
    .filter(f => f.status === 'Publié')
    .sort((a, b) => b.students - a.students)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenue sur votre tableau de bord d'administration</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
              { action: "Nouvelle inscription", user: "Marie Dubois", time: "Il y a 5 min", type: "user" },
              { action: "Formation terminée", user: "Jean Martin", time: "Il y a 15 min", type: "course" },
              { action: "Nouveau commentaire", user: "Sophie Laurent", time: "Il y a 30 min", type: "comment" },
              { action: "Paiement reçu", user: "Pierre Moreau", time: "Il y a 1h", type: "payment" }
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
          {recentFormations.map((formation) => (
            <div key={formation.id} className="group cursor-pointer">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-48">
                  <img 
                    src={formation.image} 
                    alt={formation.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                      {formation.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-[#A553C4] transition-colors">
                    {formation.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{formation.students}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{formation.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#A553C4]">
                      {Math.round(formation.price / 100)}€
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
      </div>
    </div>
  );
};

export default Dashboard;