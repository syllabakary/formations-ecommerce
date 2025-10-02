// components/FormationManagement.tsx - Version corrigée avec saisie manuelle
import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Edit, Trash2, Wifi, Building, Calendar,
  MapPin, Save, X, Loader2, AlertCircle, CheckCircle, Link, Video
} from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { apiService } from '../services/apiService';

// Types
interface Formation {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image?: string;
  category: { id: number; name: string; };
  trainer_name: string; // Changé de trainer: { id, name } à trainer_name
  price: number;
  original_price?: number;
  formatted_price: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Formations en ligne
  level?: string;
  type?: string;
  difficulty?: string;
  duration_hours?: number;
  skills?: string[];
  total_students?: number;
  is_trending?: boolean;
  is_bestseller?: boolean;
  is_new?: boolean;
  access_link?: string;
  video_url?: string;
  
  // Formations en présentiel
  city_name?: string; // Changé de city: { id, name } à city_name
  duration_days?: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  venue_name?: string;
  venue_address?: string;
  max_seats?: number;
  registered_seats?: number;
  available_seats?: number;
  status?: string;
  is_popular?: boolean;
  registration_deadline?: string;
}

interface FormDataInterface {
  title: string;
  short_description: string;
  description: string;
  category_id: number;
  trainer_name: string;
  price: number;
  original_price?: number;
  is_active: boolean;

  // Formations en ligne
  level?: string;
  type?: string;
  difficulty?: string;
  duration_hours?: number;
  skills?: string[];
  is_trending?: boolean;
  is_bestseller?: boolean;
  is_new?: boolean;
  access_link?: string;
  video_url?: string;

  // Formations en présentiel
  city_name?: string;
  duration_days?: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  venue_name?: string;
  venue_address?: string;
  max_seats?: number;
  status?: string;
  is_popular?: boolean;
  registration_deadline?: string;
}

// Modal de formation
const FormationModal = ({ 
  isOpen, onClose, mode, formation, onSave 
}: {
  isOpen: boolean;
  onClose: () => void;
  mode: 'online' | 'in-person';
  formation?: Formation;
  onSave: (formData: FormDataInterface, imageFile?: File) => Promise<void>;
}) => {
  const [formData, setFormData] = useState<FormDataInterface>({
    title: '', 
    short_description: '', 
    description: '',
    category_id: 0, 
    trainer_name: '', // Changé
    price: 0, 
    is_active: true,
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{id: number; name: string;}[]>([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (isOpen) loadFormData();
  }, [isOpen, mode]);

  useEffect(() => {
    if (formation) {
      initializeFormData(formation);
    } else {
      resetFormData();
    }
  }, [formation, mode]);

  const loadFormData = async () => {
    try {
      const response = await apiService.getFormData(mode);
      if (response.success) {
        setCategories(response.data.categories || []);
        // Supprimé: chargement des trainers et cities
      }
    } catch (error) {
      console.error('Erreur chargement form data:', error);
    }
  };

  const initializeFormData = (formation: Formation) => {
    const baseData = {
      title: formation.title,
      short_description: formation.short_description,
      description: formation.description,
      category_id: formation.category.id,
      trainer_name: formation.trainer_name || '', // Changé
      price: formation.price,
      original_price: formation.original_price,
      is_active: formation.is_active,
    };

    if (mode === 'online') {
      setFormData({
        ...baseData,
        level: formation.level || 'debutant',
        type: formation.type || 'formation',
        difficulty: formation.difficulty || 'facile',
        duration_hours: formation.duration_hours || 1,
        skills: formation.skills || [],
        is_trending: formation.is_trending || false,
        is_bestseller: formation.is_bestseller || false,
        is_new: formation.is_new || false,
        access_link: formation.access_link || '',
        video_url: formation.video_url || '',
      });
    } else {
      setFormData({
        ...baseData,
        city_name: formation.city_name || '', // Changé
        duration_days: formation.duration_days || 1,
        start_date: formation.start_date?.split('T')[0] || '',
        end_date: formation.end_date?.split('T')[0] || '',
        start_time: formation.start_time || '09:00',
        end_time: formation.end_time || '17:00',
        venue_name: formation.venue_name || '',
        venue_address: formation.venue_address || '',
        max_seats: formation.max_seats || 20,
        status: formation.status || 'scheduled',
        is_popular: formation.is_popular || false,
        registration_deadline: formation.registration_deadline?.split('T')[0] || '',
      });
    }

    if (formation.image) setImagePreview(formation.image);
  };

  const resetFormData = () => {
    const baseData = {
      title: '', 
      short_description: '', 
      description: '',
      category_id: 0, 
      trainer_name: '', // Changé
      price: 0, 
      is_active: true,
    };

    if (mode === 'online') {
      setFormData({
        ...baseData,
        level: 'debutant', 
        type: 'formation', 
        difficulty: 'facile', 
        duration_hours: 1, 
        skills: [], 
        is_trending: false, 
        is_bestseller: false, 
        is_new: false,
        access_link: '', 
        video_url: '',
      });
    } else {
      setFormData({
        ...baseData,
        city_name: '', // Changé
        duration_days: 1, 
        start_date: '', 
        end_date: '',
        start_time: '09:00', 
        end_time: '17:00', 
        venue_name: '', 
        venue_address: '',
        max_seats: 20, 
        status: 'scheduled', 
        is_popular: false,
      });
    }

    setImagePreview('');
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation avant envoi
    if (!formData.title.trim()) {
      alert('Le titre est requis');
      return;
    }
    if (!formData.trainer_name.trim()) {
      alert('Le nom du formateur est requis');
      return;
    }
    if (formData.category_id === 0) {
      alert('La catégorie est requise');
      return;
    }
    if (mode === 'in-person' && !formData.city_name?.trim()) {
      alert('Le lieu de formation est requis');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Données envoyées:', formData); // Pour debug
      await onSave(formData, imageFile || undefined);
      onClose();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            {mode === 'online' ? (
              <Wifi className="h-6 w-6 text-blue-600" />
            ) : (
              <Building className="h-6 w-6 text-purple-600" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {formation ? 'Modifier' : 'Nouvelle'} Formation {mode === 'online' ? 'en Ligne' : 'en Présentiel'}
              </h2>
              <p className="text-gray-600">
                {mode === 'online' ? 'Cours vidéo accessible 24/7' : 'Session avec date et lieu fixés'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Body avec formulaire */}
        <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Informations de base */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations générales</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Titre de la formation *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Développement Web Full Stack"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie *</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, category_id: Number(e.target.value) }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>Sélectionner une catégorie</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Formateur - SAISIE MANUELLE */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom du formateur *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.trainer_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, trainer_name: e.target.value }))}
                      placeholder="Saisir le nom du formateur"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (F CFA) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 89500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Prix original (F CFA)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.original_price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, original_price: Number(e.target.value) || undefined }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 125000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description courte *</label>
                  <textarea
                    required
                    rows={2}
                    maxLength={500}
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Résumé accrocheur de la formation (max 500 caractères)..."
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {formData.short_description.length}/500
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description complète *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Description détaillée du contenu, objectifs et méthodes..."
                  />
                </div>
              </div>
            </div>

            {/* Spécificités selon le mode */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {mode === 'online' ? 'Paramètres du cours en ligne' : 'Informations de session'}
              </h3>

              {mode === 'online' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Niveau *</label>
                      <select
                        required
                        value={formData.level || 'debutant'}
                        onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="debutant">Débutant</option>
                        <option value="intermediaire">Intermédiaire</option>
                        <option value="avance">Avancé</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                      <select
                        required
                        value={formData.type || 'formation'}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="formation">Formation</option>
                        <option value="certification">Certification</option>
                        <option value="specialisation">Spécialisation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Durée (heures) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.duration_hours || 1}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: Number(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Liens d'accès */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Lien d'accès au cours
                      </label>
                      <input
                        type="url"
                        value={formData.access_link || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, access_link: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://platform.example.com/course/123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        URL de la vidéo principale
                      </label>
                      <input
                        type="url"
                        value={formData.video_url || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>

                  {/* Compétences */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Compétences enseignées</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ajouter une compétence..."
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Ajouter
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-blue-600 hover:text-red-600 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Lieu - SAISIE MANUELLE */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Lieu de formation *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city_name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, city_name: e.target.value }))}
                        placeholder="Saisir le lieu de formation"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Durée (jours) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="30"
                        value={formData.duration_days || 1}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration_days: Number(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date de début *</label>
                      <input
                        type="date"
                        required
                        value={formData.start_date || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin *</label>
                      <input
                        type="date"
                        required
                        value={formData.end_date || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Heure début *</label>
                      <input
                        type="time"
                        required
                        value={formData.start_time || '09:00'}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Heure fin *</label>
                      <input
                        type="time"
                        required
                        value={formData.end_time || '17:00'}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Places max *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.max_seats || 20}
                        onChange={(e) => setFormData(prev => ({ ...prev, max_seats: Number(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lieu de formation *</label>
                    <input
                      type="text"
                      required
                      value={formData.venue_name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, venue_name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
                      placeholder="Nom du centre de formation..."
                    />
                    <input
                      type="text"
                      value={formData.venue_address || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, venue_address: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Adresse complète..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Statut *</label>
                      <select
                        required
                        value={formData.status || 'scheduled'}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="scheduled">Programmé</option>
                        <option value="ongoing">En cours</option>
                        <option value="completed">Terminé</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date limite d'inscription
                      </label>
                      <input
                        type="date"
                        value={formData.registration_deadline || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, registration_deadline: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image de la formation
              </label>
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Formats supportés: JPG, PNG, WEBP. Taille max: 2MB
                  </p>
                </div>
                {imagePreview && (
                  <div className="h-20 w-20 rounded-lg overflow-hidden border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                </div>
            </div>

            {/* Options supplémentaires */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mode === 'online' ? (
                <>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_trending"
                      checked={formData.is_trending || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_trending: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor="is_trending" className="ml-2 text-sm font-medium text-gray-700">
                      Formation tendance
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_bestseller"
                      checked={formData.is_bestseller || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_bestseller: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor="is_bestseller" className="ml-2 text-sm font-medium text-gray-700">
                      Best-seller
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_new"
                      checked={formData.is_new || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_new: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor="is_new" className="ml-2 text-sm font-medium text-gray-700">
                      Nouvelle formation
                    </label>
                  </div>
                </>
              ) : (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_popular"
                    checked={formData.is_popular || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_popular: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="is_popular" className="ml-2 text-sm font-medium text-gray-700">
                    Formation populaire
                  </label>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                  Formation active
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {formation ? 'Mettre à jour' : 'Créer la formation'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant principal Formations
const FormationManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeMode, setActiveMode] = useState<'online' | 'in-person'>('online');
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10
  });

  const loadFormations = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        per_page: 10
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;

      const response = await apiService.getFormations(activeMode, params);
      
      if (response.success) {
        setFormations(response.data.data || []);
        setPagination({
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          total: response.data.total || 0,
          per_page: response.data.per_page || 10
        });
      }
    } catch (err: unknown) {
      console.error('Erreur chargement formations:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur lors du chargement');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFormations();
  }, [activeMode, searchTerm, selectedCategory, selectedStatus, currentPage]);

  // Vérification de l'authentification
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Accès non autorisé</h2>
          <p className="text-gray-600">Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }



  const handleSave = async (formData: FormDataInterface, imageFile?: File) => {
    try {
      console.log('Envoi des données:', formData); // Debug
      
      if (editingFormation) {
        const response = await apiService.updateFormation(activeMode, editingFormation.id, formData, imageFile);
        if (response.success) {
          setSuccess('Formation mise à jour avec succès');
        }
      } else {
        const response = await apiService.createFormation(activeMode, formData, imageFile);
        if (response.success) {
          setSuccess('Formation créée avec succès');
        }
      }
      
      await loadFormations();
      setShowModal(false);
      setEditingFormation(null);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = errorObj?.response?.data?.message || (err as Error)?.message || 'Erreur lors de la sauvegarde';
      setError(errorMessage);
      console.error('Erreur détaillée:', errorObj?.response?.data);
      setTimeout(() => setError(null), 5000);
      throw err;
    }
  };

  const handleDelete = async (formation: Formation) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${formation.title}" ?`)) {
      try {
        const response = await apiService.deleteFormation(activeMode, formation.id);
        if (response.success) {
          setSuccess('Formation supprimée avec succès');
        }
        
        await loadFormations();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleCreateNew = () => {
    setEditingFormation(null);
    setShowModal(true);
  };

  const handleEdit = (formation: Formation) => {
    setEditingFormation(formation);
    setShowModal(true);
  };

  const getStatusBadge = (formation: Formation) => {
    if (activeMode === 'online') {
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          formation.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {formation.is_active ? 'Active' : 'Inactive'}
        </span>
      );
    } else {
      const statusConfig: { [key: string]: { bg: string; text: string; label: string } } = {
        scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Programmé' },
        ongoing: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En cours' },
        completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Terminé' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Annulé' }
      };

      const config = statusConfig[formation.status || 'scheduled'] || statusConfig.scheduled;
      
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Messages d'état */}
        {error && (
          <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="ml-2 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Formations</h1>
              <p className="text-gray-600 mt-2">
                Gérez vos formations en ligne et en présentiel - Connecté en tant que {user?.name}
              </p>
            </div>
            
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5" />
              Nouvelle formation
            </button>
          </div>

          {/* Mode selector */}
          <div className="flex bg-white rounded-lg p-1 shadow-sm border w-fit">
            <button
              onClick={() => setActiveMode('online')}
              className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all ${
                activeMode === 'online'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Wifi className="h-4 w-4" />
              Formations en ligne
            </button>
            <button
              onClick={() => setActiveMode('in-person')}
              className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all ${
                activeMode === 'in-person'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building className="h-4 w-4" />
              Formations en présentiel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les catégories</option>
            </select>

            {activeMode === 'in-person' && (
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="scheduled">Programmé</option>
                <option value="ongoing">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            )}

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedStatus('');
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Table des formations */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="inline-block w-8 h-8 text-blue-600 animate-spin" />
              <p className="mt-4 text-gray-600">Chargement des formations...</p>
            </div>
          ) : formations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune formation trouvée</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory || selectedStatus
                  ? 'Aucune formation ne correspond à vos critères de recherche.'
                  : 'Commencez par créer votre première formation.'
                }
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
              >
                Créer une formation
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Formation
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Formateur
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      {activeMode === 'in-person' && (
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lieu/Date
                        </th>
                      )}
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formations.map((formation) => (
                      <tr key={formation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-lg bg-gray-200 mr-4 overflow-hidden flex-shrink-0">
                              {formation.image ? (
                                <img
                                  src={formation.image}
                                  alt={formation.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-400">
                                  <span className="text-white font-bold text-xs">
                                    {formation.title.substring(0, 2).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {formation.title}
                              </div>
                              {activeMode === 'online' && formation.skills && (
                                <div className="flex gap-1 mt-1">
                                  {formation.skills.slice(0, 2).map((skill, idx) => (
                                    <span key={idx} className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                                      {skill}
                                    </span>
                                  ))}
                                  {formation.skills.length > 2 && (
                                    <span className="text-xs text-gray-400">+{formation.skills.length - 2}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formation.trainer_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formation.category.name}
                        </td>
                        {activeMode === 'in-person' && (
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1 mb-1">
                              <MapPin className="h-3 w-3" />
                              <span>{formation.city_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span className="text-xs">
                                {formation.start_date ? new Date(formation.start_date).toLocaleDateString('fr-FR') : '-'}
                              </span>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {formation.formatted_price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(formation)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleEdit(formation)}
                              className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(formation)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="bg-white px-4 py-3 border-t sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Page {pagination.current_page} sur {pagination.last_page} ({pagination.total} résultats)
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Précédent
                      </button>
                      
                      {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                        const pageNum = Math.max(1, currentPage - 2) + i;
                        if (pageNum > pagination.last_page) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 rounded-md text-sm ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(pagination.last_page, currentPage + 1))}
                        disabled={currentPage === pagination.last_page}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal de création/édition */}
        <FormationModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingFormation(null);
          }}
          mode={activeMode}
          formation={editingFormation || undefined}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default FormationManagement;