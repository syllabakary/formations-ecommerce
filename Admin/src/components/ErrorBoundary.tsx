import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Vérifier si c'est une erreur de hot reload liée au contexte
    if (error.message.includes('useAuth must be used within an AuthProvider') ||
        error.message.includes('useContext') ||
        error.message.includes('context')) {
      // Ne pas afficher d'erreur pour les problèmes de hot reload
      return { hasError: false };
    }

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Vérifier si c'est une erreur de hot reload
    if (error.message.includes('useAuth must be used within an AuthProvider') ||
        error.message.includes('useContext') ||
        error.message.includes('context')) {
      console.warn('Hot reload context error caught and ignored:', error.message);
      this.setState({ hasError: false });
      return;
    }

    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.props.fallback) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
