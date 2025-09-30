import React from 'react';
import { ArrowRight, BookOpen, Users, Award, Calendar, Star, Clock, Briefcase, GraduationCap, Globe, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';


const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div>
          <img 
  src="Public/asset/LOGO EMPOWER FORMATION/LOGO EF - 1 - blanc.png" 
  alt="Logo Empower Formation"
  className="h-auto w-auto max-h-14 md:max-h-20 lg:max-h-24 object-contain"
/>            <p className="text-gray-400 mb-6">
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
              <li><button onClick={() => navigate('/formations/developpement-web')} className="text-gray-400 hover:text-white transition-colors text-left w-full">Développement Web</button></li>
              <li><button onClick={() => navigate('/formations/data-science')} className="text-gray-400 hover:text-white transition-colors text-left w-full">Data Science & IA</button></li>
              <li><button onClick={() => navigate('/formations/marketing-digital')} className="text-gray-400 hover:text-white transition-colors text-left w-full">Marketing Digital</button></li>
              <li><button onClick={() => navigate('/formations/design-uxui')} className="text-gray-400 hover:text-white transition-colors text-left w-full">Design UX/UI</button></li>
              <li><button onClick={() => navigate('/formations/gestion-projet')} className="text-gray-400 hover:text-white transition-colors text-left w-full">Gestion de Projet</button></li>
              <li><button onClick={() => navigate('/formations/cybersecurite')} className="text-gray-400 hover:text-white transition-colors text-left w-full">Cybersécurité</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Liens Utiles</h3>
            <ul className="space-y-3">
              <li><button onClick={() => navigate('/apropos')} className="text-gray-400 hover:text-white transition-colors text-left w-full">À propos de nous</button></li>
              <li><button onClick={() => navigate('/blog')} className="text-gray-400 hover:text-white transition-colors text-left w-full">Blog</button></li>
              <li><button onClick={() => navigate('/contacts')} className="text-gray-400 hover:text-white transition-colors text-left w-full">Contactez-nous</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-purple-400 mt-1" />
                <span className="text-gray-400">l</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-purple-400" />
                <a href="tel:+221761234567" className="text-gray-400 hover:text-white">+221 76 123 45 67</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-purple-400" />
                <a href="mailto:contact@empower-formation.com" className="text-gray-400 hover:text-white">contact@empower-formation.com</a>
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
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <button onClick={() => navigate('/conditions-utilisation')} className="text-gray-500 text-sm hover:text-white transition-colors">Conditions d'utilisation</button>
              <button onClick={() => navigate('/politique-confidentialite')} className="text-gray-500 text-sm hover:text-white transition-colors">Politique de confidentialité</button>
              <button onClick={() => navigate('/mentions-legales')} className="text-gray-500 text-sm hover:text-white transition-colors">Mentions légales</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
