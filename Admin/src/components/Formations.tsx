import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Star, Users, Clock } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { Formation } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialFormations } from '../data/initialData';
import FormationModal from './FormationModal';
import ConfirmDialog from './ConfirmDialog';

const Formations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formations, setFormations] = useLocalStorage<Formation[]>('formations', initialFormations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formationToDelete, setFormationToDelete] = useState<Formation | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  const handleCreateFormation = () => {
    setEditingFormation(undefined);
    setIsModalOpen(true);
  };

  const handleEditFormation = (formation: Formation) => {
    setEditingFormation(formation);
    setIsModalOpen(true);
  };

  const handleSaveFormation = (formationData: Omit<Formation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    if (editingFormation) {
      // Mise à jour
      setFormations(prev => prev.map(f => 
        f.id === editingFormation.id 
          ? { ...formationData, id: editingFormation.id, createdAt: editingFormation.createdAt, updatedAt: now }
          : f
      ));
    } else {
      // Création
      const newId = Math.max(...formations.map(f => f.id), 0) + 1;
      const newFormation: Formation = {
        ...formationData,
        id: newId,
        createdAt: now,
        updatedAt: now
      };
      setFormations(prev => [...prev, newFormation]);
    }
  };

  const handleDeleteFormation = (formation: Formation) => {
    setFormationToDelete(formation);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (formationToDelete) {
      setFormations(prev => prev.filter(f => f.id !== formationToDelete.id));
      setFormationToDelete(null);
    }
  };

  const handleBuyFormation = (formation: Formation) => {
    setSelectedFormation(formation);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Mettre à jour les statistiques après un achat
    if (selectedFormation) {
      setFormations(prev => prev.map(f => 
        f.id === selectedFormation.id 
          ? { ...f, students: f.students + 1 }
          : f
      ));
    }
  };

  const categories = ['all', 'Design', 'Développement', 'Marketing', 'Business'];

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || formation.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Formations</h1>
          <p className="text-gray-600">Gérez vos cours et contenus éducatifs</p>
        </div>
        
        <button className="flex items-center space-x-2 bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nouvelle Formation</span>
        </button>
        <button 
          onClick={handleCreateFormation}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nouvelle Formation</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Toutes les catégories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="text-2xl font-bold text-gray-800">{formations.length}</div>
          <div className="text-sm text-gray-600">Total Formations</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{formations.filter(f => f.status === 'Publié').length}</div>
          <div className="text-sm text-gray-600">Publiées</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">{formations.filter(f => f.status === 'Brouillon').length}</div>
          <div className="text-sm text-gray-600">Brouillons</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="text-2xl font-bold text-[#A553C4]">{formations.reduce((acc, f) => acc + f.students, 0)}</div>
          <div className="text-sm text-gray-600">Étudiants Inscrits</div>
        </div>
      </div>

      {/* Formations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFormations.map((formation) => (
          <div key={formation.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            {/* Image */}
            <div className="relative h-48">
              <img 
                src={formation.image} 
                alt={formation.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  formation.status === 'Publié' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {formation.status}
                </span>
                {formation.trending && (
                  <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                    Tendance
                  </span>
                )}
                {formation.bestseller && (
                  <span className="bg-orange-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                    Bestseller
                  </span>
                )}
              </div>
              
              {/* Actions */}
              <div className="absolute top-3 right-3 flex items-center space-x-1">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => handleEditFormation(formation)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => handleDeleteFormation(formation)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#A553C4]/10 text-[#A553C4] px-2 py-1 text-xs font-medium rounded-full">
                  {formation.category}
                </span>
                <span className="text-xs text-gray-500">{formation.level}</span>
              </div>
              
              <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                {formation.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {formation.description}
              </p>
              
              <div className="space-y-3">
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{formation.students}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{formation.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formation.duration}</span>
                  </div>
                </div>
                
                {/* Price and Instructor */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-[#A553C4]">
                      {(formation.price / 100).toFixed(0)}€
                    </div>
                    {formation.originalPrice > formation.price && (
                      <div className="text-sm text-gray-500 line-through">
                        {(formation.originalPrice / 100).toFixed(0)}€
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">{formation.instructor}</div>
                    <div className="text-xs text-gray-500">{formation.modules} modules</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFormations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Aucune formation trouvée</h3>
          <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
        </div>
      )}

      {/* Modals */}
      <FormationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formation={editingFormation}
        onSave={handleSaveFormation}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer la formation"
        message={`Êtes-vous sûr de vouloir supprimer la formation "${formationToDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        type="danger"
      />

      {selectedFormation && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          formation={selectedFormation}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Formations;