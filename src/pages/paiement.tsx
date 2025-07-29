import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Clock, Users, Shield, CheckCircle, CreditCard, Smartphone, X, Award, BookOpen, Play } from 'lucide-react';

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

  // Données du cours (normalement passées via props ou routing)
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
      icon: '',
      color: 'bg-yellow-500',
      type: 'mobile',
      fees: 0
    },
    {
      id: 'orange',
      name: 'Orange Money',
      icon: '',
      color: 'bg-orange-500',
      type: 'mobile',
      fees: 0
    },
    {
      id: 'wave',
      name: 'Wave',
      icon: '',
      color: 'bg-blue-500',
      type: 'mobile',
      fees: 0
    },
    {
      id: 'moov',
      name: 'Moov Money',
      icon: '',
      color: 'bg-blue-600',
      type: 'mobile',
      fees: 0
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      icon: '',
      color: 'bg-gray-700',
      type: 'card',
      fees: 2.5
    }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Accès Basique',
      price: course.price * 0.8,
      features: ['Accès 6 mois', 'Contenu principal', 'Support email'],
      popular: false
    },
    {
      id: 'standard',
      name: 'Accès Standard',
      price: course.price,
      features: ['Accès à vie', 'Certificat', 'Projets pratiques', 'Support prioritaire'],
      popular: true
    },
    {
      id: 'premium',
      name: 'Accès Premium',
      price: course.price * 1.3,
      features: ['Tout Standard +', 'Sessions 1-on-1', 'Révisions CV', 'Groupe privé'],
      popular: false
    }
  ];

  const selectedPlanData = plans.find(p => p.id === selectedPlan);
  const selectedPaymentMethod = paymentMethods.find(m => m.id === paymentMethod);
  const totalFees = selectedPaymentMethod ? (selectedPlanData.price * selectedPaymentMethod.fees / 100) : 0;
  const totalAmount = selectedPlanData.price + totalFees;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulation du paiement
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="text-8xl mb-6"></div>
            <h1 className="text-4xl font-bold text-green-600 mb-4">Paiement Réussi !</h1>
            <p className="text-xl text-gray-600 mb-8">
              Félicitations ! Vous avez maintenant accès à votre formation
            </p>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
                  <p className="text-gray-600">{selectedPlanData.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 font-medium">Accès activé</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:shadow-lg transition-all">
                <Play className="h-5 w-5" />
                Commencer la formation
              </button>
              <button className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 transition-all">
                <BookOpen className="h-5 w-5" />
                Voir le programme
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Un email de confirmation a été envoyé avec vos accès
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={goBack}
            className="p-3 hover:bg-white/50 rounded-full transition-all backdrop-blur-sm"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finaliser votre inscription</h1>
            <p className="text-gray-600">Choisissez votre plan et mode de paiement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Course Info & Plans */}
          <div className="space-y-6">
            {/* Course Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Votre formation</h2>
              <div className="flex gap-4">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Cette formation inclut :</p>
                <div className="grid grid-cols-1 gap-1">
                  {course.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Plan Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Choisissez votre plan</h2>
              <div className="space-y-3">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedPlan === plan.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-2 left-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        POPULAIRE
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{plan.name}</h3>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {plan.price.toLocaleString('fr-FR')} F CFA
                        </div>
                        {plan.id === 'standard' && course.originalPrice > plan.price && (
                          <div className="text-sm text-gray-500 line-through">
                            {course.originalPrice.toLocaleString('fr-FR')} F CFA
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Payment */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mode de paiement</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-4 border-2 rounded-xl transition-all flex items-center gap-4 ${
                      paymentMethod === method.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                      {method.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{method.name}</div>
                      <div className="text-sm text-gray-500">
                        {method.type === 'mobile' ? 'Paiement mobile instantané' : 'Visa, MasterCard'}
                        {method.fees > 0 && ` • Frais: ${method.fees}%`}
                      </div>
                    </div>
                    {method.type === 'mobile' ? <Smartphone className="h-5 w-5 text-gray-400" /> : <CreditCard className="h-5 w-5 text-gray-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            {paymentMethod && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Informations de paiement</h2>
                
                {selectedPaymentMethod?.type === 'mobile' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de téléphone
                      </label>
                      <input
                        type="tel"
                        placeholder="Ex: +225 01 02 03 04 05"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Vous recevrez un message pour confirmer le paiement sur ce numéro
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du titulaire
                      </label>
                      <input
                        type="text"
                        placeholder="Jean Dupont"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de carte
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date d'expiration
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé de la commande</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{selectedPlanData.name}</span>
                  <span className="font-medium">{selectedPlanData.price.toLocaleString('fr-FR')} F CFA</span>
                </div>
                {totalFees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais de traitement</span>
                    <span className="font-medium">{totalFees.toLocaleString('fr-FR')} F CFA</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {totalAmount.toLocaleString('fr-FR')} F CFA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-medium text-green-800">Paiement 100% sécurisé</div>
                  <div className="text-sm text-green-700">
                    Vos informations sont cryptées et protégées par SSL
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={!paymentMethod || isProcessing || 
                (selectedPaymentMethod?.type === 'mobile' ? !phoneNumber : 
                 !cardNumber || !cardholderName || !expiryDate || !cvv)}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Shield className="h-6 w-6" />
                  Payer {totalAmount.toLocaleString('fr-FR')} F CFA
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              En procédant au paiement, vous acceptez nos{' '}
              <a href="#" className="text-blue-600 hover:underline">conditions d'utilisation</a>{' '}
              et notre{' '}
              <a href="#" className="text-blue-600 hover:underline">politique de confidentialité</a>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 bg-white/50 backdrop-blur-sm rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Paiement Sécurisé</h3>
              <p className="text-gray-600 text-sm">Cryptage SSL et conformité PCI</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Garantie Qualité</h3>
              <p className="text-gray-600 text-sm">Remboursement sous 30 jours</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Support 24/7</h3>
              <p className="text-gray-600 text-sm">Assistance dédiée disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;