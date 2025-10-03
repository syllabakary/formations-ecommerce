// hooks/useFavorites.js
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage('training_favorites', []);

  const addFavorite = (trainingId) => {
    setFavorites(prev => [...new Set([...prev, trainingId])]);
  };

  const removeFavorite = (trainingId) => {
    setFavorites(prev => prev.filter(id => id !== trainingId));
  };

  const isFavorite = (trainingId) => {
    return favorites.includes(trainingId);
  };

  const toggleFavorite = (trainingId) => {
    if (isFavorite(trainingId)) {
      removeFavorite(trainingId);
    } else {
      addFavorite(trainingId);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  };
};