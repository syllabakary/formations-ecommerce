import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { User, UserStats, UserFilters, CreateUserData, UpdateUserData } from '../types/api';

interface UseAdminReturn {
  // États
  users: User[];
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  isSubmitting: boolean;

  // Actions
  loadUsers: (filters?: UserFilters) => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<{ success: boolean; message?: string }>;
  updateUser: (id: number, userData: UpdateUserData) => Promise<{ success: boolean; message?: string }>;
  deleteUser: (id: number) => Promise<{ success: boolean; message?: string }>;
  updateUserStatus: (id: number, status: 'Actif' | 'Inactif' | 'Suspendu') => Promise<{ success: boolean; message?: string }>;
  bulkDeleteUsers: (userIds: number[]) => Promise<{ success: boolean; message?: string }>;
  resetUserPassword: (id: number, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  setCurrentPage: (page: number) => void;
  clearError: () => void;
}

export const useAdmin = (): UseAdminReturn => {
  // Get token from localStorage directly
  const getToken = () => localStorage.getItem('auth_token');

  // États
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configurer le token dans le service API
  useEffect(() => {
    const token = getToken();
    if (token) {
      apiService.setToken(token);
    }
  }, []);

  // Charger les utilisateurs
  const loadUsers = useCallback(async (filters: UserFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError('Token d\'authentification manquant');
        setIsLoading(false);
        return;
      }

      const filtersWithPage = {
        page: currentPage,
        per_page: 15,
        ...filters,
      };

      const response = await apiService.getUsers(filtersWithPage);

      if (response.success && response.data) {
        setUsers(response.data);
        setStats(response.stats);

        if (response.pagination) {
          setTotalPages(response.pagination.last_page);
        }
      } else {
        setError(response.message || 'Erreur lors du chargement des utilisateurs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  // Créer un utilisateur
  const createUser = useCallback(async (userData: CreateUserData) => {
    try {
      setIsSubmitting(true);

      const response = await apiService.createUser(userData);

      if (response.success) {
        await loadUsers(); // Recharger la liste
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Erreur lors de la création' };
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Erreur lors de la création'
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadUsers]);

  // Mettre à jour un utilisateur
  const updateUser = useCallback(async (id: number, userData: UpdateUserData) => {
    try {
      setIsSubmitting(true);

      const response = await apiService.updateUser(id, userData);

      if (response.success) {
        await loadUsers(); // Recharger la liste
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Erreur lors de la mise à jour' };
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadUsers]);

  // Supprimer un utilisateur
  const deleteUser = useCallback(async (id: number) => {
    try {
      setIsSubmitting(true);

      const response = await apiService.deleteUser(id);

      if (response.success) {
        await loadUsers(); // Recharger la liste
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Erreur lors de la suppression' };
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Erreur lors de la suppression'
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadUsers]);

  // Mettre à jour le statut d'un utilisateur
  const updateUserStatus = useCallback(async (id: number, status: 'Actif' | 'Inactif' | 'Suspendu') => {
    try {
      setIsSubmitting(true);

      const response = await apiService.updateUserStatus(id, status);

      if (response.success) {
        await loadUsers(); // Recharger la liste
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Erreur lors de la mise à jour du statut' };
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut'
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadUsers]);

  // Supprimer plusieurs utilisateurs
  const bulkDeleteUsers = useCallback(async (userIds: number[]) => {
    try {
      setIsSubmitting(true);

      const response = await apiService.bulkDeleteUsers(userIds);

      if (response.success) {
        await loadUsers(); // Recharger la liste
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Erreur lors de la suppression multiple' };
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Erreur lors de la suppression multiple'
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadUsers]);

  // Réinitialiser le mot de passe d'un utilisateur
  const resetUserPassword = useCallback(async (id: number, newPassword: string) => {
    try {
      setIsSubmitting(true);

      const response = await apiService.resetUserPassword(id, newPassword);

      if (response.success) {
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Erreur lors de la réinitialisation' };
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Erreur lors de la réinitialisation'
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Effacer l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    const token = getToken();
    if (token) {
      loadUsers();
    } else {
      setIsLoading(false);
    }
  }, [loadUsers]);

  return {
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
    bulkDeleteUsers,
    resetUserPassword,
    setCurrentPage,
    clearError,
  };
};

export default useAdmin;
