// services/api.ts - Service API centralisé

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Récupérer le token d'authentification (localStorage, cookie, etc.)
    this.token = localStorage.getItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token d'authentification si disponible
    if (this.token && endpoint.startsWith('/admin')) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Méthodes pour les formations (admin)
  async getCourses(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/courses?${queryString}`);
  }

  async getCourse(id: number) {
    return this.request(`/admin/courses/${id}`);
  }

  async createCourse(formData: FormData) {
    return this.request('/admin/courses', {
      method: 'POST',
      headers: {
        // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
      body: formData,
    });
  }

  async updateCourse(id: number, formData: FormData) {
    // Laravel ne supporte pas PUT avec FormData, on utilise POST avec _method
    formData.append('_method', 'PUT');
    
    return this.request(`/admin/courses/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
      body: formData,
    });
  }

  async deleteCourse(id: number) {
    return this.request(`/admin/courses/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkActionCourses(action: string, ids: number[]) {
    return this.request('/admin/courses/bulk-action', {
      method: 'POST',
      body: JSON.stringify({ action, ids }),
    });
  }

  // Méthodes pour les formations en présentiel (admin)
  async getTrainings(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/trainings?${queryString}`);
  }

  async getTraining(id: number) {
    return this.request(`/admin/trainings/${id}`);
  }

  async createTraining(formData: FormData) {
    return this.request('/admin/trainings', {
      method: 'POST',
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
      body: formData,
    });
  }

  async updateTraining(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    
    return this.request(`/admin/trainings/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
      body: formData,
    });
  }

  async deleteTraining(id: number) {
    return this.request(`/admin/trainings/${id}`, {
      method: 'DELETE',
    });
  }

  // Données pour les formulaires
  async getCourseFormData() {
    return this.request('/admin/courses/form-data');
  }

  async getTrainingFormData() {
    return this.request('/admin/trainings/form-data');
  }

  // Méthodes publiques (pour le catalogue client)
  async getPublicTrainings(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/trainings?${queryString}`);
  }

  async getFiltersData() {
    return this.request('/trainings/filters/data');
  }

  // Inscriptions
  async registerForTraining(data: any) {
    return this.request('/registrations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Favoris
  async toggleFavorite(data: any) {
    return this.request('/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
// Admin/src/services/api.ts - Fix endpoints and authentication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add Sanctum token for admin routes
    if (this.token && endpoint.startsWith('/admin')) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // === Admin Courses (Online) ===
  async getCourses(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/courses?${queryString}`);
  }

  async getCourse(id: number) {
    return this.request(`/admin/courses/${id}`);
  }

  async createCourse(formData: FormData) {
    return this.request('/admin/courses', {
      method: 'POST',
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
      body: formData,
    });
  }

  async updateCourse(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    return this.request(`/admin/courses/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
      body: formData,
    });
  }

  async deleteCourse(id: number) {
    return this.request(`/admin/courses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
    });
  }

  // === Admin In-Person Trainings ===
  async getTrainings(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/in-person-trainings?${queryString}`);
  }

  async getTraining(id: number) {
    return this.request(`/admin/in-person-trainings/${id}`);
  }

  async createTraining(formData: FormData) {
    return this.request('/admin/in-person-trainings', {
      method: 'POST',
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
      body: formData,
    });
  }

  async updateTraining(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    return this.request(`/admin/in-person-trainings/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
      body: formData,
    });
  }

  async deleteTraining(id: number) {
    return this.request(`/admin/in-person-trainings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
    });
  }

  // === Form Data for Admin ===
  async getCourseFormData() {
    return this.request('/admin/courses/form-data', {
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
    });
  }

  async getTrainingFormData() {
    return this.request('/admin/in-person-trainings/form-data', {
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
    });
  }

  // === Public routes (no auth required) ===
  async getPublicTrainings(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/v1/trainings?${queryString}`);
  }

  async getFiltersData() {
    return this.request('/v1/trainings/filters/data');
  }

  async registerForTraining(data: any) {
    return this.request('/v1/registrations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async toggleFavorite(data: any) {
    return this.request('/v1/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);