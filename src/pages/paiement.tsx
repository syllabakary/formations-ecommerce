import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Clock, Users, Shield, CheckCircle, CreditCard, Smartphone, Award, BookOpen, Play, Lock, Zap, Globe, Eye, EyeOff } from 'lucide-react';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [showCvv, setShowCvv] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isCardNumberFocused, setIsCardNumberFocused] = useState(false);

  // Animation et effets visuels
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Données du cours
  const course = {
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
    features: [
      "Accès à vie au contenu",
      "Certificat de completion",
      "Projets pratiques",
      "Support communautaire",
      "Mises à jour gratuites"
    ]
  };

  const paymentMethods = [
    {
      id: 'mtn',
      name: 'MTN Money',
      shortName: 'MTN',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0ZGQ0MwMCIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk08L3RleHQ+CjwvU3ZnPgo=',
      gradient: 'from-yellow-400 to-yellow-600',
      type: 'mobile',
      fees: 0,
      description: 'Paiement instantané et sécurisé'
    },
    {
      id: 'orange',
      name: 'Orange Money',
      shortName: 'Orange',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0ZGNjcwMCIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk88L3RleHQ+Cjwvc3ZnPgo=',
      gradient: 'from-orange-400 to-orange-600',
      type: 'mobile',
      fees: 0,
      description: 'Solution de paiement mobile rapide'
    },
    {
      id: 'wave',
      name: 'Wave',
      shortName: 'Wave',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwN0RGRiIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlc8L3RleHQ+Cjwvc3ZnPgo=',
      gradient: 'from-blue-400 to-blue-600',
      type: 'mobile',
      fees: 0,
      description: 'Transferts sans frais cachés'
    },
    {
      id: 'moov',
      name: 'Moov Money',
      shortName: 'Moov',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwQUE0NCIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1vPC90ZXh0Pgo8L3N2Zz4K',
      gradient: 'from-green-500 to-green-700',
      type: 'mobile',
      fees: 0,
      description: 'Paiement mobile fiable'
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      shortName: 'Carte',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzM3NDE1MSIvPgo8cmVjdCB4PSI4IiB5PSIxMiIgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiByeD0iMiIgZmlsbD0iI0ZGRkZGRiIvPgo8cmVjdCB4PSI4IiB5PSIxNiIgd2lkdGg9IjI0IiBoZWlnaHQ9IjIiIGZpbGw9IiMzNzQxNTEiLz4KPC9zdmc+Cg==',
      gradient: 'from-gray-600 to-gray-800',
      type: 'card',
      fees: 2.5,
      description: 'Visa, MasterCard, acceptées'
    }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Accès Basique',
      price: course.price * 0.8,
      features: ['Accès 6 mois', 'Contenu principal', 'Support email'],
      popular: false,
      badge: 'Économique',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'standard',
      name: 'Accès Standard',
      price: course.price,
      features: ['Accès à vie', 'Certificat', 'Projets pratiques', 'Support prioritaire'],
      popular: true,
      badge: 'Recommandé',
      badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      id: 'premium',
      name: 'Accès Premium',
      price: course.price * 1.3,
      features: ['Tout Standard +', 'Sessions 1-on-1', 'Révisions CV', 'Groupe privé'],
      popular: false,
      badge: 'Premium',
      badgeColor: 'bg-gradient-to-r from-yellow-400 to-orange-500'
    }
  ];

  const selectedPlanData = plans.find(p => p.id === selectedPlan);
  const selectedPaymentMethod = paymentMethods.find(m => m.id === paymentMethod);
  const totalFees = selectedPaymentMethod ? (selectedPlanData.price * selectedPaymentMethod.fees / 100) : 0;
  const totalAmount = selectedPlanData.price + totalFees;

  // Formatage du numéro de carte
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulation du paiement avec animation
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 3000);
  };

  const goBack = () => {
    window.history.back();
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className={`max-w-2xl w-full transform transition-all duration-700 ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative text-8xl mb-6">🎉</div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Paiement Réussi !
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Félicitations ! Votre formation vous attend
            </p>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
                  <p className="text-gray-600">{selectedPlanData.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium">Accès activé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Commencer maintenant
              </button>
              <button className="group flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:border-gray-300">
                <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Voir le programme
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Globe className="h-4 w-4" />
              Confirmation envoyée par email
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header amélioré */}
        <div className={`flex items-center gap-6 mb-12 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button 
            onClick={goBack}
            className="group p-4 hover:bg-white/60 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600 group-hover:text-gray-900 transition-colors" />
          </button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Finaliser votre inscription
            </h1>
            <p className="text-gray-600 text-lg mt-2">Choisissez votre plan et mode de paiement sécurisé</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Column - Course Info & Plans */}
          <div className={`xl:col-span-3 space-y-8 transform transition-all duration-700 delay-100 ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
            {/* Course Summary amélioré */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Votre formation</h2>
              </div>
              
              <div className="flex gap-6">
                <div className="relative group">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-32 h-32 rounded-2xl object-cover shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-2xl text-gray-900 mb-3">{course.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{course.description}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{course.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-gray-700 font-medium mb-4">Cette formation inclut :</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Plan Selection amélioré */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Choisissez votre plan</h2>
              </div>
              
              <div className="space-y-4">
                {plans.map((plan, index) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative group p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                      selectedPlan === plan.id 
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300 bg-white/50 hover:bg-white/80'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {plan.badge && (
                      <div className={`absolute -top-3 left-6 ${plan.badgeColor} text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg`}>
                        {plan.badge}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-3">{plan.name}</h3>
                        <div className="space-y-2">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 text-white" />
                              </div>
                              <span className="text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right ml-6">
                        <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          {plan.price.toLocaleString('fr-FR')}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">F CFA</div>
                        {plan.id === 'standard' && course.originalPrice > plan.price && (
                          <div className="text-sm text-gray-400 line-through mt-1">
                            {course.originalPrice.toLocaleString('fr-FR')} F CFA
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedPlan === plan.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Payment */}
          <div className={`xl:col-span-2 space-y-8 transform transition-all duration-700 delay-200 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
            {/* Payment Methods amélioré */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Mode de paiement</h2>
              </div>
              
              <div className="space-y-3">
                {paymentMethods.map((method, index) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`group w-full p-4 border-2 rounded-2xl transition-all duration-300 flex items-center gap-4 hover:shadow-lg transform hover:-translate-y-1 ${
                      paymentMethod === method.id 
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300 bg-white/50'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`relative w-14 h-14 bg-gradient-to-r ${method.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <img 
                        src={method.logo} 
                        alt={method.name} 
                        className="w-8 h-8"
                      />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="font-bold text-gray-900 text-lg">{method.name}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                      {method.fees > 0 && (
                        <div className="text-xs text-orange-600 font-medium mt-1">
                          Frais: {method.fees}%
                        </div>
                      )}
                    </div>
                    
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      {method.type === 'mobile' ? 
                        <Smartphone className="h-6 w-6" /> : 
                        <CreditCard className="h-6 w-6" />
                      }
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Form amélioré */}
            {paymentMethod && (
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="h-5 w-5 text-green-500" />
                  <h2 className="text-xl font-bold text-gray-900">Informations sécurisées</h2>
                </div>
                
                {selectedPaymentMethod?.type === 'mobile' ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Numéro de téléphone
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          placeholder="Ex: +225 01 02 03 04 05"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                        />
                        <Smartphone className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-700 flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Vous recevrez un code de confirmation sur ce numéro
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Nom du titulaire
                      </label>
                      <input
                        type="text"
                        placeholder="Jean Dupont"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                      />
                    </div>
                    
                    <div className="relative">
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Numéro de carte
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          onFocus={() => setIsCardNumberFocused(true)}
                          onBlur={() => setIsCardNumberFocused(false)}
                          maxLength="19"
                          className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm text-lg font-mono tracking-wider placeholder-gray-400 ${
                            isCardNumberFocused ? 'border-blue-300' : 'border-gray-200'
                          }`}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
                          <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
                          <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Date d'expiration
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.substring(0,2) + '/' + value.substring(2,4);
                            }
                            setExpiryDate(value);
                          }}
                          maxLength="5"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm text-lg font-mono placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          CVV
                        </label>
                        <div className="relative">
                          <input
                            type={showCvv ? "text" : "password"}
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0,4))}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm text-lg font-mono placeholder-gray-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCvv(!showCvv)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showCvv ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-sm text-amber-700 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Vos informations sont cryptées avec SSL 256-bit
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order Summary amélioré */}
            <div className="bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Résumé</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/50 rounded-2xl">
                  <div>
                    <div className="font-medium text-gray-900">{selectedPlanData.name}</div>
                    <div className="text-sm text-gray-500">{course.title}</div>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {selectedPlanData.price.toLocaleString('fr-FR')} F
                  </div>
                </div>
                
                {totalFees > 0 && (
                  <div className="flex justify-between items-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Frais de traitement</span>
                      <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">i</span>
                      </div>
                    </div>
                    <span className="font-medium text-orange-700">
                      +{totalFees.toLocaleString('fr-FR')} F
                    </span>
                  </div>
                )}
                
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {totalAmount.toLocaleString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">F CFA</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice amélioré */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-green-800 text-lg">Paiement 100% sécurisé</div>
                  <div className="text-green-700 mt-1">
                    Protection SSL, conformité PCI-DSS et chiffrement de niveau bancaire
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Cryptage 256-bit</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Conformité PCI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Button amélioré */}
            <button
              onClick={handlePayment}
              disabled={!paymentMethod || isProcessing || 
                (selectedPaymentMethod?.type === 'mobile' ? !phoneNumber : 
                 !cardNumber || !cardholderName || !expiryDate || !cvv)}
              className="group relative w-full py-6 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden transform hover:-translate-y-1 disabled:hover:transform-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {isProcessing ? (
                <div className="relative flex items-center gap-3">
                  <div className="animate-spin h-8 w-8 border-3 border-white border-t-transparent rounded-full"></div>
                  <span>Traitement sécurisé en cours...</span>
                </div>
              ) : (
                <div className="relative flex items-center gap-3">
                  <Lock className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span>Payer {totalAmount.toLocaleString('fr-FR')} F CFA</span>
                  <div className="absolute right-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                    →
                  </div>
                </div>
              )}
            </button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">
                En procédant au paiement, vous acceptez nos{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2">
                  conditions d'utilisation
                </a>{' '}
                et notre{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2">
                  politique de confidentialité
                </a>
              </p>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Lock className="h-3 w-3" />
                <span>Transaction sécurisée par SSL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators amélioré */}
        <div className={`mt-16 transform transition-all duration-700 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Pourquoi nous faire confiance ?
              </h3>
              <p className="text-gray-600 text-lg">Plus de 10,000 étudiants nous font déjà confiance</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group text-center hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="relative w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-2xl transition-shadow">
                  <Shield className="h-10 w-10 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-700 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h4 className="font-bold text-xl text-gray-900 mb-3">Paiement Ultra-Sécurisé</h4>
                <p className="text-gray-600 leading-relaxed">Cryptage SSL 256-bit, conformité PCI-DSS et protection contre la fraude</p>
              </div>
              
              <div className="group text-center hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="relative w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-2xl transition-shadow">
                  <Award className="h-10 w-10 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-700 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h4 className="font-bold text-xl text-gray-900 mb-3">Garantie Satisfaction</h4>
                <p className="text-gray-600 leading-relaxed">Remboursement intégral sous 30 jours si vous n'êtes pas satisfait</p>
              </div>
              
              <div className="group text-center hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="relative w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-600 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-2xl transition-shadow">
                  <Users className="h-10 w-10 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-700 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h4 className="font-bold text-xl text-gray-900 mb-3">Support Premium 24/7</h4>
                <p className="text-gray-600 leading-relaxed">Équipe dédiée disponible pour vous accompagner à tout moment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;