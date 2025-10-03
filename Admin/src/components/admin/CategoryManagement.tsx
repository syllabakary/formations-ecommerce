// CategoryManagement.tsx - Version corrigée avec authentification synchronisée
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  Loader2,
  AlertCircle,
  Check,
  Tag,
  Palette,
  Hash,
  FileText,
  BarChart3
} from 'lucide-react';
import { apiService } from '../../services/apiService';

// Types
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  online_courses_count: number;
  in_person_trainings_count: number;
  total_trainings: number;
  created_at: string;
  updated_at: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  sort_order: number;
}



// Modal de création/édition de catégorie
const CategoryModal = ({ 
  isOpen, 
  onClose, 
  category, 
  onSave 
}: {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  onSave: (formData: CategoryFormData) => Promise<void>;
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    icon: '',
    color: '#3B82F6',
    is_active: true,
    sort_order: 0,
  });
  
  const [loading, setLoading] = useState(false);

  // Icônes disponibles
  const availableIcons = [
    { name: 'code', label: 'Code' },
    { name: 'database', label: 'Base de données' },
    { name: 'palette', label: 'Design' },
    { name: 'shield', label: 'Sécurité' },
    { name: 'trending-up', label: 'Marketing' },
    { name: 'users', label: 'Management' },
    { name: 'calculator', label: 'Finance' },
    { name: 'languages', label: 'Langues' },
    { name: 'briefcase', label: 'Business' },
    { name: 'heart', label: 'Santé' },
    { name: 'wrench', label: 'Technique' },
    { name: 'truck', label: 'Logistique' },
    { name: 'leaf', label: 'Environnement' },
  ];

  // Couleurs prédéfinies
  const predefinedColors = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#10B981', 
    '#F59E0B', '#6366F1', '#06B6D4', '#84CC16', '#F97316'
  ];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon || '',
        color: category.color,
        is_active: category.is_active,
        sort_order: category.sort_order,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '',
        color: '#3B82F6',
        is_active: true,
        sort_order: 0,
      });
    }
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <Tag className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {category ? 'Modifier' : 'Nouvelle'} Catégorie
              </h2>
              <p className="text-gray-600">
                {category ? 'Modifiez les informations de la catégorie' : 'Créez une nouvelle catégorie de formation'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom de la catégorie *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Développement Web"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description de la catégorie..."
              />
            </div>

            {/* Icône */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Icône
              </label>
              <div className="grid grid-cols-6 gap-3">
                {availableIcons.map((iconOption) => (
                  <button
                    key={iconOption.name}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon: iconOption.name }))}
                    className={`p-3 rounded-lg border-2 hover:border-blue-500 transition-colors ${
                      formData.icon === iconOption.name 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                    title={iconOption.label}
                  >
                    <div className="w-6 h-6 mx-auto">
                      {iconOption.name === 'code' && <Hash className="w-full h-full" />}
                      {iconOption.name === 'database' && <FileText className="w-full h-full" />}
                      {iconOption.name === 'palette' && <Palette className="w-full h-full" />}
                      {iconOption.name === 'shield' && <AlertCircle className="w-full h-full" />}
                      {iconOption.name === 'trending-up' && <BarChart3 className="w-full h-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Couleur */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Couleur
              </label>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-900' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-mono">{formData.color}</span>
              </div>
            </div>

            {/* Ordre d'affichage */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ordre d'affichage
              </label>
              <input
                type="number"
                min="0"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">Plus le nombre est petit, plus la catégorie apparaîtra en premier</p>
            </div>

            {/* Statut */}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-700">Catégorie active</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Les catégories inactives ne sont pas visibles dans les formulaires</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {loading ? 'Sauvegarde...' : (category ? 'Mettre à jour' : 'Créer la catégorie')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant principal de gestion des catégories
const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');



  // Charger les catégories avec vérification d'authentification
  const loadCategories = async () => {
    setLoading(true);
    setError(null);

    // guard: require token
    const tokenPresent = !!(localStorage.getItem((import.meta.env.VITE_ADMIN_TOKEN_KEY as string) || 'auth_token'));
    if (!tokenPresent) {
      setError('Utilisateur non authentifié. Veuillez vous connecter.');
      setLoading(false);
      return;
    }

    try {
      // use apiService.request or existing CategoryApiService methods that rely on token
      const resp = await apiService.request('/admin/categories');
      setCategories(resp.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    // Re-run when auth state changes so UI reacts to login/logout
  }, []);
  
  // Créer/Modifier une catégorie
  const handleSave = async (formData: CategoryFormData) => {
    try {
      let response;
      if (editingCategory) {
        response = await apiService.updateCategory(editingCategory.id, formData);
      } else {
        response = await apiService.createCategory(formData);
      }

      if (response.success) {
        await loadCategories();
        setShowModal(false);
        setEditingCategory(null);
        setSuccess(response.message || 'Catégorie sauvegardée avec succès');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response.message || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Supprimer une catégorie
  const handleDelete = async (category: Category) => {
    if (category.total_trainings > 0) {
      setError(`Impossible de supprimer cette catégorie car elle contient ${category.total_trainings} formation(s)`);
      setTimeout(() => setError(null), 5000);
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
      try {
        const response = await apiService.deleteCategory(category.id);

        if (response.success) {
          await loadCategories();
          setSuccess('Catégorie supprimée avec succès');
          setTimeout(() => setSuccess(null), 3000);
        } else {
          throw new Error(response.message || 'Erreur lors de la suppression');
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Basculer le statut
  const handleToggleStatus = async (category: Category) => {
    try {
      const response = await apiService.toggleCategoryStatus(category.id);

      if (response.success) {
        await loadCategories();
        setSuccess(response.message || 'Statut mis à jour');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Gérer les actions
  const handleCreateNew = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  // Filtrer les catégories
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Messages d'état */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Catégories
          </h1>
          <p className="text-gray-600">
            Organisez vos formations par catégories thématiques
          </p>
        </div>
        
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5" />
          Nouvelle Catégorie
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Grille des catégories */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement des catégories...</p>
          </div>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Header avec couleur */}
              <div
                className="h-3"
                style={{ backgroundColor: category.color }}
              />
              
              {/* Contenu */}
              <div className="p-6">
                {/* En-tête */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Tag className="h-5 w-5" style={{ color: category.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">#{category.sort_order}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleStatus(category)}
                      className={`p-1 rounded ${
                        category.is_active 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={category.is_active ? 'Désactiver' : 'Activer'}
                    >
                      {category.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Description */}
                {category.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {category.online_courses_count}
                    </div>
                    <div className="text-xs text-gray-500">En ligne</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {category.in_person_trainings_count}
                    </div>
                    <div className="text-xs text-gray-500">Présentiel</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    {category.total_trainings} formation{category.total_trainings > 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      disabled={category.total_trainings > 0}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={category.total_trainings > 0 ? 'Impossible de supprimer (formations liées)' : 'Supprimer'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border">
            <div className="text-6xl mb-6">🏷️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucune catégorie trouvée</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {searchTerm
                ? 'Aucune catégorie ne correspond à votre recherche.'
                : 'Commencez par créer votre première catégorie.'
              }
            </p>
            <button
              onClick={handleCreateNew}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              Créer une catégorie
            </button>
          </div>
        </div>
      )}

      {/* Modal de création/édition */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCategory(null);
        }}
        category={editingCategory || undefined}
        onSave={handleSave}
      />
    </div>
  );
};

export default CategoryManagement;