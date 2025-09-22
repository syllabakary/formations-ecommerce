// utils/api.js
export const API_ENDPOINTS = {
  TRAININGS: '/trainings',
  TRAINING_DETAIL: (id) => `/trainings/${id}`,
  TRAINING_FILTERS: '/trainings/filters/data',
  REGISTRATIONS: '/registrations',
  CHECK_AVAILABILITY: (id) => `/trainings/${id}/availability`,
  DASHBOARD_STATS: '/dashboard/stats',
  POPULAR_TRAININGS: '/dashboard/popular-trainings'
};

export const apiService = {
  // Formations
  getTrainings: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/trainings?${queryString}`);
    return response.json();
  },

  getTrainingDetail: async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/trainings/${id}`);
    return response.json();
  },

  getFiltersData: async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/trainings/filters/data`);
    return response.json();
  },

  // Inscriptions
  createRegistration: async (data) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  checkAvailability: async (trainingId) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/trainings/${trainingId}/availability`);
    return response.json();
  }
};

// utils/helpers.js
export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' F';
};

export const formatDate = (dateString) => {
  const options = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export const formatDateShort = (dateString) => {
  const options = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export const getTimeRemaining = (dateString) => {
  const now = new Date();
  const targetDate = new Date(dateString);
  const diff = targetDate - now;
  
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

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return re.test(phone);
};
