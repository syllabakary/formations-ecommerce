import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';

interface InPersonTraining {
  id: number;
  title: string;
  trainer: string;
  price: number;
  type: string;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  venue_name?: string;
  venue_address?: string;
  max_seats?: number;
  available_seats?: number;
  status?: string;
  image_url?: string;
  formatted_price?: string;
}

export const useInPersonTrainings = () => {
  const [trainings, setTrainings] = useState<InPersonTraining[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { apiCall } = useApi();

  const fetchTrainings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall('/v1/in-person-trainings');
      setTrainings(data.data);
    } catch (err) {
      setError('Failed to load in-person trainings');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  return { trainings, loading, error, refetch: fetchTrainings };
};
