import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Users, Award, Calendar, Star, Clock, Briefcase, GraduationCap, Globe, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

// Composant Footer réutilisable pour toutes les pages
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div>
            <h3 className="text-xl font-bold mb-6">EMPOWER FORMATION</h3>
            <p className="text-gray-400 mb-6">
              La plateforme de formation qui transforme la jeunesse africaine en professionnels qualifiés pour le monde de demain.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-purple-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-purple-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-purple-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-purple-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-purple-600 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Formations</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Développement Web</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Data Science & IA</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Marketing Digital</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Design UX/UI</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Gestion de Projet</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cybersécurité</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Liens Utiles</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">À propos de nous</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Témoignages</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Carrières</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partenaires</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contactez-nous</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-purple-400 mt-1" />
                <span className="text-gray-400">123 Avenue de l'Innovation, Dakar, Sénégal</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-purple-400" />
                <span className="text-gray-400">+221 76 123 45 67</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-purple-400" />
                <span className="text-gray-400">contact@empower-formation.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Inscrivez-vous à notre newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button className="bg-purple-600 px-4 py-2 rounded-r-lg hover:bg-purple-700 transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 EMPOWER FORMATION. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">Conditions d'utilisation</a>
              <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">Politique de confidentialité</a>
              <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">Mentions légales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Composant compteur animé pour les statistiques
const AnimatedCounter = ({ end, label, icon }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Animation du compteur
    if (count < end) {
      const timer = setTimeout(() => {
        setCount(prev => Math.min(prev + Math.ceil(end / 30), end));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [count, end]);

  return (
    <div className="transform hover:scale-105 transition-transform duration-300">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        <div className="mb-4 text-purple-600">
          {icon}
        </div>
        <h3 className="text-4xl font-bold text-gray-800 mb-2">{count}+</h3>
        <p className="text-gray-600">{label}</p>
      </div>
    </div>
  );
};

const Home = () => {
  // État pour gérer l'animation au scroll
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const statsSection = document.getElementById('stats-section');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        setIsVisible(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Vérifier la visibilité initiale
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl animate__animated animate__fadeInLeft">
            <h1 className="text-4xl font-bold mb-6">
              Façonnez votre avenir avec EMPOWER FORMATION
            </h1>
            <p className="text-xl mb-8">
              Des formations innovantes pour la jeunesse africaine. Développez vos compétences, réalisez vos ambitions.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2 hover:opacity-90 transition-all duration-300 hover:translate-x-2">
              <span>Commence ta formation dès aujourd'hui</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Statistiques Animées */}
      <section id="stats-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Notre impact en chiffres</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez comment nous transformons l'apprentissage et créons de nouvelles opportunités à travers l'Afrique.
            </p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
            <AnimatedCounter 
              end={5000} 
              label="Apprenants formés" 
              icon={<Users className="h-10 w-10 mx-auto" />} 
            />
            <AnimatedCounter 
              end={50} 
              label="Formations disponibles" 
              icon={<BookOpen className="h-10 w-10 mx-auto" />} 
            />
            <AnimatedCounter 
              end={95} 
              label="Taux de satisfaction" 
              icon={<Star className="h-10 w-10 mx-auto" />} 
            />
            <AnimatedCounter 
              end={20} 
              label="Pays représentés" 
              icon={<Globe className="h-10 w-10 mx-auto" />} 
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Pourquoi choisir EMPOWER FORMATION ?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Notre approche innovante combine expertise pédagogique et technologies avancées pour une expérience d'apprentissage optimale.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center space-y-4 hover:transform hover:scale-105 transition-transform duration-300">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Formations de qualité</h3>
            <p className="text-gray-600">
              Des cours conçus par des experts pour développer vos compétences professionnelles
            </p>
          </div>
          <div className="text-center space-y-4 hover:transform hover:scale-105 transition-transform duration-300">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Communauté active</h3>
            <p className="text-gray-600">
              Rejoignez une communauté dynamique d'apprenants et d'experts
            </p>
          </div>
          <div className="text-center space-y-4 hover:transform hover:scale-105 transition-transform duration-300">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Certificats reconnus</h3>
            <p className="text-gray-600">
              Obtenez des certificats valorisants pour votre carrière
            </p>
          </div>
        </div>
      </section>

      {/* Formations populaires */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Nos formations les plus populaires</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Découvrez nos formations les plus demandées par les professionnels et les entreprises.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="h-48 bg-gray-200 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="Formation" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAIRE
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-yellow-500 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current" />
                ))}
                <span className="text-gray-600 ml-2 text-sm">4.9 (120 avis)</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Développement Web Full Stack</h3>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>12 semaines</span>
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span>Débutant le 15 mai</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-600">350€</span>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors transform hover:scale-105">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="h-48 bg-gray-200 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGF0YSUyMHNjaWVuY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="Formation" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
            </div>
            <div className="p-6">
              <div className="flex items-center text-yellow-500 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current" />
                ))}
                <span className="text-gray-600 ml-2 text-sm">4.8 (98 avis)</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Data Science & IA</h3>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>16 semaines</span>
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span>Débutant le 1er juin</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-600">450€</span>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors transform hover:scale-105">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="h-48 bg-gray-200 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnaXRhbCUyMG1hcmtldGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60" alt="Formation" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
            </div>
            <div className="p-6">
              <div className="flex items-center text-yellow-500 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current" />
                ))}
                <span className="text-gray-600 ml-2 text-sm">4.7 (85 avis)</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Marketing Digital</h3>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>8 semaines</span>
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span>Débutant le 10 mai</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-600">280€</span>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors transform hover:scale-105">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-10">
          <button className="border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center space-x-2 mx-auto hover:translate-x-2">
            <span>Voir toutes nos formations</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Témoignages */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos apprenants</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Découvrez les expériences de ceux qui ont déjà suivi nos formations.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transform hover:scale-105 transition-transform duration-300 hover:shadow-xl">
            <div className="flex items-center text-yellow-500 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 italic mb-6">
              "Grâce à EMPOWER FORMATION, j'ai pu me reconvertir professionnellement en seulement 6 mois. La qualité des cours et le soutien de la communauté ont été déterminants dans ma réussite."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-semibold">Aminata Diallo</h4>
                <p className="text-gray-500 text-sm">Développeuse Web, Dakar</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transform hover:scale-105 transition-transform duration-300 hover:shadow-xl">
            <div className="flex items-center text-yellow-500 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 italic mb-6">
              "Les cours sont très bien structurés et les formateurs sont toujours disponibles pour répondre aux questions. J'ai pu développer mes compétences et trouver un emploi rapidement."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-semibold">Kofi Mensah</h4>
                <p className="text-gray-500 text-sm">Data Analyst, Accra</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos partenaires</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Nous collaborons avec des entreprises et des institutions de premier plan.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
            {[
              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-Logo.png/2560px-Meta-Logo.png"
            ].map((logo, index) => (
              <div key={index} className="flex justify-center transform hover:scale-110 transition-transform duration-300">
                <div className="w-32 h-16 bg-white p-4 rounded-md flex items-center justify-center">
                  <img src={logo} alt={`Logo partenaire ${index + 1}`} className="max-h-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Pourquoi nous rejoindre ?</h2>
            <div className="space-y-6">
              <div className="flex items-start transform hover:translate-x-2 transition-transform duration-300">
                <div className="mt-1 bg-purple-100 p-2 rounded-full mr-4">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Insertion professionnelle</h3>
                  <p className="text-gray-600">Notre réseau d'entreprises partenaires facilite votre entrée sur le marché du travail.</p>
                </div>
              </div>
              <div className="flex items-start transform hover:translate-x-2 transition-transform duration-300">
                <div className="mt-1 bg-purple-100 p-2 rounded-full mr-4">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Pédagogie innovante</h3>
                  <p className="text-gray-600">Une approche pratique basée sur des projets concrets et des situations réelles.</p>
                </div>
              </div>
              <div className="flex items-start transform hover:translate-x-2 transition-transform duration-300">
                <div className="mt-1 bg-purple-100 p-2 rounded-full mr-4">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Accessibilité</h3>
                  <p className="text-gray-600">Des formations flexibles et accessibles partout en Afrique avec un simple accès internet.</p>
                </div>
              </div>
            </div>
            <button className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-lg text-white text-lg font-semibold hover:opacity-90 transition-all duration-300 hover:shadow-lg transform hover:translate-y-1">
              S'inscrire maintenant
            </button>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-500">
          <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGFmcmljYW4lMjBzdHVkZW50c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" alt="Étudiants africains" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Prêt à transformer votre avenir ?</h2>
          <p className="text-white text-xl mb-8">
            Rejoignez notre communauté de 5000+ apprenants et développez les compétences qui feront la différence dans votre carrière.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Découvrir nos formations
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">
              Nous contacter
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;