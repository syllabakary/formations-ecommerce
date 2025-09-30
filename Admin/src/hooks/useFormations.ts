
// hooks/useFormations.ts - Hook React pour la gestion des formations

import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Formation {
  id?: number;
  title: string;
  short_description: string;
  description: string;
  category_id: number;
  trainer_id: number;
  price: number;
  original_price?: number;
  is_active: boolean;
  // ... autres champs selon le type
}

export const useFormations = (mode: 'online' | 'in-person') => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const loadFormations = async (params: any = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = mode === 'online' 
        ? await apiService.getCourses(params)
        : await apiService.getTrainings(params);
      
      if (response.success) {
        setFormations(response.data);
        setPagination(response.meta);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const createFormation = async (formData: any, imageFile?: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = new FormData();
      
      // Ajouter tous les champs du formulaire
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              data.append(`${key}[${index}]`, item);
            });
          } else {
            data.append(key, value.toString());
          }
        }
      });
      
      if (imageFile) {
        data.append('image', imageFile);
      }
      
      const response = mode === 'online'
        ? await apiService.updateCourse(id, data)
        : await apiService.updateTraining(id, data);
      
      if (response.success) {
        await loadFormations();
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFormation = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = mode === 'online'
        ? await apiService.deleteCourse(id)
        : await apiService.deleteTraining(id);
      
      if (response.success) {
        await loadFormations();
        return true;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    formations,
    loading,
    error,
    pagination,
    loadFormations,
    createFormation,
    updateFormation,
    deleteFormation,
  };

  // In useFormations.ts - Update the loadFormations method
const loadFormations = async (params: any = {}) => {
  setLoading(true);
  setError(null);
  
  try {
    const endpoint = mode === 'online' 
      ? '/admin/courses' 
      : '/admin/in-person-trainings';
    
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}${endpoint}?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    const data = await response.json();
    
    if (data.success) {
      setFormations(data.data);
      setPagination(data.meta);
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
  } finally {
    setLoading(false);
  }
};

};
