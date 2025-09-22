import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, BookOpen, Users, Award, Calendar, 
  Star, Clock, Briefcase, GraduationCap, Globe, 
  Play, ChevronRight, Check, Zap, Target 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Composant compteur animé
const AnimatedCounter = ({ end, duration = 2, label, icon }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60); // 60 fps
    
    const updateCounter = () => {
      start += increment;
      if (start < end) {
        setCount(Math.ceil(start));
        requestAnimationFrame(updateCounter);
      } else {
        setCount(end);
      }
    };
    
    controls.start({ opacity: 1, y: 0 });
    updateCounter();
  }, [end, controls, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
    >
      <div className="text-purple-600 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-4xl font-bold text-gray-900 mb-2">
        {count}+
      </h3>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  );
};

// Composant carte de formation
const CourseCard = ({ title, rating, duration, startDate, price, image, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-yellow-400 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current' : ''}`} />
          ))}
          <span className="text-gray-500 ml-2 text-sm">{rating} ({Math.floor(rating * 20)} avis)</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{title}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-4 space-x-3">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </span>
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {startDate}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-purple-600">{price} F CFA</span>
          <button className="bg-purple-100 text-purple-600 p-2 rounded-full hover:bg-purple-200 transition-colors">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Composant témoignage
const TestimonialCard = ({ quote, author, role, avatar }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
    >
      <div className="flex items-center text-yellow-400 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-current" />
        ))}
      </div>
      <p className="text-gray-600 italic mb-6 text-lg">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-purple-200">
          <img src={avatar} alt={author} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{author}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Données des témoignages
  const testimonials = [
    {
      quote: "Grâce à EMPOWER FORMATION, j'ai pu me reconvertir professionnellement en seulement 6 mois. La qualité des cours et le soutien de la communauté ont été déterminants dans ma réussite.",
      author: "Aminata Diallo",
      role: "Développeuse Web, Dakar",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      quote: "Les cours sont très bien structurés et les formateurs sont toujours disponibles pour répondre aux questions. J'ai pu développer mes compétences et trouver un emploi rapidement.",
      author: "Kofi Mensah",
      role: "Data Analyst, Accra",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  ];

  // Données des formations
  const courses = [
    {
      title: "Développement Web Full Stack",
      rating: 4.9,
      duration: "12 semaines",
      startDate: "15 mai",
      price: "350",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
    },
    {
      title: "Data Science & Intelligence Artificielle",
      rating: 4.8,
      duration: "16 semaines",
      startDate: "1er juin",
      price: "450",
      image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGF0YSUyMHNjaWVuY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
    },
    {
      title: "Marketing Digital & Growth Hacking",
      rating: 4.7,
      duration: "8 semaines",
      startDate: "10 mai",
      price: "280",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnaXRhbCUyMG1hcmtldGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    }
  ];

  // Animation pour les sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full opacity-30 transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-300 rounded-full opacity-40 transform translate-x-16 translate-y-16"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-1">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 z-10 relative"
            >
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-purple-900 leading-tight">
                  Façonnez votre <span className="text-purple-600">avenir</span>
                </h1>
                <div className="w-32 h-1 bg-purple-600"></div>
                <h2 className="text-2xl lg:text-3xl font-semibold text-purple-700">
                  avec Empower Formation
                </h2>
              </div>
              
              <div className="space-y-4 text-lg text-gray-700">
                <p className="font-medium">Des formations innovantes pour la jeunesse africaine.</p>
                <p>Développez vos compétences, réalisez vos ambitions.</p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => navigate('/catalog')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <span>Commencer maintenant</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium">
                  <Play className="h-5 w-5" />
                  <span>Voir la vidéo</span>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-6 pt-4">
                {[
                  { icon: <Check className="h-5 w-5 text-green-500" />, text: "Formations certifiantes" },
                  { icon: <Check className="h-5 w-5 text-green-500" />, text: "Experts internationaux" },
                  { icon: <Check className="h-5 w-5 text-green-500" />, text: "Flexibilité totale" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
           
            {/* Right Content - Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              {/* Logo en arrière-plan */}
              <div className="absolute top-[-20%] left-[5%] w-full h-full flex justify-center items-start">
                <img
                  src="/asset/LOGO EMPOWER FORMATION/Symbol EF.jpg"
                  alt="Logo Empower Formation"
                  className="w-100/120 md:w-100/120 opacity-20 object-contain"
                />
              </div>

              {/* Image principale */}
              <div className="relative overflow-hidden rounded-xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <img
                  src="/asset/femme.png"
                  alt="Femme africaine étudiant avec ordinateur portable"
                  className="w-full h-auto object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="text-white">
                    <h3 className="font-bold text-lg mb-1">Formation en cours</h3>
                    <p className="text-sm opacity-90">Développement Web Full Stack</p>
                    <div className="w-full bg-white/30 h-1 mt-2 rounded-full">
                      <div className="bg-purple-500 h-1 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistiques Animées */}
      <section ref={ref} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Notre impact en chiffres</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez comment nous transformons l'apprentissage et créons de nouvelles opportunités à travers l'Afrique.
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
          >
            <motion.div variants={itemVariants}>
              <AnimatedCounter 
                end={5000} 
                label="Apprenants formés" 
                icon={<Users className="h-10 w-10 mx-auto" />} 
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <AnimatedCounter 
                end={50} 
                label="Formations disponibles" 
                icon={<BookOpen className="h-10 w-10 mx-auto" />} 
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <AnimatedCounter 
                end={95} 
                label="Taux de satisfaction" 
                icon={<Star className="h-10 w-10 mx-auto" />} 
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <AnimatedCounter 
                end={20} 
                label="Pays représentés" 
                icon={<Globe className="h-10 w-10 mx-auto" />} 
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Pourquoi choisir EMPOWER FORMATION ?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Notre approche innovante combine expertise pédagogique et technologies avancées pour une expérience d'apprentissage optimale.</p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {[
            {
              icon: <BookOpen className="h-8 w-8 text-purple-600" />,
              title: "Formations de qualité",
              description: "Des cours conçus par des experts pour développer vos compétences professionnelles"
            },
            {
              icon: <Users className="h-8 w-8 text-purple-600" />,
              title: "Communauté active",
              description: "Rejoignez une communauté dynamique d'apprenants et d'experts"
            },
            {
              icon: <Award className="h-8 w-8 text-purple-600" />,
              title: "Certificats reconnus",
              description: "Obtenez des certificats valorisants pour votre carrière"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="text-center space-y-4 p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Formations populaires */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Nos formations les plus populaires</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Découvrez nos formations les plus demandées par les professionnels et les entreprises.</p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courses.map((course, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
            >
              <CourseCard 
                {...course}
                onClick={() => navigate('/course-details')}
              />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button 
            onClick={() => navigate('/catalog')}
            className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center space-x-2 mx-auto hover:translate-x-2"
          >
            <span>Voir toutes nos formations</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </section>

      {/* Témoignages */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos apprenants</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Découvrez les expériences de ceux qui ont déjà suivi nos formations.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <TestimonialCard {...testimonials[activeTestimonial]} />
            </motion.div>
          </AnimatePresence>
          
          <div className="space-y-8">
            {testimonials.map((_, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-lg cursor-pointer transition-colors ${activeTestimonial === index ? 'bg-purple-600 text-white' : 'bg-white shadow-md'}`}
                onClick={() => setActiveTestimonial(index)}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full overflow-hidden mr-4 border-2 ${activeTestimonial === index ? 'border-white' : 'border-purple-200'}`}>
                    <img src={testimonials[index].avatar} alt={testimonials[index].author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${activeTestimonial === index ? 'text-white' : 'text-gray-900'}`}>
                      {testimonials[index].author}
                    </h4>
                    <p className={`text-sm ${activeTestimonial === index ? 'text-white/80' : 'text-gray-500'}`}>
                      {testimonials[index].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Nous collaborons avec des entreprises et des institutions de premier plan.</p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center"
          >
            {[
              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-Logo.png/2560px-Meta-Logo.png"
            ].map((logo, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                className="flex justify-center"
              >
                <div className="w-32 h-16 bg-white p-4 rounded-md flex items-center justify-center">
                  <img src={logo} alt={`Logo partenaire ${index + 1}`} className="max-h-full" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Avantages */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="text-3xl font-bold mb-6">Pourquoi nous rejoindre ?</h2>
            <div className="space-y-6">
              {[
                {
                  icon: <Briefcase className="h-6 w-6 text-purple-600" />,
                  title: "Insertion professionnelle",
                  description: "Notre réseau d'entreprises partenaires facilite votre entrée sur le marché du travail."
                },
                {
                  icon: <GraduationCap className="h-6 w-6 text-purple-600" />,
                  title: "Pédagogie innovante",
                  description: "Une approche pratique basée sur des projets concrets et des situations réelles."
                },
                {
                  icon: <Globe className="h-6 w-6 text-purple-600" />,
                  title: "Accessibilité",
                  description: "Des formations flexibles et accessibles partout en Afrique avec un simple accès internet."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ x: 10 }}
                  className="flex items-start"
                >
                  <div className="mt-1 bg-purple-100 p-2 rounded-full mr-4">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-lg text-white text-lg font-semibold hover:shadow-lg transition-all"
            >
              S'inscrire maintenant
            </motion.button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden shadow-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGFmcmljYW4lMjBzdHVkZW50c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" 
              alt="Étudiants africains" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-6"
          >
            Prêt à transformer votre avenir ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white text-xl mb-8"
          >
            Rejoignez notre communauté de 5000+ apprenants et développez les compétences qui feront la différence dans votre carrière.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/formations')}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Découvrir nos formations
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all"
            >
              Nous contacter
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;