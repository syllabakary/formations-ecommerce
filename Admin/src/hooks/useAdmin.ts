// hooks/useAdmin.ts - Version corrigée

import { useState, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { User, UserFilters, UserStats } from '../types/api';

interface PaginationData {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export const useAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUsers = useCallback(async (filters: UserFilters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = {
        page: currentPage,
        per_page: 15,
        ...filters
      };

      const response = await apiService.getUsers(params);
      
      console.log('📊 Réponse API Users:', response);

      if (response.success && response.data) {
        // ✅ CORRECTION : Accéder correctement aux données imbriquées
        const usersData = response.data.data || response.data;
        const paginationData = response.data;

        // Vérifier que usersData est un tableau
        if (Array.isArray(usersData)) {
          setUsers(usersData);
        } else {
          console.error('❌ usersData n\'est pas un tableau:', usersData);
          setUsers([]);
          setError('Format de données invalide reçu de l\'API');
        }

        // Mettre à jour la pagination
        if (paginationData.current_page) {
          setCurrentPage(paginationData.current_page);
          setTotalPages(paginationData.last_page || 1);
        }

        // Charger les stats si elles ne sont pas déjà chargées
        if (!stats) {
          loadStats();
        }
      } else {
        setError(response.message || 'Erreur lors du chargement des utilisateurs');
        setUsers([]);
      }
    } catch (err) {
      console.error('❌ Erreur loadUsers:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, stats]);

  const loadStats = useCallback(async () => {
    try {
      const response = await apiService.request('/admin/stats');
      
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Erreur chargement stats:', err);
    }
  }, []);

  const createUser = useCallback(async (userData: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await apiService.createUser(userData);
      
      if (response.success) {
        await loadUsers();
        return { success: true, message: 'Utilisateur créé avec succès' };
      } else {
        setError(response.message || 'Erreur lors de la création');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadUsers]);

  const updateUser = useCallback(async (id: number, userData: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await apiService.updateUser(id, userData);
      
      if (response.success) {
        await loadUsers();
        return { success: true, message: 'Utilisateur mis à jour avec succès' };
      } else {
        setError(response.message || 'Erreur lors de la mise à jour');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadUsers]);

  const deleteUser = useCallback(async (id: number) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await apiService.deleteUser(id);
      
      if (response.success) {
        await loadUsers();
        return { success: true, message: 'Utilisateur supprimé avec succès' };
      } else {
        setError(response.message || 'Erreur lors de la suppression');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadUsers]);

  const updateUserStatus = useCallback(async (id: number, status: string) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await apiService.updateUserStatus(id, status);
      
      if (response.success) {
        await loadUsers();
        return { success: true, message: 'Statut mis à jour avec succès' };
      } else {
        setError(response.message || 'Erreur lors de la mise à jour du statut');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadUsers]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
    setCurrentPage,
    clearError,
  };
};