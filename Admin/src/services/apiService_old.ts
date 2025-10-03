export class ApiService {
  private baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  
  private getAuthToken(): string | null {
    const tokenKey = import.meta.env.VITE_ADMIN_TOKEN_KEY || 'auth_token';
    return localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
  }

  private async getCSRFToken() {
    try {
      await fetch(`${this.baseURL.replace('/api/v1', '')}/sanctum/csrf-cookie`, {
        credentials: 'include',
      });
    } catch (error) {
      console.warn('CSRF token fetch failed:', error);
    }
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
    }

    // CSRF pour les requêtes de modification
    if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
      await this.getCSRFToken();
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
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

      // Gestion 401
      if (response.status === 401) {
        const tokenKey = import.meta.env.VITE_ADMIN_TOKEN_KEY || 'auth_token';
        localStorage.removeItem(tokenKey);
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem(tokenKey);
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
        throw new Error('Session expirée. Reconnexion en cours...');
      }

      throw new Error(errorMessage);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  // ========== FORMATIONS EN LIGNE ==========
  async getFormations(mode: 'online' | 'in-person', params: any = {}) {
    const endpoint = mode === 'online' ? '/admin/courses' : '/admin/in-person-trainings';
    const queryString = new URLSearchParams(params).toString();
    return this.request(`${endpoint}${queryString ? '?' + queryString : ''}`);
  }

  async getFormData(mode: 'online' | 'in-person') {
    const endpoint = mode === 'online' 
      ? '/admin/courses/form-data' 
      : '/admin/in-person-trainings/form-data';
    return this.request(endpoint);
  }

  async createFormation(mode: 'online' | 'in-person', formData: any, imageFile?: File) {
    const endpoint = mode === 'online' ? '/admin/courses' : '/admin/in-person-trainings';
    const data = this.prepareFormData(formData, imageFile);
    
    return this.request(endpoint, {
      method: 'POST',
      body: data
    });
  }

  async updateFormation(mode: 'online' | 'in-person', id: number, formData: any, imageFile?: File) {
    const endpoint = mode === 'online' 
      ? `/admin/courses/${id}` 
      : `/admin/in-person-trainings/${id}`;
    const data = this.prepareFormData(formData, imageFile);
    
    // Laravel attend PUT mais FormData nécessite POST avec _method
    data.append('_method', 'PUT');
    
    return this.request(endpoint, {
      method: 'POST', // POST avec _method pour FormData
      body: data
    });
  }

  async deleteFormation(mode: 'online' | 'in-person', id: number) {
    const endpoint = mode === 'online' 
      ? `/admin/courses/${id}` 
      : `/admin/in-person-trainings/${id}`;
    
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // ========== CATEGORIES ==========
  async getCategories() {
    return this.request('/admin/categories');
  }

  async createCategory(data: any) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateCategory(id: number, data: any) {
    return this.request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteCategory(id: number) {
    return this.request(`/admin/categories/${id}`, {
      method: 'DELETE'
    });
  }

  async toggleCategoryStatus(id: number) {
    return this.request(`/admin/categories/${id}/toggle-status`, {
      method: 'PATCH'
    });
  }

  // ========== HELPERS ==========
  private prepareFormData(formData: any, imageFile?: File): FormData {
    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      if (value !== null && value !== undefined) {
        if (key === 'skills' && Array.isArray(value)) {
          // Envoyer skills comme array JSON
          data.append(key, JSON.stringify(value));
        } else if (typeof value === 'boolean') {
          data.append(key, value ? '1' : '0');
        } else if (typeof value === 'number') {
          data.append(key, value.toString());
        } else {
          data.append(key, value.toString());
        }
      }
    });
    
    if (imageFile) {
      data.append('image', imageFile);
    }
    
    return data;
  }
}

// Export singleton
export const apiService = new ApiService();