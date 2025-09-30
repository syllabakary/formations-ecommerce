export class ApiService {
  private baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  private baseURLV1 = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  private getAuthToken(): string | null {
    const tokenKey = import.meta.env.VITE_ADMIN_TOKEN_KEY || 'auth_token';
    return localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
  }

  private async getCSRFToken() {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const baseWithoutApi = this.baseURL.replace('/api', '');
        const response = await fetch(`${baseWithoutApi}/sanctum/csrf-cookie`, {
          credentials: 'include',
        });

        if (response.ok) {
          return; // Success
        }

        console.warn(`CSRF token fetch attempt ${attempt} failed with status ${response.status}`);
      } catch (error) {
        console.warn(`CSRF token fetch attempt ${attempt} failed:`, error);

        if (attempt === maxRetries) {
          console.error('All CSRF token fetch attempts failed');
          return; // Don't throw, just log
        }
      }

      // Wait before retrying
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
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

    // Use v1 URL for admin endpoints, base URL for auth endpoints
    const url = endpoint.startsWith('/admin') ? this.baseURLV1 : this.baseURL;

    const response = await fetch(`${url}${endpoint}`, {
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

  // Méthode pour les requêtes sans authentification (login, register, etc.)
  async requestUnauthenticated(endpoint: string, options: RequestInit = {}) {
    // CSRF pour les requêtes de modification
    if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
      await this.getCSRFToken();
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
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

  // ========== USER MANAGEMENT ==========
  async getUsers(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users${queryString ? '?' + queryString : ''}`);
  }

  async createUser(userData: any) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(id: number, userData: any) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id: number) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  }

  async updateUserStatus(id: number, status: string) {
    return this.request(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  async bulkDeleteUsers(userIds: number[]) {
    return this.request('/admin/users/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ user_ids: userIds })
    });
  }

  async resetUserPassword(id: number, newPassword: string) {
    return this.request(`/admin/users/${id}/reset-password`, {
      method: 'PATCH',
      body: JSON.stringify({ new_password: newPassword, new_password_confirmation: newPassword })
    });
  }

  // ========== AUTHENTICATION ==========
  async login(email: string, password: string) {
    // CSRF pour les requêtes de modification
    await this.getCSRFToken();

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    // Handle OTP verification case (403 with requires_verification)
    if (response.status === 403 && data.requires_verification) {
      return {
        requires_verification: true,
        user_id: data.user_id,
        otp: data.otp,
        message: data.message
      };
    }

    if (!response.ok) {
      throw new Error(data.message || `Erreur ${response.status}: ${response.statusText}`);
    }

    return data;
  }

  async logout() {
    return this.request('/logout', {
      method: 'POST'
    });
  }

  async verifyOTP(userId: number, otp: string) {
    return this.request('/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, otp })
    });
  }

  async getCurrentUser() {
    return this.request('/user');
  }

  // ========== DASHBOARD ==========
  async getDashboardStats() {
    return this.request('/admin/dashboard/stats');
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

  // Add setToken method
  setToken(token: string | null) {
    const tokenKey = import.meta.env.VITE_ADMIN_TOKEN_KEY || 'auth_token';
    if (token) {
      localStorage.setItem(tokenKey, token);
    } else {
      localStorage.removeItem(tokenKey);
      sessionStorage.removeItem(tokenKey);
    }
  }
}

// Export singleton
export const apiService = new ApiService();
