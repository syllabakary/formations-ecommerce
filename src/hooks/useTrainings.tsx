// hooks/useTrainings.tsx
import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';

interface Training {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image?: string;
  image_url?: string;
  category: { id: number; name: string };
  trainer_name?: string;
  city_name?: string;
  price: number;
  original_price?: number;
  formatted_price: string;
  formatted_original_price?: string;
  discount_percentage?: number;
  duration_days?: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  venue_name?: string;
  venue_address?: string;
  max_seats?: number;
  available_seats?: number;
  rating?: number;
  total_reviews?: number;
  is_popular?: boolean;
  is_full?: boolean;
  mode: string;
  can_register?: boolean;
  status?: string;
}

interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Filters {
  search: string;
  city_id: string;
  category_id: string;
  tab: string;
  sort_by: string;
  sort_order: string;
  page: number;
}

export const useTrainings = (initialFilters: Partial<Filters> = {}) => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [meta, setMeta] = useState<Meta>({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0
  });
  const [filters, setFilters] = useState<Filters>({
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

  const loadTrainings = useCallback(async (resetPage = false) => {
    const searchFilters = {
      ...filters,
      search: filters.search,
      page: resetPage ? 1 : filters.page,
      mode: 'in-person', // Always fetch in-person trainings
      // Remove status filter to show all active trainings regardless of status
      // status: filters.tab === 'upcoming' ? 'scheduled' : undefined
    };

    const queryParams = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    try {
      const data = await apiCall(`/courses?${queryParams.toString()}`);

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
  }, [apiCall, filters]);

  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const loadMore = useCallback(() => {
    if (meta.current_page < meta.last_page && !loading) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [meta, loading]);

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
  }, [filters.search, filters.city_id, filters.category_id, filters.tab, filters.sort_by, filters.sort_order]);

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
