import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginResponse } from '../services/api/authService';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
  iat: number;
  sub: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  tokenExpiryTime: number | null;
  setAuth: (data: LoginResponse) => void;
  logout: () => void;
  validateToken: () => boolean;
  checkAndHandleTokenExpiry: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      tokenExpiryTime: null,

      setAuth: (data) => {
        let tokenExpiryTime = null;
        
        try {
          if (data.tokens.access.token) {
            const decodedToken = jwtDecode(data.tokens.access.token) as TokenPayload;
            tokenExpiryTime = decodedToken.exp * 1000; // Convert to milliseconds
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
        
        set({
          accessToken: data.tokens.access.token,
          refreshToken: data.tokens.refresh.token,
          user: data.user,
          isAuthenticated: true,
          tokenExpiryTime,
        });
        
        // Set up auto-logout timer
        if (tokenExpiryTime) {
          const currentTime = Date.now();
          const timeUntilExpiry = Math.max(0, tokenExpiryTime - currentTime);
          
          // Set a timer to auto-logout when token expires
          setTimeout(() => {
            const state = get();
            if (state.isAuthenticated) {
              state.logout();
            }
          }, timeUntilExpiry);
        }
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          tokenExpiryTime: null,
        });
      },
      
      validateToken: () => {
        const { accessToken, tokenExpiryTime } = get();
        
        if (!accessToken || !tokenExpiryTime) {
          return false;
        }
        
        const currentTime = Date.now();
        return currentTime < tokenExpiryTime;
      },
      
      checkAndHandleTokenExpiry: () => {
        const { validateToken, logout } = get();
        
        if (!validateToken()) {
          logout();
          return false;
        }
        
        return true;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);