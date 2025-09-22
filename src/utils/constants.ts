// utils/constants.js
export const TRAINING_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

export const REGISTRATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

export const SORT_OPTIONS = [
  { value: 'start_date-asc', label: 'Date (plus proche)' },
  { value: 'start_date-desc', label: 'Date (plus lointaine)' },
  { value: 'price-asc', label: 'Prix (croissant)' },
  { value: 'price-desc', label: 'Prix (décroissant)' },
  { value: 'rating-desc', label: 'Note (meilleure)' },
  { value: 'popularity-desc', label: 'Popularité' }
];

export const PRICE_RANGES = [
  { min: 0, max: 100000, label: 'Moins de 100,000 F' },
  { min: 100000, max: 200000, label: '100,000 - 200,000 F' },
  { min: 200000, max: 300000, label: '200,000 - 300,000 F' },
  { min: 300000, max: 500000, label: '300,000 - 500,000 F' },
  { min: 500000, max: null, label: 'Plus de 500,000 F' }
];

export const DURATION_OPTIONS = [
  { value: '1', label: '1 jour' },
  { value: '2-3', label: '2-3 jours' },
  { value: '4-5', label: '4-5 jours' },
  { value: '6+', label: '6+ jours' }
];
