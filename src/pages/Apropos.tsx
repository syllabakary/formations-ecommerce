import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Award, Globe, ArrowRight, Heart, Target, Lightbulb, Trophy, Star, Clock, Calendar, CheckCircle, GraduationCap, Briefcase } from 'lucide-react';

// Composant compteur animé pour les statistiques
const AnimatedCounter = ({ end, label, icon }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
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

const AboutPage = () => {
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
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center py-20 overflow-hidden"
        style={{
            backgroundImage: "url('Public/asset/femme.png')"
        }}
        >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-purple-800/50 to-purple-700/40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full opacity-40 transform -translate-x-16 translate-y-16"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-white lg:text-6xl font-bold text-purple-900 mb-6">
              À propos d'Empower Formation
            </h1>
            <div className="w-32 h-1 bg-purple-600 mx-auto mb-8"></div>
            <p className="text-white text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Nous façonnons l'avenir de la jeunesse africaine à travers des formations innovantes 
              qui développent les compétences et réalisent les ambitions.
            </p>
          </div>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Notre Mission</h2>
              <div className="space-y-6 text-lg text-gray-700">
                <p>
                  Chez <span className="font-semibold text-purple-600">Empower Formation</span>, 
                  nous croyons fermement que chaque jeune africain mérite d'avoir accès à une éducation 
                  de qualité qui lui permette de réaliser son plein potentiel.
                </p>
                <p>
                  Notre mission est de démocratiser l'accès aux compétences du futur en proposant 
                  des formations innovantes, pratiques et adaptées aux besoins du marché du travail africain.
                </p>
                <div className="flex items-center space-x-4 mt-8">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">Notre Objectif</h3>
                    <p className="text-gray-600">Transformer l'apprentissage en opportunités concrètes</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" 
                  alt="Équipe de formation" 
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les principes qui guident notre approche pédagogique et notre engagement envers nos apprenants.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Innovation</h3>
              <p className="text-gray-600">
                Nous adoptons les dernières technologies et méthodes pédagogiques pour offrir une expérience d'apprentissage moderne.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Accessibilité</h3>
              <p className="text-gray-600">
                Nos formations sont conçues pour être accessibles à tous, partout en Afrique, avec un simple accès internet.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Excellence</h3>
              <p className="text-gray-600">
                Nous visons l'excellence dans tout ce que nous faisons, de la conception des cours à l'accompagnement des apprenants.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Communauté</h3>
              <p className="text-gray-600">
                Nous créons une communauté d'apprenants solidaires qui s'entraident et grandissent ensemble.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section id="stats-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Notre Impact en Chiffres</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez comment nous transformons l'apprentissage et créons de nouvelles opportunités à travers l'Afrique.
            </p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
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

      {/* Notre Approche */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Approche Pédagogique</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une méthode d'apprentissage innovante qui combine théorie et pratique pour garantir votre réussite professionnelle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Formations de Qualité</h3>
              <p className="text-gray-600 leading-relaxed">
                Des cours conçus par des experts du domaine, constamment mis à jour pour refléter 
                les dernières tendances et technologies du marché.
              </p>
            </div>
            
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Communauté Active</h3>
              <p className="text-gray-600 leading-relaxed">
                Rejoignez une communauté dynamique d'apprenants, de mentors et d'experts 
                qui vous accompagnent tout au long de votre parcours.
              </p>
            </div>
            
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Certificats Reconnus</h3>
              <p className="text-gray-600 leading-relaxed">
                Obtenez des certifications valorisantes reconnues par les entreprises 
                et qui boostent votre carrière professionnelle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" 
                  alt="Étudiants africains" 
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Pourquoi Choisir Empower Formation ?</h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
                  <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Insertion Professionnelle</h3>
                    <p className="text-gray-600">
                      Notre réseau d'entreprises partenaires facilite votre entrée sur le marché du travail 
                      avec des opportunités concrètes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
                  <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                    <GraduationCap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Pédagogie Innovante</h3>
                    <p className="text-gray-600">
                      Une approche pratique basée sur des projets concrets et des situations réelles 
                      du monde professionnel.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
                  <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Accessibilité Totale</h3>
                    <p className="text-gray-600">
                      Des formations flexibles et accessibles partout en Afrique avec un simple accès internet, 
                      à des tarifs abordables.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ce Que Disent Nos Apprenants</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les expériences transformatrices de ceux qui ont déjà rejoint la famille Empower Formation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="flex items-center text-yellow-500 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-lg italic mb-6 leading-relaxed">
                "Grâce à EMPOWER FORMATION, j'ai pu me reconvertir professionnellement en seulement 6 mois. 
                La qualité des cours et le soutien de la communauté ont été déterminants dans ma réussite."
              </p>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                  <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Aminata Diallo</h4>
                  <p className="text-purple-600 font-medium">Développeuse Web, Dakar</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="flex items-center text-yellow-500 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-lg italic mb-6 leading-relaxed">
                "Les cours sont très bien structurés et les formateurs sont toujours disponibles pour répondre aux questions. 
                J'ai pu développer mes compétences et trouver un emploi rapidement."
              </p>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Kofi Mensah</h4>
                  <p className="text-purple-600 font-medium">Data Analyst, Accra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Rejoignez la Révolution de l'Apprentissage
          </h2>
          <p className="text-white text-xl mb-8 leading-relaxed">
            Faites partie des 5000+ apprenants qui ont déjà transformé leur avenir avec Empower Formation. 
            Votre réussite commence aujourd'hui !
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Découvrir nos formations
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105">
              Nous contacter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;