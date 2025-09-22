import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Save, Loader2 } from 'lucide-react';

// Types alignés avec l'API Laravel
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'Étudiant' | 'Instructeur' | 'Admin';
  status: 'Actif' | 'Inactif' | 'Suspendu';
  avatar: string;
  join_date: string;
  courses_enrolled?: number;
  courses_completed?: number;
  courses_created?: number;
  last_active: string;
  created_at: string;
  updated_at: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSave: (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; message?: string }>;
  isSubmitting?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onSave, 
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Étudiant' as const,
    status: 'Actif' as const,
    avatar: '',
    join_date: new Date().toISOString().split('T')[0],
    last_active: 'Il y a quelques instants',
    courses_enrolled: 0,
    courses_completed: 0,
    courses_created: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLocalSubmitting, setIsLocalSubmitting] = useState(false);

  // Réinitialiser le formulaire quand l'utilisateur change ou quand la modal s'ouvre/ferme
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        avatar: user.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        join_date: user.join_date,
        last_active: user.last_active,
        courses_enrolled: user.courses_enrolled || 0,
        courses_completed: user.courses_completed || 0,
        courses_created: user.courses_created || 0,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Étudiant',
        status: 'Actif',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        join_date: new Date().toISOString().split('T')[0],
        last_active: 'Il y a quelques instants',
        courses_enrolled: 0,
        courses_completed: 0,
        courses_created: 0,
      });
    }
    setErrors({});
  }, [user, isOpen]);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est obligatoire';
    }

    if (formData.avatar && !/^https?:\/\/.+/.test(formData.avatar)) {
      newErrors.avatar = 'L\'URL de l\'avatar n\'est pas valide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLocalSubmitting(true);
    
    try {
      const result = await onSave(formData);
      
      if (result.success) {
        onClose();
      } else if (result.message) {
        // Afficher l'erreur générale
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Une erreur inattendue s\'est produite' });
    } finally {
      setIsLocalSubmitting(false);
    }
  };

  const isSubmittingState = isSubmitting || isLocalSubmitting;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Erreur générale */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ex: Marie Dubois"
              disabled={isSubmittingState}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ex: marie.dubois@email.com"
              disabled={isSubmittingState}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent ${
                errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ex: +225 12 34 56 78"
              disabled={isSubmittingState}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle *
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value as 'Étudiant' | 'Instructeur' | 'Admin')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              disabled={isSubmittingState}
            >
              <option value="Étudiant">Étudiant</option>
              <option value="Instructeur">Instructeur</option>
              <option value="Admin">Admin</option>
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
              onChange={(e) => handleInputChange('status', e.target.value as 'Actif' | 'Inactif' | 'Suspendu')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              disabled={isSubmittingState}
            >
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="Suspendu">Suspendu</option>
            </select>
          </div>

          {/* Date d'inscription */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d'inscription
            </label>
            <input
              type="date"
              value={formData.join_date}
              onChange={(e) => handleInputChange('join_date', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              disabled={isSubmittingState}
            />
          </div>

          {/* Statistiques pour étudiants */}
          {formData.role === 'Étudiant' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formations inscrites
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.courses_enrolled}
                  onChange={(e) => handleInputChange('courses_enrolled', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
                  disabled={isSubmittingState}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formations terminées
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.courses_enrolled}
                  value={formData.courses_completed}
                  onChange={(e) => handleInputChange('courses_completed', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
                  disabled={isSubmittingState}
                />
              </div>
            </>
          )}

          {/* Statistiques pour instructeurs */}
          {formData.role === 'Instructeur' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formations créées
              </label>
              <input
                type="number"
                min="0"
                value={formData.courses_created}
                onChange={(e) => handleInputChange('courses_created', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
                disabled={isSubmittingState}
              />
            </div>
          )}

          {/* URL Avatar */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de l'avatar
            </label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => handleInputChange('avatar', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent ${
                errors.avatar ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="https://example.com/avatar.jpg"
              disabled={isSubmittingState}
            />
            {errors.avatar && <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>}
            
            {formData.avatar && (
              <div className="mt-2">
                <img
                  src={formData.avatar}
                  alt="Aperçu"
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isSubmittingState}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmittingState}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmittingState ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span className="font-medium">
              {isSubmittingState
                ? (user ? 'Mise à jour...' : 'Création...')
                : (user ? 'Mettre à jour' : 'Créer l\'utilisateur')
              }
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;