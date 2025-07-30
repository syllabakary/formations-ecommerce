import React, { useState, useEffect } from 'react';
import { User } from '../types';
import Modal from './Modal';
import { Save, Upload } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSave: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Étudiant' as const,
    avatar: '',
    joinDate: new Date().toISOString().split('T')[0],
    lastActive: 'Il y a quelques instants',
    coursesEnrolled: 0,
    coursesCompleted: 0,
    coursesCreated: 0,
    status: 'Actif' as const
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        joinDate: user.joinDate,
        lastActive: user.lastActive,
        coursesEnrolled: user.coursesEnrolled,
        coursesCompleted: user.coursesCompleted,
        coursesCreated: user.coursesCreated || 0,
        status: user.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Étudiant',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: 'Il y a quelques instants',
        coursesEnrolled: 0,
        coursesCompleted: 0,
        coursesCreated: 0,
        status: 'Actif'
      });
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              placeholder="Ex: Marie Dubois"
            />
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
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              placeholder="Ex: marie.dubois@email.com"
            />
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
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              placeholder="Ex: +33 6 12 34 56 78"
            />
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle *
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'Étudiant' | 'Instructeur' | 'Admin' }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
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
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Actif' | 'Inactif' | 'Suspendu' }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
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
              value={formData.joinDate}
              onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
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
                  value={formData.coursesEnrolled}
                  onChange={(e) => setFormData(prev => ({ ...prev, coursesEnrolled: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formations terminées
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.coursesCompleted}
                  onChange={(e) => setFormData(prev => ({ ...prev, coursesCompleted: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
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
                value={formData.coursesCreated}
                onChange={(e) => setFormData(prev => ({ ...prev, coursesCreated: parseInt(e.target.value) || 0 }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
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
              onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              placeholder="https://example.com/avatar.jpg"
            />
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
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <Save className="w-5 h-5" />
            <span className="font-medium">
              {user ? 'Mettre à jour' : 'Créer l\'utilisateur'}
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;