// context/ToastContext.js
import React, { createContext, useContext, useState } from 'react';
import { Toast } from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', autoClose = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, autoClose };
    
    setToasts(prev => [...prev, toast]);

    if (autoClose) {
      setTimeout(() => {
        removeToast(id);
      }, autoClose);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, autoClose) => addToast(message, 'success', autoClose);
  const error = (message, autoClose) => addToast(message, 'error', autoClose);
  const warning = (message, autoClose) => addToast(message, 'warning', autoClose);
  const info = (message, autoClose) => addToast(message, 'info', autoClose);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            autoClose={false} // Géré par le provider
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};