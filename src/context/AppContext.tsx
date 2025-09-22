// context/AppContext.js
import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  theme: 'light',
  loading: false,
  error: null,
  filters: {
    search: '',
    city: '',
    category: '',
    dateRange: null,
    priceRange: null,
    sortBy: 'start_date',
    sortOrder: 'asc'
  },
  favorites: [],
  cart: [] // Pour les formations sélectionnées
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters
      };
    
    case 'ADD_TO_FAVORITES':
      return {
        ...state,
        favorites: [...state.favorites, action.payload]
      };
    
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload)
      };
    
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };
    
    default:
      return state;
  }
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    setTheme: (theme) => dispatch({ type: 'SET_THEME', payload: theme }),
    updateFilters: (filters) => dispatch({ type: 'UPDATE_FILTERS', payload: filters }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    addToFavorites: (id) => dispatch({ type: 'ADD_TO_FAVORITES', payload: id }),
    removeFromFavorites: (id) => dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: id }),
    addToCart: (training) => dispatch({ type: 'ADD_TO_CART', payload: training }),
    removeFromCart: (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};