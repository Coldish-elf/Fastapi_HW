import api from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/User';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const formData = new FormData();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);
  
  try {
    const response = await api.post<AuthResponse>('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Auth service login error:", error);
    throw error;
  }
};

export const register = async (data: RegisterCredentials): Promise<User> => {
  const response = await api.post<User>('/users', data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
};
