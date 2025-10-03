// Types pour l'API Laravel
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'Étudiant' | 'Instructeur' | 'Admin';
  status: 'Actif' | 'Inactif' | 'Suspendu';
  avatar: string;
  join_date: string;
  courses_enrolled?: number;
  courses_completed?: number;
  courses_created?: number;
  last_active: string;
  created_at: string;
  updated_at: string;
  email_verified_at?: string;
  is_admin?: boolean;
  is_active?: boolean;
  is_verified?: boolean;
}

export interface UserStats {
  total: number;
  students: number;
  instructors: number;
  admins: number;
  active: number;
  inactive: number;
  suspended: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface UserListResponse extends PaginatedResponse<User> {
  stats: UserStats;
}

// Types pour les formulaires
export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  role: 'Étudiant' | 'Instructeur' | 'Admin';
  status: 'Actif' | 'Inactif' | 'Suspendu';
  avatar?: string;
  password: string;
  join_date?: string;
}

export interface UpdateUserData {
  name: string;
  email: string;
  phone: string;
  role: 'Étudiant' | 'Instructeur' | 'Admin';
  status: 'Actif' | 'Inactif' | 'Suspendu';
  avatar?: string;
  password?: string;
}

// Types pour les filtres
export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Types pour l'authentification
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
}

export interface LoginResponse extends ApiResponse {
  token: string;
  user: AuthUser;
}

// Types pour les erreurs
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError extends Error {
  status?: number;
  errors?: ValidationError[];
}