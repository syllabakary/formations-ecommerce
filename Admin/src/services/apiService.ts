import { 
  User, 
  UserListResponse, 
  CreateUserData, 
  UpdateUserData, 
  UserFilters, 
  ApiResponse, 
  ApiError 
} from '../types/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = 'http://127.0.0.1:8000/api') {
    this.baseURL = baseURL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.message || 'Erreur API') as ApiError;
        error.status = response.status;
        error.errors = data.errors;
        throw error;
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur de connexion');
    }
  }

  // === Méthodes d'authentification ===
  
  async login(email: string, password: string) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, phone: string, password: string) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify({ email, phone, password }),
    });
  }

  async verifyOTP(email: string, code: string) {
    return this.request('/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  async logout() {
    return this.request('/logout', {
      method: 'POST',
    });
  }

  // === Méthodes admin pour les utilisateurs ===

  async getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/admin/users${queryString ? `?${queryString}` : ''}`;
    
    return this.request<UserListResponse>(endpoint);
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(`/admin/users/${id}`);
  }

  async createUser(userData: CreateUserData): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: UpdateUserData): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkDeleteUsers(userIds: number[]): Promise<ApiResponse> {
    return this.request<ApiResponse>('/admin/users/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ user_ids: userIds }),
    });
  }

  async updateUserStatus(
    id: number, 
    status: 'Actif' | 'Inactif' | 'Suspendu'
  ): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async resetUserPassword(
    id: number, 
    newPassword: string
  ): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/admin/users/${id}/reset-password`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        new_password: newPassword,
        new_password_confirmation: newPassword 
      }),
    });
  }

  // === Méthodes pour les statistiques ===

  async getDashboardStats() {
    return this.request('/admin/stats');
  }

  // === Méthodes utilitaires ===

  async testConnection(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/test');
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/user');
  }
}

// Instance par défaut
export const apiService = new ApiService();

export default apiService;