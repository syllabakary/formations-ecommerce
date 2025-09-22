// hooks/useTrainings.js
import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { useDebounce } from './useDebounce';

export const useTrainings = (initialFilters = {}) => {
  const [trainings, setTrainings] = useState([]);
  const [meta, setMeta] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    city_id: '',
    category_id: '',
    tab: 'upcoming',
    sort_by: 'start_date',
    sort_order: 'asc',
    page: 1,
    ...initialFilters
  });
  
  const { apiCall, loading, error } = useApi();
  const debouncedSearch = useDebounce(filters.search, 300);

  const loadTrainings = useCallback(async (resetPage = false) => {
    const searchFilters = {
      ...filters,
      search: debouncedSearch,
      page: resetPage ? 1 : filters.page
    };

    const queryParams = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        queryParams.append(key, value);
      }
    });

    try {
      const data = await apiCall(`/trainings?${queryParams.toString()}`);
      
      if (resetPage || filters.page === 1) {
        setTrainings(data.data);
      } else {
        // Infinite scroll: ajouter les nouveaux résultats
        setTrainings(prev => [...prev, ...data.data]);
      }
      
      setMeta(data.meta);
      
      if (resetPage) {
        setFilters(prev => ({ ...prev, page: 1 }));
      }
    } catch (err) {
      console.error('Error loading trainings:', err);
    }
  }, [apiCall, filters, debouncedSearch]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const loadMore = useCallback(() => {
    if (meta.has_more && !loading) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [meta.has_more, loading]);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      city_id: '',
      category_id: '',
      tab: 'upcoming',
      sort_by: 'start_date',
      sort_order: 'asc',
      page: 1
    });
  }, []);

  useEffect(() => {
    loadTrainings(true);
  }, [debouncedSearch, filters.city_id, filters.category_id, filters.tab, filters.sort_by, filters.sort_order]);

  useEffect(() => {
    if (filters.page > 1) {
      loadTrainings(false);
    }
  }, [filters.page]);

  return {
    trainings,
    meta,
    filters,
    loading,
    error,
    updateFilters,
    loadMore,
    resetFilters,
    refetch: () => loadTrainings(true)
  };
};