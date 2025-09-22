import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, Mail, Phone, Shield, 
  UserCheck, Users as UsersIcon, AlertCircle, Loader2, RefreshCw 
} from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';
import { User, UserFilters } from '../types/api';
import UserModal from './UserModal';
import ConfirmDialog from './ConfirmDialog';

const Users: React.FC = () => {
  // États locaux pour les filtres et UI
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Hook personnalisé pour l'administration
  const {
    users,
    stats,
    isLoading,
    error,
    currentPage,
    totalPages,
    isSubmitting,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    setCurrentPage,
    clearError,
  } = useAdmin();

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        const filters: UserFilters = {
          ...(searchTerm && { search: searchTerm }),
          ...(filterRole !== 'all' && { role: filterRole }),
          ...(filterStatus !== 'all' && { status: filterStatus }),
        };
        loadUsers(filters);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filterRole, filterStatus]);

  // Recharger quand la page change
  useEffect(() => {
    const filters: UserFilters = {
      ...(searchTerm && { search: searchTerm }),
      ...(filterRole !== 'all' && { role: filterRole }),
      ...(filterStatus !== 'all' && { status: filterStatus }),
    };
    loadUsers(filters);
  }, [currentPage]);

  // Handlers
  const handleCreateUser = () => {
    setEditingUser(undefined);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData: any) => {
    let result;
    
    if (editingUser) {
      result = await updateUser(editingUser.id, userData);
    } else {
      result = await createUser({
        ...userData,
        password: '123456', // Mot de passe par défaut
      });
    }

    if (result.success) {
      setIsModalOpen(false);
    }
    
    return result;
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleStatusChange = async (user: User, newStatus: 'Actif' | 'Inactif' | 'Suspendu') => {
    await updateUserStatus(user.id, newStatus);
  };

  const handleRefresh = () => {
    const filters: UserFilters = {
      ...(searchTerm && { search: searchTerm }),
      ...(filterRole !== 'all' && { role: filterRole }),
      ...(filterStatus !== 'all' && { status: filterStatus }),
    };
    loadUsers(filters);
  };

  // Mémoiser les options pour éviter les re-renders
  const roles = useMemo(() => ['all', 'Étudiant', 'Instructeur', 'Admin'], []);
  const statuses = useMemo(() => ['all', 'Actif', 'Inactif', 'Suspendu'], []);

  // Utilitaires pour les couleurs
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Instructeur':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Étudiant':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Suspendu':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Inactif':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Affichage d'erreur
  if (error && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h3 className="text-lg font-medium text-gray-900">Erreur de chargement</h3>
        <p className="text-gray-600 text-center max-w-md">{error}</p>
        <div className="flex space-x-3">
          <button
            onClick={clearError}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">
            Gérez les étudiants, instructeurs et administrateurs
            {stats && (
              <span className="ml-2 text-sm text-gray-500">
                ({stats.total} utilisateurs)
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading || isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
          
          <button 
            onClick={handleCreateUser}
            disabled={isSubmitting}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nouvel Utilisateur</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              disabled={isLoading}
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'all' ? 'Tous les rôles' : role}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              disabled={isLoading}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'Tous les statuts' : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Utilisateurs</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-green-600">{stats.students}</div>
            <div className="text-sm text-gray-600">Étudiants</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.instructors}</div>
            <div className="text-sm text-gray-600">Instructeurs</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-[#A553C4]">{stats.active}</div>
            <div className="text-sm text-gray-600">Utilisateurs Actifs</div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#A553C4]" />
            <span className="ml-2 text-gray-600">Chargement des utilisateurs...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activité
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
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150';
                              }}
                            />
                            {user.is_verified && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <UserCheck className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm text-gray-500">
                              Inscrit le {new Date(user.join_date).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-800">
                          {user.role === 'Étudiant' && (
                            <>
                              <div className="font-medium">{user.courses_enrolled || 0} formations inscrites</div>
                              <div className="text-gray-500">{user.courses_completed || 0} terminées</div>
                            </>
                          )}
                          {user.role === 'Instructeur' && (
                            <div className="font-medium">{user.courses_created || 0} formations créées</div>
                          )}
                          {user.role === 'Admin' && (
                            <div className="font-medium">Administrateur système</div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{user.last_active}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user, e.target.value as any)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border cursor-pointer bg-transparent ${getStatusColor(user.status)}`}
                          disabled={isSubmitting}
                        >
                          <option value="Actif">Actif</option>
                          <option value="Inactif">Inactif</option>
                          <option value="Suspendu">Suspendu</option>
                        </select>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            disabled={isSubmitting}
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={isSubmitting}
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <UsersIcon className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun utilisateur trouvé</h3>
                <p className="text-gray-600">
                  {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Commencez par créer votre premier utilisateur'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || isLoading}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> sur{' '}
                      <span className="font-medium">{totalPages}</span>
                      {stats && (
                        <>
                          {' '}- <span className="font-medium">{stats.total}</span> utilisateur{stats.total > 1 ? 's' : ''}
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || isLoading}
                        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Précédent
                      </button>
                      
                      {/* Pages numbers */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            disabled={isLoading}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNum === currentPage
                                ? 'z-10 bg-[#A553C4] border-[#A553C4] text-white'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || isLoading}
                        className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Suivant
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        onSave={handleSaveUser}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userToDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        type="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Users;