import { useMutation } from '@tanstack/react-query';
import { authService, LoginCredentials } from '../services/api/authService';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api/apiConfig';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Set the token in the API instance
      api.defaults.headers.common.Authorization = `Bearer ${data.tokens.access.token}`;
      // Store auth data
      setAuth(data);
      console.log('Login successful:', {
        userId: data.user.userid,
        email: data.user.useremail,
        name: data.user.fullname
      });
    },
    onError: (error: any) => {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  return () => {
    // Remove token from API instance
    delete api.defaults.headers.common.Authorization;
    // Clear auth state
    logout();
  };
}; 