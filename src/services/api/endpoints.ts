
import getEnvVars from '../../config/env.config';

const env = getEnvVars('prod');

const API_URL = env.API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/v1/auth/login`,
    REGISTER: `${API_URL}/v1/auth/register`,
    VERIFY_EMAIL: `${API_URL}/v1/auth/verify-email`,
    RESET_PASSWORD: `${API_URL}/v1/auth/reset-password`,
    FORGOT_PASSWORD: `${API_URL}/v1/auth/forgot-password`,
    DELETE_USER: `${API_URL}/v1/user/deleteUser`
  },
  PROPERTIES: {
    LIST: `${API_URL}/v1/properties`,
    BY_USER: `${API_URL}/v1/properties/user/0`,
    PENDING: `${API_URL}/v1/properties/pending-approvals`,
    CREATE: `${API_URL}/v1/properties/createProperty`,
    MOST_VIEWED: `${API_URL}/v1/properties/most-viewed`,
    FAVORITES: `${API_URL}/v1/properties/favorites`,
    BOOKINGS: `${API_URL}/v1/properties/getBookingsByUserId`,
    getDetail: (id: string, userId: number) => 
      `${API_URL}/v1/properties/${id}/details/${userId}`,
    approve: (id: number) => 
      `${API_URL}/v1/properties/${id}/approve`,
    reject: (id: number) => 
      `${API_URL}/v1/properties/${id}/reject`,
    addFavorite: (propertyId: number) => 
      `${API_URL}/v1/properties/${propertyId}/favorites`,
    removeFavorite: (propertyId: number) => 
      `${API_URL}/v1/properties/removeFavorite/${propertyId}`,
    book: (propertyId: string | number) => 
      `${API_URL}/v1/properties/${propertyId}/bookProperty`,
    cancelBooking: (propertyId: string | number, bookingId: string | number) => 
      `${API_URL}/v1/properties/updateBooking/${propertyId}/${bookingId}`,
    delete: (id: number) => 
      `${API_URL}/v1/properties/deleteProperty/${id}`,
    update: (id: number) => 
      `${API_URL}/v1/properties/updateProperty/${id}`,
  },
  SERVICES: {
    LIST: `${API_URL}/v1/services/getService`,
    BY_USER: `${API_URL}/v1/services/user`,
    CREATE: `${API_URL}/v1/services/createService`,
    CATEGORIES: `${API_URL}/v1/services/getAllServiceCategories`,
    HOME_LOAN_CATEGORIES: `${API_URL}/v1/services/getAllHomeLoanCategories`,
    HOME_LOANS: `${API_URL}/v1/services/getHomeLoanServices`,
  },
}; 