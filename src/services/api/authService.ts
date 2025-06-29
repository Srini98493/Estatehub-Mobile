import { api } from './apiConfig';
import { API_ENDPOINTS } from './endpoints';

export interface LoginCredentials {
  email: string;
  password: string;
}

interface Token {
  token: string;
  expires: number;
}

interface Tokens {
  refresh: Token;
  access: Token;
}

export interface User {
  userid: number;
  fullname: string;
  username: string;
  areacode: string;
  contactno: string;
  useremail: string;
  socialemail: string;
  gender: string | null;
  dob: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  profileimagepath: string;
  isnotificationenabled: boolean;
  usertype: number;
  isactive: boolean;
  islogin: boolean;
  isadmin: boolean;
  createdby: number;
  createddate: string;
  updatedby: number;
  updateddate: string;
}

export interface LoginResponse {
  user: User;
  tokens: Tokens;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/v1/auth/login', credentials);
    return response.data;
  },
  // Add other auth-related API calls
}; 