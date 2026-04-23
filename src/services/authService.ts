import api from './api';
import { encryptPayload } from '../utils/crypto';

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  username: string;
  fullName: string;
  roleCode: string;
  logId: string;
  sessionLogId: string;
  pid: string;
  invalidCount: number;
}

const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const payload = { username, password };
    const encryptedPayload = encryptPayload(payload);
    
    const response = await api.post<LoginResponse>('/auth/login', { 
      encryptedPayload 
    });
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.data.username,
        fullName: response.data.fullName,
        roleCode: response.data.roleCode
      }));
    }
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
