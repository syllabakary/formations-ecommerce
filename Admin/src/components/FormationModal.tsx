import React, { useState, useEffect } from 'react';
import { Formation } from '../types';
import Modal from './Modal';
import { Save, Upload } from 'lucide-react';

interface FormationModalProps {
  isOpen: boolean;
  onClose: () => void;
  formation?: Formation;
  onSave: (formation: Omit<Formation, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const FormationModal: React.FC<FormationModalProps> = ({ isOpen, onClose, formation, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Design',
    level: 'Débutant',
    type: 'Formation',
    price: 0,
    originalPrice: 0,
    image: '',
    description: '',
    duration: '',
    students: 0,
    rating: 0,
    reviews: 0,
    instructor: '',
    modules: 0,
    skills: [] as string[],
    trending: false,
    bestseller: false,
    progress: 0,
    difficulty: 'Facile',
    status: 'Brouillon' as const
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (formation) {
      setFormData({
        title: formation.title,
        category: formation.category,
        level: formation.level,
        type: formation.type,
        price: formation.price,
        originalPrice: formation.originalPrice,
        image: formation.image,
        description: formation.description,
        duration: formation.duration,
        students: formation.students,
        rating: formation.rating,
        reviews: formation.reviews,
        instructor: formation.instructor,
        modules: formation.modules,
        skills: formation.skills,
        trending: formation.trending,
        bestseller: formation.bestseller,
        progress: formation.progress,
        difficulty: formation.difficulty,
        status: formation.status
      });
    } else {
      setFormData({
        title: '',
        category: 'Design',
        level: 'Débutant',
        type: 'Formation',
        price: 0,
        originalPrice: 0,
        image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: '',
        duration: '',
        students: 0,
        rating: 0,
        reviews: 0,
        instructor: '',
        modules: 0,
        skills: [],
        trending: false,
        bestseller: false,
        progress: 0,
        difficulty: 'Facile',
        status: 'Brouillon'
      });
    }
  }, [formation, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formation ? 'Modifier la Formation' : 'Nouvelle Formation'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Titre */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la formation *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              placeholder="Ex: Design UX/UI Moderne"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
            >
              <option value="Design">Design</option>
              <option value="Développement">Développement</option>
              <option value="Marketing">Marketing</option>
              <option value="Business">Business</option>
              <option value="Data Science">Data Science</option>
            </select>
          </div>

          {/* Niveau */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau *
            </label>
            <select
              required
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
            >
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
            </select>
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix (en centimes) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              placeholder="Ex: 41750 (pour 417.50€)"
            />
          </div>

          {/* Prix original */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix original (en centimes)
            </label>
            <input
              type="number"
              min="0"
              value={formData.originalPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: parseInt(e.target.value) || 0 }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              placeholder="Ex: 59700 (pour 597.00€)"
            />
          </div>

          {/* Instructeur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructeur *
            </label>
            <input
              type="text"
              required
              value={formData.instructor}
              onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              placeholder="Ex: Emma Rodriguez"
            />
          </div>

          {/* Durée */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée *
            </label>
            <input
              type="text"
              required
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              placeholder="Ex: 28h"
            />
          </div>

          {/* Modules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de modules *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.modules}
              onChange={(e) => setFormData(prev => ({ ...prev, modules: parseInt(e.target.value) || 0 }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              placeholder="Ex: 9"
            />
          </div>

          {/* Difficulté */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulté *
            </label>
            <select
              required
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
            >
              <option value="Facile">Facile</option>
              <option value="Moyen">Moyen</option>
              <option value="Difficile">Difficile</option>
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Publié' | 'Brouillon' | 'Archivé' }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
            >
              <option value="Brouillon">Brouillon</option>
              <option value="Publié">Publié</option>
              <option value="Archivé">Archivé</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              placeholder="Décrivez le contenu et les objectifs de la formation..."
            />
          </div>

          {/* Compétences */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compétences enseignées
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
                placeholder="Ajouter une compétence..."
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-3 bg-[#A553C4] text-white rounded-lg hover:bg-[#6636DD] transition-colors"
              >
                Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-[#A553C4]/10 text-[#A553C4] rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-[#A553C4] hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="md:col-span-2">
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.trending}
                  onChange={(e) => setFormData(prev => ({ ...prev, trending: e.target.checked }))}
                  className="mr-2 text-[#A553C4] focus:ring-[#A553C4]"
                />
                <span className="text-sm text-gray-700">Formation tendance</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.bestseller}
                  onChange={(e) => setFormData(prev => ({ ...prev, bestseller: e.target.checked }))}
                  className="mr-2 text-[#A553C4] focus:ring-[#A553C4]"
                />
                <span className="text-sm text-gray-700">Bestseller</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <Save className="w-5 h-5" />
            <span className="font-medium">
              {formation ? 'Mettre à jour' : 'Créer la formation'}
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormationModal;