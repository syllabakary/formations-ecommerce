import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Youtube, Send, MessageCircle, Users, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    country: '',
    interest: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' ou 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulation d'envoi du formulaire
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        country: '',
        interest: ''
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  const countries = [
    'Sénégal', 'Côte d\'Ivoire', 'Ghana', 'Nigeria', 'Mali', 'Burkina Faso',
    'Cameroun', 'Kenya', 'Maroc', 'Tunisie', 'Algérie', 'Autre'
  ];

  const interests = [
    'Développement Web', 'Data Science & IA', 'Marketing Digital', 
    'Cybersécurité', 'Design UX/UI', 'Gestion de Projet',
    'Entrepreneuriat', 'Langues', 'Autre'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-purple-100 py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full opacity-30 transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full opacity-40 transform -translate-x-16 translate-y-16"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-purple-900 mb-6">
              Contactez-Nous
            </h1>
            <div className="w-32 h-1 bg-purple-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Nous sommes là pour vous accompagner dans votre parcours de formation. 
              N'hésitez pas à nous contacter pour toute question ou information.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Formulaire de contact */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Envoyez-nous un message</h2>
                <p className="text-gray-600">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-green-700">Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700">Une erreur s'est produite. Veuillez réessayer.</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="+223 XX XX XX XX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Pays
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Sélectionnez votre pays</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
                      Domaine d'intérêt
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Choisissez un domaine</option>
                      {interests.map((interest) => (
                        <option key={interest} value={interest}>{interest}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="L'objet de votre message"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Décrivez votre demande ou vos questions..."
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Informations de contact */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Nos Coordonnées</h2>
              </div>

              {/* Infos de contact */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-300">
                  <div className="bg-purple-600 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Téléphone</h3>
                    <p className="text-gray-600">+223 XX XX XX XX</p>
                    <p className="text-gray-600">+225 XX XX XX XX</p>
                    <p className="text-sm text-purple-600 mt-1">Lun-Ven: 8h00 - 18h00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-300">
                  <div className="bg-purple-600 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">contact@empowerformation.com</p>
                    <p className="text-gray-600">support@empowerformation.com</p>
                    <p className="text-sm text-purple-600 mt-1">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-300">
                  <div className="bg-purple-600 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Adresses</h3>
                    <p className="text-gray-600 mb-2">Abidjan, Côte d'Ivoire</p>
                    <p className="text-gray-600">Dakar, Sénégal</p>
                    <p className="text-sm text-purple-600 mt-1">Bureaux régionaux</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-300">
                  <div className="bg-purple-600 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Horaires d'ouverture</h3>
                    <p className="text-gray-600">Lundi - Vendredi: 8h00 - 18h00</p>
                    <p className="text-gray-600">Samedi: 9h00 - 15h00</p>
                    <p className="text-gray-600">Dimanche: Fermé</p>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-6">Suivez-nous</h3>
                <p className="mb-6 opacity-90">
                  Restez connectés avec nous sur les réseaux sociaux pour ne rien manquer de nos actualités et conseils.
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300 transform hover:scale-110"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300 transform hover:scale-110"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300 transform hover:scale-110"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300 transform hover:scale-110"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300 transform hover:scale-110"
                  >
                    <Youtube className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions Fréquentes</h2>
            <p className="text-gray-600 text-lg">
              Trouvez rapidement les réponses aux questions les plus courantes.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Comment puis-je m'inscrire à une formation ?</h3>
              <p className="text-gray-600">
                Vous pouvez vous inscrire directement sur notre plateforme en créant un compte. 
                Parcourez notre catalogue de formations et cliquez sur "S'inscrire" pour la formation qui vous intéresse.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Quels sont les modes de paiement acceptés ?</h3>
              <p className="text-gray-600">
                Nous acceptons les paiements par mobile money (Orange Money, MTN, Moov Money), 
                cartes bancaires, et virements bancaires dans tous les pays d'Afrique de l'Ouest.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Les certificats sont-ils reconnus ?</h3>
              <p className="text-gray-600">
                Oui, nos certificats sont reconnus par nos entreprises partenaires et valorisés 
                sur le marché du travail africain. Ils attestent de vos compétences acquises.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Puis-je suivre les cours à mon rythme ?</h3>
              <p className="text-gray-600">
                Absolument ! Nos formations en ligne sont conçues pour être flexibles. 
                Vous pouvez apprendre à votre rythme, selon votre emploi du temps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <MessageCircle className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-6">
            Besoin d'aide pour choisir votre formation ?
          </h2>
          <p className="text-white text-lg mb-8 opacity-90">
            Nos conseillers pédagogiques sont là pour vous guider dans le choix 
            de la formation qui correspond le mieux à vos objectifs professionnels.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Prendre rendez-vous
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105">
              Chat en direct
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;