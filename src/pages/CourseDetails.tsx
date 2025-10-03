import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Star, Clock, Users, Award, BookOpen, Play,
  CheckCircle, Globe, Download, Share2, Heart, Calendar,
  TrendingUp, Code, Shield, Target, Zap, MessageCircle,
  ChevronDown, ChevronUp, Video, FileText, Trophy, X
} from 'lucide-react';
import { motion } from 'framer-motion';

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
};

const CourseDetails = ({ courseSlug, onBack }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (courseSlug) {
      loadCourse();
    }
  }, [courseSlug]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.baseURL}/v1/courses/${courseSlug}`);
      if (!response.ok) throw new Error('Formation non trouvée');
      const data = await response.json();
      setCourse(data.data || data);
    } catch (err) {
      setError('Impossible de charger les détails de la formation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/v1/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_name: registrationData.name,
          participant_email: registrationData.email,
          participant_phone: registrationData.phone,
          course_id: course.id,
          notes: 'Inscription depuis la page de détails'
        }),
      });
      
      if (!response.ok) throw new Error('Erreur lors de l\'inscription');
      
      alert('Inscription réussie ! Vous recevrez un email de confirmation.');
      setShowRegistrationModal(false);
      setRegistrationData({ name: '', email: '', phone: '' });
    } catch (err) {
      alert('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const modules = [
    {
      id: 1,
      title: "Introduction et fondamentaux",
      duration: "2h 30min",
      lessons: 8,
      content: [
        "Présentation de la formation",
        "Objectifs pédagogiques",
        "Configuration de l'environnement",
        "Premiers concepts clés"
      ]
    },
    {
      id: 2,
      title: "Concepts avancés",
      duration: "4h 15min",
      lessons: 12,
      content: [
        "Techniques avancées",
        "Cas pratiques",
        "Études de cas réels",
        "Exercices d'application"
      ]
    },
    {
      id: 3,
      title: "Projet final",
      duration: "6h",
      lessons: 5,
      content: [
        "Brief du projet",
        "Développement guidé",
        "Revue et feedback",
        "Présentation finale"
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Formation non trouvée</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {course.is_trending && (
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Tendance
                  </span>
                )}
                {course.is_bestseller && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Best-seller
                  </span>
                )}
                {course.is_new && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Nouveau
                  </span>
                )}
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  {course.category?.name}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                {course.title}
              </h1>

              <p className="text-xl text-white/90">
                {course.short_description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(course.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-white/70">({course.total_reviews} avis)</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course.total_students?.toLocaleString() || 0} étudiants</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration_formatted}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span>En ligne</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {course.trainer?.name?.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-white/70">Formateur</p>
                  <p className="font-semibold text-lg">{course.trainer?.name}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-8">
                <img
                  src={course.image_url || 'https://via.placeholder.com/400x300'}
                  alt={course.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=Formation';
                  }}
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />

                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    {course.discount_percentage && (
                      <span className="text-lg text-gray-500 line-through">
                        {course.formatted_original_price}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-gray-900">
                      {course.formatted_price}
                    </span>
                    {course.discount_percentage && (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                        -{course.discount_percentage}%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setShowRegistrationModal(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    S'inscrire maintenant
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`flex-1 border-2 ${
                        isFavorite ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-700'
                      } py-2 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2`}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                      Favoris
                    </button>
                    <button className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                      <Share2 className="h-5 w-5" />
                      Partager
                    </button>
                  </div>

                  <div className="pt-6 border-t space-y-3">
                    <h3 className="font-bold text-gray-900">Cette formation comprend :</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-purple-600" />
                        <span>Vidéos HD à la demande</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-600" />
                        <span>Ressources téléchargeables</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-purple-600" />
                        <span>Certificat de fin de formation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-purple-600" />
                        <span>Accès illimité</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-purple-600" />
                        <span>Support formateur</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  {[
                    { id: 'overview', label: 'Vue d\'ensemble' },
                    { id: 'content', label: 'Contenu' },
                    { id: 'reviews', label: 'Avis' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                        activeTab === tab.id
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        À propos de cette formation
                      </h2>
                      <div className="prose prose-lg text-gray-600">
                        {course.description || course.short_description}
                      </div>
                    </div>

                    {course.skills && course.skills.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          Compétences que vous allez acquérir
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {course.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Objectifs d'apprentissage
                      </h3>
                      <div className="space-y-3">
                        {[
                          "Maîtriser les concepts fondamentaux",
                          "Appliquer les techniques avancées",
                          "Développer des projets concrets",
                          "Obtenir une certification reconnue"
                        ].map((objective, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{objective}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Programme de la formation
                    </h2>
                    {modules.map((module) => (
                      <div
                        key={module.id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedModule(expandedModule === module.id ? null : module.id)
                          }
                          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-purple-600">
                              {module.id}
                            </span>
                            <div className="text-left">
                              <h3 className="font-bold text-gray-900">{module.title}</h3>
                              <p className="text-sm text-gray-600">
                                {module.lessons} leçons • {module.duration}
                              </p>
                            </div>
                          </div>
                          {expandedModule === module.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                          )}
                        </button>

                        {expandedModule === module.id && (
                          <div className="px-6 py-4 bg-white space-y-2">
                            {module.content.map((lesson, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 py-2 text-gray-700 hover:text-purple-600 cursor-pointer"
                              >
                                <Play className="h-4 w-4" />
                                <span>{lesson}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                          {course.rating}
                        </div>
                        <div className="flex items-center justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(course.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">{course.total_reviews} avis</p>
                      </div>
                    </div>

                    <div className="text-center text-gray-600 py-8">
                      Les avis des étudiants seront bientôt disponibles
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Niveau</p>
                  <p className="font-semibold text-gray-900 capitalize">{course.level}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{course.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Difficulté</p>
                  <p className="font-semibold text-gray-900 capitalize">{course.difficulty}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                S'inscrire à la formation
              </h2>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Remplissez le formulaire pour vous inscrire à cette formation.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom complet"
                value={registrationData.name}
                onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={registrationData.email}
                onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={registrationData.phone}
                onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRegister}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;