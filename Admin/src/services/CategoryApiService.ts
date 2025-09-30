// Service API simplifié pour les catégories
export class CategoryApiService {
  private baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  private getAuthToken(): string | null {
    const tokenKey = import.meta.env.VITE_ADMIN_TOKEN_KEY || 'auth_token';
    return localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
  }

  private async getCSRFToken() {
    try {
      await fetch(`${this.baseURL.replace('/api/v1','')}/sanctum/csrf-cookie`, {
        credentials: 'include',
      });
    } catch (error) {
      console.warn('CSRF token fetch failed:', error);
    }
  }

  private async makeRequest(url: string, options: RequestInit = {}) {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('Non authentifié. Veuillez vous reconnecter.');
      }

      // Obtenir le token CSRF pour les requêtes de modification
      if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
        await this.getCSRFToken();
      }

      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      };

      console.log('🔑 Making request with token:', token.substring(0, 20) + '...');

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        
        if (text) {
          try {
            const data = JSON.parse(text);
            errorMessage = data.message || errorMessage;
          } catch (e) {
            errorMessage = text;
          }
        }

        // Si 401, nettoyer le token et forcer une reconnexion
        if (response.status === 401) {
          const tokenKey = import.meta.env.VITE_ADMIN_TOKEN_KEY || 'auth_token';
          localStorage.removeItem(tokenKey);
          localStorage.removeItem('currentUser');
          
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          
          throw new Error('Session expirée. Reconnexion en cours...');
        }

        throw new Error(errorMessage);
      }

      const text = await response.text();
      const result = text ? JSON.parse(text) : {};
      
      console.log('✅ API Response:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Erreur dans makeRequest:', error);
      throw error;
    }
  }

  // Méthodes de l'API
  async getCategories() {
    console.log('📋 Récupération des catégories...');
    return this.makeRequest(`${this.baseURL}/admin/categories`);
  }

  async createCategory(data: any) {
    console.log('➕ Création de catégorie:', data);
    return this.makeRequest(`${this.baseURL}/admin/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: number, data: any) {
    console.log('✏️ Modification de catégorie:', id, data);
    return this.makeRequest(`${this.baseURL}/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: number) {
    console.log('🗑️ Suppression de catégorie:', id);
    return this.makeRequest(`${this.baseURL}/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleStatus(id: number) {
    console.log('🔄 Basculer le statut de la catégorie:', id);
    return this.makeRequest(`${this.baseURL}/admin/categories/${id}/toggle-status`, {
      method: 'PATCH',
    });
  }
}