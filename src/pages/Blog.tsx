import React from 'react';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Blog = () => {
  const articles = [
    {
      id: 1,
      title: "Réussir sa reconversion tech en 2024",
      excerpt: "Guide stratégique pour une transition réussie vers les métiers du numérique avec des conseils d'experts",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80",
      date: "15 Mars 2024",
      readTime: "5 min",
      author: "Fatoumata Diop",
      category: "Carrière",
      featured: true
    },
    {
      id: 2,
      title: "Top 10 des compétences tech incontournables",
      excerpt: "Décryptage des technologies et compétences les plus demandées par les recruteurs en 2024",
      image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
      date: "10 Mars 2024",
      readTime: "7 min",
      author: "Jean-Luc Koffi",
      category: "Technologie"
    },
    {
      id: 3,
      title: "De zéro à développeur en 6 mois : le parcours d'Aïcha",
      excerpt: "Témoignage inspirant d'une reconversion réussie grâce à nos formations intensives",
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      date: "5 Mars 2024",
      readTime: "4 min",
      author: "Aïcha Traoré",
      category: "Success Story"
    },
    {
      id: 4,
      title: "Les métiers du web qui recrutent en Afrique",
      excerpt: "Panorama des opportunités professionnelles dans le numérique sur le continent",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      date: "1 Mars 2024",
      readTime: "6 min",
      author: "Mohamed Camara",
      category: "Marché du travail"
    }
  ];

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
  featured?: boolean;
}

const FeaturedArticle = ({ article }: { article: Article }) => {
    const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

    return (
      <motion.article 
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="col-span-1 md:col-span-2 lg:col-span-3 relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-500"
      >
        <div className="relative h-96">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block px-4 py-2 bg-primary text-white rounded-full mb-4 text-sm font-medium">
                {article.category}
              </span>
              <h2 className="text-4xl font-bold text-white mb-4">{article.title}</h2>
              <div className="flex items-center gap-4 text-gray-200">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    );
  };

const ArticleCard = ({ article, index }: { article: Article; index: number }) => {
    const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

    return (
      <motion.article 
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
      >
        <div className="relative overflow-hidden h-60">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-4">
            <span className="inline-block px-3 py-1 bg-primary text-white rounded-full text-sm">
              {article.category}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{article.date}</span>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
            {article.title}
          </h2>
          
          <p className="text-gray-600 mb-6 line-clamp-3 flex-1">
            {article.excerpt}
          </p>
          
          <button className="flex items-center gap-2 text-primary hover:text-secondary font-medium w-fit group/button">
            <span>Lire l'article</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
          </button>
        </div>
      </motion.article>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Le Blog EMPOWER
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Ressources expertes, conseils pratiques et success stories pour votre évolution professionnelle
        </motion.p>
      </div>

      {/* Featured Article */}
      <div className="grid grid-cols-1 gap-8 mb-16">
        <FeaturedArticle article={articles.find(a => a.featured) || articles[0]} />
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles
          .filter(a => !a.featured)
          .map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
      </div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-16"
      >
        <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl hover:opacity-90 transition-opacity text-lg font-medium flex items-center gap-3 mx-auto group/cta">
          <span>Explorer tous les articles</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover/cta:translate-x-1" />
        </button>
      </motion.div>
    </div>
  );
};

export default Blog;