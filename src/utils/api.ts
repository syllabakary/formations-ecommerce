// utils/api.ts
export const API_ENDPOINTS = {
  TRAININGS: '/v1/courses',
  TRAINING_DETAIL: (id: string | number) => `/v1/courses/${id}`,
  TRAINING_FILTERS: '/v1/courses/filters/data',
  REGISTRATIONS: '/v1/registrations',
  CHECK_AVAILABILITY: (id: string | number) => `/v1/courses/${id}/availability`,
  DASHBOARD_STATS: '/v1/dashboard/stats',
  POPULAR_TRAININGS: '/v1/dashboard/popular-trainings'
};

// Enhanced fetch with timeout and AbortController
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs: number = 10000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    throw error;
  }
};

export const apiService = {
  // Formations
  getTrainings: async (params: Record<string, string | number | boolean>) => {
    try {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString();
      const response = await fetchWithTimeout(`${import.meta.env.VITE_API_URL}/v1/courses?${queryString}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching trainings:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch trainings');
    }
  },

  getTrainingDetail: async (id: number) => {
    try {
      const response = await fetchWithTimeout(`${import.meta.env.VITE_API_URL}/v1/courses/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching training detail:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch training detail');
    }
  },

  getFiltersData: async () => {
    try {
      const response = await fetchWithTimeout(`${import.meta.env.VITE_API_URL}/v1/courses/filters/data`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching filters data:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch filters data');
    }
  },

  // Favorites
  getFavorites: async (email: string) => {
    try {
      const response = await fetchWithTimeout(`${import.meta.env.VITE_API_URL}/v1/favorites?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch favorites');
    }
  },

  toggleFavorite: async (email: string, type: 'course' | 'training', id: number) => {
    try {
      const response = await fetchWithTimeout(`${import.meta.env.VITE_API_URL}/v1/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type, id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error instanceof Error ? error : new Error('Failed to toggle favorite');
    }
  },

  // Inscriptions
  createRegistration: async (data: Record<string, unknown>) => {
    try {
      const response = await fetchWithTimeout(`${import.meta.env.VITE_API_URL}/v1/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating registration:', error);
      throw error instanceof Error ? error : new Error('Failed to create registration');
    }
  },

  checkAvailability: async (trainingId: number) => {
    try {
      const response = await fetchWithTimeout(`${import.meta.env.VITE_API_URL}/v1/courses/${trainingId}/availability`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error instanceof Error ? error : new Error('Failed to check availability');
    }
  }
};

// utils/helpers.ts
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' F';
};

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export const formatDateShort = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export const getTimeRemaining = (dateString: string): string | null => {
  const now = new Date();
  const targetDate = new Date(dateString);
  const diff = targetDate.getTime() - now.getTime();

  if (diff < 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `Dans ${days} jour${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `Dans ${hours}h`;
  } else {
    return 'Bientôt';
  }
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[+]?[0-9\s\-()]{10,}$/;
  return re.test(phone);
};
